import {
  isSameOrigin,
  jsonResponse,
  readJsonBody,
} from "./utils/admin-auth.mjs";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_PARSE_SERVER_URL = "https://parseapi.back4app.com";

function getParseConfiguration() {
  const applicationId = process.env.PARSE_APP_ID;
  const masterKey = process.env.PARSE_MASTER_KEY;
  const serverUrl = (
    process.env.PARSE_SERVER_URL || DEFAULT_PARSE_SERVER_URL
  ).replace(/\/+$/, "");

  if (!applicationId || !masterKey) {
    throw new Error("Back4App server credentials are not configured.");
  }

  return { applicationId, masterKey, serverUrl };
}

async function requestParse(path, options = {}) {
  const { applicationId, masterKey, serverUrl } = getParseConfiguration();
  const response = await fetch(`${serverUrl}${path}`, {
    ...options,
    headers: {
      "X-Parse-Application-Id": applicationId,
      "X-Parse-Master-Key": masterKey,
      "Content-Type": "application/json",
      ...options.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const error = new Error(`Back4App request failed with status ${response.status}.`);
    const data = await response.json().catch(() => null);
    error.code = data?.code;
    error.status = response.status;
    throw error;
  }

  return response.status === 204 ? null : response.json();
}

function isValidEmail(email) {
  return (
    typeof email === "string" &&
    email.length <= 254 &&
    EMAIL_PATTERN.test(email)
  );
}

export default async function handler(request) {
  if (request.method !== "POST") {
    return jsonResponse({ error: "method-not-allowed" }, 405, {
      Allow: "POST",
    });
  }

  if (!isSameOrigin(request)) {
    return jsonResponse({ error: "forbidden" }, 403);
  }

  let body;
  try {
    body = await readJsonBody(request, 2048);
  } catch {
    return jsonResponse({ error: "invalid-request" }, 400);
  }

  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!isValidEmail(email) || body.consentimento !== true) {
    return jsonResponse({ error: "invalid-registration" }, 400);
  }

  const origem =
    typeof body.origem === "string" && body.origem.startsWith("/")
      ? body.origem.slice(0, 200)
      : "/comprar";

  try {
    const query = new URLSearchParams({
      where: JSON.stringify({ email }),
      limit: "1",
      keys: "objectId",
    });
    const existing = await requestParse(
      `/classes/AvisoLancamento?${query}`,
    );

    if (existing?.results?.length) {
      return jsonResponse({ registered: true, alreadyRegistered: true });
    }

    await requestParse("/classes/AvisoLancamento", {
      method: "POST",
      body: JSON.stringify({ email, consentimento: true, origem }),
    });
    return jsonResponse({ registered: true }, 201);
  } catch (error) {
    if (error.code === 137) {
      return jsonResponse({ registered: true, alreadyRegistered: true });
    }

    console.error("Unable to register book interest.", error);
    return jsonResponse(
      { error: "registration-unavailable" },
      error.message.includes("not configured") ? 503 : 502,
    );
  }
}
