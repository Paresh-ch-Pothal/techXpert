// verificationAccess.js
//
// Small helper used to make sure /upload-video is only reachable by coming
// from a passed creator_verification result — not by typing the URL in
// directly or bookmarking it.
//
// How it works: right before we navigate to /upload-video we drop a
// short-lived flag in sessionStorage. The upload page checks for that flag
// on mount. If it's missing or expired, the visit didn't come from a real
// pass, so we send the user back to the dashboard instead of rendering the
// upload UI.
//
// sessionStorage (not localStorage) is used on purpose: it's tied to the
// current tab and clears when the tab closes, so it can't be replayed later
// or shared across tabs.

const STORAGE_KEY = "creatorVerification.access";
const VALID_FOR_MS = 10 * 60 * 1000; // 10 minutes is plenty to click through

export function markVerificationPass() {
  sessionStorage.setItem(STORAGE_KEY, String(Date.now()));
}

export function hasValidVerificationPass() {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return false;

  const grantedAt = Number(raw);
  const isExpired = Number.isNaN(grantedAt) || Date.now() - grantedAt > VALID_FOR_MS;
  return !isExpired;
}

export function clearVerificationPass() {
  sessionStorage.removeItem(STORAGE_KEY);
}