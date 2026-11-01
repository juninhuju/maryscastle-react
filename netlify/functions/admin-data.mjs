import { sign } from "node:crypto";
import nodemailer from "nodemailer";
import {
  getAdminConfiguration,
  isAdminSessionValid,
  isSameOrigin,
  jsonResponse,
  passwordsMatch,
  readJsonBody,
} from "./utils/admin-auth.mjs";

const PARSE_PAGE_SIZE = 1000;
const MAX_PARSE_OBJECTS = 10000;
const MAX_ORDER_ROWS = 2500;
const MAX_CAMPAIGN_RECIPIENTS = 450;
const SENDER_EMAIL = "ocastelodasmarias@gmail.com";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_SHEETS_API = "https://sheets.googleapis.com/v4/spreadsheets";

function getParseConfiguration() {
  const applicationId = process.env.PARSE_APP_ID;
  const masterKey = process.env.PARSE_MASTER_KEY;
  const serverUrl = (
    process.env.PARSE_SERVER_URL || "https://parseapi.back4app.com"
  ).replace(/\/+$/, "");

  if (!applicationId || !masterKey) {
    throw new Error("Back4App server credentials are not configured.");
  }

  return { applicationId, masterKey, serverUrl };
}

async function fetchParseJson(url, options = {}) {
  const { applicationId, masterKey } = getParseConfiguration();
  const response = await fetch(url, {
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

async function fetchParseClass(className, fields, where = {}) {
  const { serverUrl } = getParseConfiguration();
  const results = [];

  for (let skip = 0; skip < MAX_PARSE_OBJECTS; skip += PARSE_PAGE_SIZE) {
    const query = new URLSearchParams({
      limit: String(PARSE_PAGE_SIZE),
      skip: String(skip),
      order: "-createdAt",
      keys: `objectId,createdAt,${fields.join(",")}`,
      ...(Object.keys(where).length && { where: JSON.stringify(where) }),
    });
    const data = await fetchParseJson(
      `${serverUrl}/classes/${className}?${query}`,
    );
    const page = Array.isArray(data?.results) ? data.results : [];
    results.push(...page);

    if (page.length < PARSE_PAGE_SIZE) {
      return { results, truncated: false };
    }
  }

  return { results, truncated: true };
}

function validEmail(value) {
  return (
    typeof value === "string" &&
    value.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  );
}

function emailRequestError(code, status = 400) {
  const error = new Error(code);
  error.code = code;
  error.status = status;
  return error;
}

async function sendAdministratorEmail(body) {
  if (
    typeof body.password !== "string" ||
    body.password.length > 256 ||
    !passwordsMatch(body.password, getAdminConfiguration().password)
  ) {
    throw emailRequestError("invalid-credentials", 401);
  }

  if (
    !["test", "subscribers"].includes(body.mode) ||
    typeof body.subject !== "string" ||
    !body.subject.trim() ||
    body.subject.trim().length > 200 ||
    /[\r\n]/.test(body.subject) ||
    typeof body.text !== "string" ||
    !body.text.trim() ||
    body.text.length > 5000
  ) {
    throw emailRequestError("invalid-email-request");
  }
  if (body.mode === "test" && !validEmail(body.to)) {
    throw emailRequestError("invalid-email-recipient");
  }

  const appPassword = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
  if (!appPassword) {
    throw emailRequestError("email-not-configured", 503);
  }

  let recipients;
  if (body.mode === "test") {
    recipients = [body.to.trim().toLowerCase()];
  } else {
    const emailData = await fetchParseClass(
      "AvisoLancamento",
      ["email"],
      { consentimento: true },
    );
    if (emailData.truncated) {
      throw emailRequestError("email-list-truncated", 409);
    }

    recipients = [
      ...new Set(
        emailData.results
          .map(({ email }) =>
            typeof email === "string" ? email.trim().toLowerCase() : "",
          )
          .filter(validEmail),
      ),
    ];
    if (!recipients.length) {
      throw emailRequestError("no-subscribed-emails", 409);
    }
    if (recipients.length > MAX_CAMPAIGN_RECIPIENTS) {
      throw emailRequestError("email-recipient-limit", 409);
    }
  }

  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: SENDER_EMAIL, pass: appPassword },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
  });

  const messageText = [
    body.text.trim(),
    "",
    "---",
    "Você recebe esta mensagem porque se cadastrou para receber novidades de O Castelo das Marias.",
    `Para deixar de receber estes e-mails, responda a esta mensagem ou escreva para ${SENDER_EMAIL}.`,
  ].join("\n");

  try {
    const delivery = await transport.sendMail({
      from: { name: "O Castelo das Marias", address: SENDER_EMAIL },
      to: body.mode === "test" ? recipients[0] : SENDER_EMAIL,
      ...(body.mode === "subscribers" && { bcc: recipients }),
      replyTo: SENDER_EMAIL,
      subject: body.subject.trim(),
      text: messageText,
    });

    const accepted = new Set(
      (delivery.accepted || []).map((address) =>
        String(address).toLowerCase(),
      ),
    );
    const acceptedCount = recipients.filter((address) =>
      accepted.has(address),
    ).length;
    if (!acceptedCount) {
      throw emailRequestError("email-send-failed", 502);
    }

    return {
      mode: body.mode,
      recipientCount: acceptedCount,
      rejectedCount: recipients.length - acceptedCount,
      recipient: body.mode === "test" ? recipients[0] : undefined,
    };
  } finally {
    transport.close();
  }
}

