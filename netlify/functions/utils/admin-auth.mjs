import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "junioradm_session";
export const ADMIN_SESSION_MAX_AGE = 8 * 60 * 60;

export function getAdminConfiguration() {
  const password = process.env.ADMIN_PASSWORD || "";
  const secret = process.env.ADMIN_SESSION_SECRET || "";

  return {
    configured: password.length >= 16 && secret.length >= 32,
    password,
    secret,
  };
}

export function jsonResponse(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Cache-Control": "no-store, private",
      "Content-Type": "application/json; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      ...headers,
    },
  });
}

export function isSameOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

function getCookie(request, name) {
  const cookies = request.headers.get("cookie") || "";
  const prefix = `${name}=`;
  const cookie = cookies
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));

  return cookie?.slice(prefix.length) || "";
}

function signExpiry(expiry, secret) {
  return createHmac("sha256", secret)
    .update(`junioradm:${expiry}`)
    .digest("base64url");
}

export function createAdminSession(secret, now = Date.now()) {
  const expiry = Math.floor(now / 1000) + ADMIN_SESSION_MAX_AGE;
  return `${expiry}.${signExpiry(expiry, secret)}`;
}

export function isAdminSessionValid(request, secret, now = Date.now()) {
  const token = getCookie(request, ADMIN_SESSION_COOKIE);
  const [expiry, signature, extra] = token.split(".");
  const expirySeconds = Number(expiry);

  if (
    !expiry ||
    !signature ||
    extra ||
    !Number.isSafeInteger(expirySeconds) ||
    expirySeconds <= Math.floor(now / 1000) ||
    expirySeconds > Math.floor(now / 1000) + ADMIN_SESSION_MAX_AGE
  ) {
    return false;
  }

  const expected = Buffer.from(signExpiry(expiry, secret));
  const received = Buffer.from(signature);
  return (
    expected.length === received.length && timingSafeEqual(expected, received)
  );
}

export function passwordsMatch(candidate, expected) {
  const candidateBuffer = Buffer.from(candidate);
  const expectedBuffer = Buffer.from(expected);
  return (
    candidateBuffer.length === expectedBuffer.length &&
    timingSafeEqual(candidateBuffer, expectedBuffer)
  );
}

export function sessionCookie(request, value, maxAge) {
  const secure =
    process.env.NODE_ENV === "production" ||
    process.env.CONTEXT === "production"
      ? "; Secure"
      : "";

  return `${ADMIN_SESSION_COOKIE}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`;
}

export async function readJsonBody(request, maximumBytes = 4096) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > maximumBytes) {
    throw new Error("Request body is too large.");
  }

  const text = await request.text();
  if (Buffer.byteLength(text) > maximumBytes) {
    throw new Error("Request body is too large.");
  }

  const body = JSON.parse(text);
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new Error("Request body must be a JSON object.");
  }

  return body;
}
