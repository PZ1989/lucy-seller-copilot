"use client";

import { FormEvent, KeyboardEvent, useRef, useState } from "react";
import { Icon } from "./icons";

const suggestions = [
  "Which listings should I optimize first?",
  "Find three keyword opportunities",
  "Summarize my shop performance",
];

export function AskLucy() {
  const [message, setMessage] = useState("");
  const [lastQuestion, setLastQuestion] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = message.trim();
    if (!value) return;
    setLastQuestion(value);
    setMessage("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  function selectSuggestion(suggestion: string) {
    setMessage(suggestion);
    inputRef.current?.focus();
  }

  return (
    <section
      id="ask-lucy"
      aria-labelledby="ask-lucy-title"
      className="scroll-mt-24 overflow-hidden rounded-[26px] border border-charcoal/[0.07] bg-white"
    >
      <div className="border-b border-charcoal/[0.07] p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="relative grid size-10 shrink-0 place-items-center rounded-[14px] bg-charcoal text-sm font-semibold text-white">
            L
            <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-white bg-[#55A97C]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 id="ask-lucy-title" className="text-lg font-semibold tracking-[-0.03em] text-charcoal">
                Ask Lucy
              </h2>
              <span className="rounded-full bg-mist/20 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-[#52758C]">
                Preview
              </span>
            </div>
            <p className="mt-1 text-[11px] leading-5 text-charcoal/45">
              Ask about your shop, listings, research, or next best action.
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-[18px] bg-[#F7F4F1] p-4">
          <p className="text-[11px] leading-[1.65] text-charcoal/62">
            I’ve reviewed your mock dashboard. Revenue is up, and your strongest opportunity is improving the
            search position of 12 high-converting listings. Where would you like to start?
          </p>
        </div>

        {lastQuestion && (
          <div className="mt-3 space-y-2" aria-live="polite">
            <div className="ml-8 rounded-[16px_16px_4px_16px] bg-charcoal px-4 py-3 text-[11px] leading-5 text-white/85">
              {lastQuestion}
            </div>
            <div className="mr-8 rounded-[16px_16px_16px_4px] border border-terracotta/10 bg-terracotta/[0.045] px-4 py-3 text-[11px] leading-5 text-charcoal/62">
              This is a UI-only preview, so no request was sent. Once Lucy is connected, I’ll use your shop data
              to build a focused answer here.
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-1.5">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => selectSuggestion(suggestion)}
              className="rounded-full border border-charcoal/[0.09] px-3 py-2 text-left text-[9px] font-medium text-charcoal/52 transition hover:border-terracotta/25 hover:bg-terracotta/[0.035] hover:text-terracotta"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={submitMessage} className="p-4 sm:p-5">
        <div className="flex items-end gap-2 rounded-[18px] border border-charcoal/[0.09] bg-white p-2 transition focus-within:border-terracotta/35 focus-within:ring-4 focus-within:ring-terracotta/[0.06]">
          <button
            type="button"
            aria-label="Add an attachment"
            className="grid size-9 shrink-0 place-items-center rounded-xl text-charcoal/35 transition hover:bg-linen/45 hover:text-charcoal"
          >
            <Icon name="plus" size={17} />
          </button>
          <textarea
            id="ask-lucy-input"
            ref={inputRef}
            rows={1}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Lucy anything about your shop..."
            className="max-h-28 min-h-9 flex-1 resize-none bg-transparent px-1 py-2 text-xs leading-5 text-charcoal outline-none placeholder:text-charcoal/34"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            aria-label="Send message"
            className="grid size-9 shrink-0 place-items-center rounded-xl bg-terracotta text-white shadow-[0_8px_20px_rgba(247,78,3,0.2)] transition hover:bg-[#E94702] disabled:cursor-not-allowed disabled:bg-charcoal/10 disabled:text-charcoal/25 disabled:shadow-none"
          >
            <Icon name="send" size={15} />
          </button>
        </div>
        <p className="mt-2 text-center text-[9px] text-charcoal/30">Demo workspace · No data leaves this page</p>
      </form>
    </section>
  );
}
