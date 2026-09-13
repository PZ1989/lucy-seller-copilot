# Etsy Commercial Access Checklist

Use this checklist before submitting or updating Etsy Commercial Access. Do not submit automatically from this repository.

## Application Status

- [ ] Confirm Personal App status and the account that owns the application.
- [ ] Determine whether Commercial Access is required for the planned production usage.
- [ ] Record the Etsy application key and secret only in backend secret storage.

## Production URLs

- [ ] Production homepage URL: `TBD`
- [ ] Privacy Policy URL: `https://<production-host>/legal/privacy`
- [ ] Terms of Service URL: `https://<production-host>/legal/terms`
- [ ] OAuth callback URL: `TBD - backend-owned callback`
- [ ] Support contact: `support@enjoyagency.com.ua`

## OAuth And API Scope Review

- [ ] List each requested Etsy OAuth scope.
- [ ] Document why each scope is required for a user-requested feature.
- [ ] Confirm API-only access for Etsy data.
- [ ] Confirm no scraping is used.
- [ ] Confirm OAuth access and refresh tokens remain backend-only and are never exposed to the browser.
- [ ] Confirm token revocation and disconnect procedures are documented.

## Submission Materials

- [ ] Describe the Etsy seller workflow supported by Lucy Seller Copilot.
- [ ] Provide current production or staging screenshots/demo.
- [ ] Explain data minimization, retention, deletion, and access controls.
- [ ] Provide a data security summary: HTTPS, secure httpOnly session cookies, backend secret storage, least-privilege scopes, and audit logging.
- [ ] Add the Etsy trademark disclaimer to public product materials where appropriate:

> The term 'Etsy' is a trademark of Etsy, Inc. This application uses the Etsy API but is not endorsed or certified by Etsy, Inc.

## Phase 1 Backend Contract

The frontend Phase 1 expects the backend to provide cookie-authenticated JSON endpoints:

- `GET /api/auth/session`
- `GET /api/etsy/connection`
- `GET /api/etsy/oauth/start` returning `{ "redirectUrl": "..." }`
- `DELETE /api/etsy/connection`

The backend owns OAuth callback handling. It must return the user to `/connections` after authorization and must never return OAuth tokens to the frontend.