async function loadDashboard() {
  const [emailData, commentData] = await Promise.all([
    fetchParseClass("AvisoLancamento", [
      "email",
      "consentimento",
      "origem",
    ]),
    fetchParseClass("Comentario", ["nome", "texto"]),
  ]);

  return {
    emails: emailData.results.map(({ email, consentimento, origem, createdAt }) => ({
      email: typeof email === "string" ? email : "",
      consentimento: consentimento === true,
      origem: typeof origem === "string" ? origem : "",
      createdAt: typeof createdAt === "string" ? createdAt : "",
    })),
    emailListTruncated: emailData.truncated,
    comments: commentData.results.map(
      ({ objectId, nome, texto, createdAt }) => ({
        objectId: typeof objectId === "string" ? objectId : "",
        nome: typeof nome === "string" ? nome : "",
        texto: typeof texto === "string" ? texto : "",
        createdAt: typeof createdAt === "string" ? createdAt : "",
      }),
    ),
    commentsTruncated: commentData.truncated,
  };
}

function base64UrlJson(value) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

async function getGoogleAccessToken() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawPrivateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  const privateKey = rawPrivateKey?.replace(/\\n/g, "\n");

  if (!email || !privateKey) {
    throw new Error("Google service-account credentials are not configured.");
  }

  const issuedAt = Math.floor(Date.now() / 1000);
  const unsignedToken = [
    base64UrlJson({ alg: "RS256", typ: "JWT" }),
    base64UrlJson({
      iss: email,
      scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
      aud: GOOGLE_TOKEN_URL,
      iat: issuedAt,
      exp: issuedAt + 3600,
    }),
  ].join(".");
  const signature = sign(
    "RSA-SHA256",
    Buffer.from(unsignedToken),
    privateKey,
  ).toString("base64url");
  const assertion = `${unsignedToken}.${signature}`;
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Google authentication failed with status ${response.status}.`,
    );
  }

  const data = await response.json();
  if (typeof data.access_token !== "string") {
    throw new Error("Google did not return an access token.");
  }
  return data.access_token;
}

async function googleGet(url, accessToken) {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Google Sheets request failed with status ${response.status}.`);
  }
  return response.json();
}

