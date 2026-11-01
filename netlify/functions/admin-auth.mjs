import {
  ADMIN_SESSION_MAX_AGE,
  createAdminSession,
  getAdminConfiguration,
  isAdminSessionValid,
  isSameOrigin,
  jsonResponse,
  passwordsMatch,
  readJsonBody,
  sessionCookie,
} from "./utils/admin-auth.mjs";

export default async function handler(request) {
  const { configured, password, secret } = getAdminConfiguration();

  if (request.method === "GET") {
    if (!configured) {
      return jsonResponse({ configured: false, authenticated: false });
    }

    return jsonResponse({
      configured: true,
      authenticated: isAdminSessionValid(request, secret),
    });
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "method-not-allowed" }, 405, {
      Allow: "GET, POST",
    });
  }

  if (!isSameOrigin(request)) {
    return jsonResponse({ error: "forbidden" }, 403);
  }

  if (!configured) {
    return jsonResponse({ error: "admin-not-configured" }, 503);
  }

  let body;
  try {
    body = await readJsonBody(request);
  } catch {
    return jsonResponse({ error: "invalid-request" }, 400);
  }

  if (body.action === "logout") {
    return jsonResponse(
      { authenticated: false },
      200,
      { "Set-Cookie": sessionCookie(request, "", 0) },
    );
  }

  if (body.action !== "login" || typeof body.password !== "string") {
    return jsonResponse({ error: "invalid-request" }, 400);
  }

  if (body.password.length > 256 || !passwordsMatch(body.password, password)) {
    return jsonResponse({ error: "invalid-credentials" }, 401);
  }

  const token = createAdminSession(secret);
  return jsonResponse(
    { authenticated: true },
    200,
    {
      "Set-Cookie": sessionCookie(request, token, ADMIN_SESSION_MAX_AGE),
    },
  );
}
