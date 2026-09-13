"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getSession } from "@/lib/api/auth";
import { apiBaseUrl } from "@/lib/api/client";
import { disconnectEtsy, getEtsyConnection } from "@/lib/api/etsy";
import { ApiError, type AuthenticatedUser, type ConnectedShop, type EtsyConnection } from "@/lib/api/types";

type SessionStatus = "loading" | "authenticated" | "unauthenticated" | "unavailable";

type SessionContextValue = {
  status: SessionStatus;
  user: AuthenticatedUser | null;
  etsyConnection: EtsyConnection | null;
  primaryShop: ConnectedShop | null;
  error: ApiError | null;
  refresh: () => Promise<void>;
  connectEtsy: () => Promise<void>;
  disconnectEtsy: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

function shopFromConnection(connection: EtsyConnection | null): ConnectedShop | null {
  if (!connection?.connected || !connection.shopId || !connection.shopName) return null;
  return { id: connection.shopId, name: connection.shopName, connected: true };
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<SessionStatus>("loading");
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [etsyConnection, setEtsyConnection] = useState<EtsyConnection | null>(null);
  const [error, setError] = useState<ApiError | null>(null);

  async function refresh() {
    setStatus("loading");
    setError(null);
    try {
      const session = await getSession();
      setUser(session.user);
      setStatus("authenticated");
      try {
        setEtsyConnection(await getEtsyConnection());
      } catch (connectionError) {
        if (connectionError instanceof ApiError && connectionError.code === "unauthenticated") throw connectionError;
        setEtsyConnection(null);
      }
    } catch (sessionError) {
      setUser(null);
      setEtsyConnection(null);
      const apiError = sessionError instanceof ApiError ? sessionError : new ApiError("The API is unavailable.", "unavailable");
      setError(apiError);
      setStatus(apiError.code === "unauthenticated" ? "unauthenticated" : "unavailable");
    }
  }

  useEffect(() => { void refresh(); }, []);

  async function connectEtsy() {
    window.open(`${apiBaseUrl()}/oauth/etsy/start`, "_self");
  }

  async function removeEtsyConnection() {
    await disconnectEtsy(etsyConnection?.shopId ?? undefined);
    await refresh();
  }

  return <SessionContext.Provider value={{ status, user, etsyConnection, primaryShop: shopFromConnection(etsyConnection), error, refresh, connectEtsy, disconnectEtsy: removeEtsyConnection }}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useSession must be used inside SessionProvider");
  return context;
}