async function loadFormResponses() {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID || "";
  if (!/^[A-Za-z0-9_-]+$/.test(spreadsheetId)) {
    throw new Error("Google response spreadsheet is not configured.");
  }

  const accessToken = await getGoogleAccessToken();
  let range = process.env.GOOGLE_SHEET_RANGE;
  if (!range) {
    const metadata = await googleGet(
      `${GOOGLE_SHEETS_API}/${encodeURIComponent(spreadsheetId)}?fields=sheets.properties.title`,
      accessToken,
    );
    const sheetTitle = metadata.sheets?.[0]?.properties?.title;
    if (!sheetTitle) {
      throw new Error("The response spreadsheet does not contain a worksheet.");
    }
    range = `'${sheetTitle.replace(/'/g, "''")}'!A:Z`;
  }

  const query = new URLSearchParams({ valueRenderOption: "FORMATTED_VALUE" });
  const data = await googleGet(
    `${GOOGLE_SHEETS_API}/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}?${query}`,
    accessToken,
  );
  const values = Array.isArray(data.values) ? data.values : [];
  const headers = (values[0] || []).map((value, index) =>
    String(value || "").trim() || `Coluna ${index + 1}`,
  );
  const allRows = values
    .slice(1)
    .filter((row) => row.some((value) => String(value ?? "").trim() !== ""));

  return {
    headers,
    rows: allRows.slice(0, MAX_ORDER_ROWS).map((row) =>
      headers.map((_, index) => String(row[index] ?? "")),
    ),
    truncated: allRows.length > MAX_ORDER_ROWS,
    updatedAt: new Date().toISOString(),
  };
}

export default async function handler(request) {
  const { configured, secret } = getAdminConfiguration();
  if (!configured || !isAdminSessionValid(request, secret)) {
    return jsonResponse({ error: "unauthorized" }, 401);
  }

  if (request.method === "GET") {
    const action = new URL(request.url).searchParams.get("action");
    if (action !== "dashboard") {
      return jsonResponse({ error: "invalid-action" }, 400);
    }

    try {
      return jsonResponse(await loadDashboard());
    } catch (error) {
      console.error("Unable to load administrator dashboard data.", error);
      return jsonResponse(
        { error: "dashboard-data-unavailable" },
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
    body = await readJsonBody(request, 24000);
  } catch {
    return jsonResponse({ error: "invalid-request" }, 400);
  }

  if (body.action === "send-email") {
    try {
      return jsonResponse(await sendAdministratorEmail(body));
    } catch (error) {
      if (error.code === "invalid-credentials") {
        return jsonResponse({ error: error.code }, error.status);
      }
      if (error.code?.startsWith("invalid-email-")) {
        return jsonResponse({ error: error.code }, error.status || 400);
      }
      if (
        [
          "email-not-configured",
          "email-list-truncated",
          "email-recipient-limit",
          "no-subscribed-emails",
        ].includes(error.code)
      ) {
        return jsonResponse({ error: error.code }, error.status);
      }
      if (error.code === "email-send-failed") {
        return jsonResponse({ error: error.code }, error.status);
      }
      if (error.message === "Back4App server credentials are not configured.") {
        return jsonResponse({ error: "email-list-unavailable" }, 503);
      }

      console.error("Unable to send administrator email.", {
        code: error.code || "smtp-delivery-error",
      });
      return jsonResponse({ error: "email-send-failed" }, 502);
    }
  }

  if (body.action === "refresh-orders") {
    try {
      return jsonResponse(await loadFormResponses());
    } catch (error) {
      console.error("Unable to import preorder form responses.", error);
      return jsonResponse(
        {
          error: "form-responses-unavailable",
          message: error.message.includes("not configured")
            ? "Configure o acesso seguro à planilha de respostas no Netlify."
            : "Não foi possível atualizar as respostas. Confira o acesso à planilha e tente novamente.",
        },
        error.message.includes("not configured") ? 503 : 502,
      );
    }
  }

  if (body.action === "delete-comment") {
    if (typeof body.objectId !== "string" || !/^[A-Za-z0-9]{10}$/.test(body.objectId)) {
      return jsonResponse({ error: "invalid-comment-id" }, 400);
    }

    try {
      const { serverUrl } = getParseConfiguration();
      await fetchParseJson(
        `${serverUrl}/classes/Comentario/${encodeURIComponent(body.objectId)}`,
        { method: "DELETE" },
      );
      return jsonResponse({ deleted: true });
    } catch (error) {
      console.error("Unable to delete administrator comment.", error);
      return jsonResponse(
        { error: "comment-delete-failed" },
        error.message.includes("not configured") ? 503 : 502,
      );
    }
  }

  return jsonResponse({ error: "invalid-action" }, 400);
}
