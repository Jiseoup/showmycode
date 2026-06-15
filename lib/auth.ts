import { timingSafeEqual, createHmac } from "crypto";

const COOKIE_NAME = "smc_auth";

// HMAC key derived from the SHARE_TOKEN itself. This is acceptable because the
// goal is not to protect the token from the server (which already knows it) but
// to avoid storing the raw token in the client cookie.
function hmacSign(value: string): string {
  return createHmac("sha256", value).update("smc_cookie").digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

// Constant-time comparison of a submitted token against the expected SHARE_TOKEN.
export function verifyToken(submitted: string, expected: string): boolean {
  return safeEqual(submitted, expected);
}

// Value to store in the auth cookie (HMAC of the token, not the raw token).
export function cookieValue(token: string): string {
  return hmacSign(token);
}

// Check whether a cookie value is valid for the given SHARE_TOKEN.
export function verifyCookie(value: string, token: string): boolean {
  return safeEqual(value, hmacSign(token));
}

export { COOKIE_NAME };
