import {
  isSameOrigin,
  jsonResponse,
  readJsonBody,
} from "./utils/admin-auth.mjs";

const DEFAULT_PARSE_SERVER_URL = "https://parseapi.back4app.com";
const COMMENT_FIELDS = "objectId,createdAt,nome,texto";

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
    throw new Error(`Back4App request failed with status ${response.status}.`);
  }

  return response.status === 204 ? null : response.json();
}

async function listComments() {
  const query = new URLSearchParams({
    limit: "1000",
    order: "-createdAt",
    keys: COMMENT_FIELDS,
  });
  const data = await requestParse(`/classes/Comentario?${query}`);
  return Array.isArray(data?.results) ? data.results : [];
}

export default async function handler(request) {
  if (request.method === "GET") {
    try {
      return jsonResponse({ results: await listComments() });
    } catch (error) {
      console.error("Unable to load public comments.", error);
      return jsonResponse(
        { error: "comments-unavailable" },
        error.message.includes("not configured") ? 503 : 502,
      );
    }
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "method-not-allowed" }, 405, {
      Allow: "GET, POST",
    });
  }

  if (!isSameOrigin(request)) {
    return jsonResponse({ error: "forbidden" }, 403);
  }

  let body;
  try {
    body = await readJsonBody(request, 4096);
  } catch {
    return jsonResponse({ error: "invalid-request" }, 400);
  }

  const nome = typeof body.nome === "string" ? body.nome.trim() : "";
  const texto = typeof body.texto === "string" ? body.texto.trim() : "";
  if (!nome || nome.length > 80 || !texto || texto.length > 1000) {
    return jsonResponse({ error: "invalid-comment" }, 400);
  }

  try {
    await requestParse("/classes/Comentario", {
      method: "POST",
      body: JSON.stringify({ nome, texto }),
    });
    return jsonResponse({ created: true }, 201);
  } catch (error) {
    console.error("Unable to publish public comment.", error);
    return jsonResponse(
      { error: "comment-unavailable" },
      error.message.includes("not configured") ? 503 : 502,
    );
  }
}
