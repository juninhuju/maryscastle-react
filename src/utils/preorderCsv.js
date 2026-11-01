const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MAX_ROWS = 2500;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const REQUIRED_COLUMNS = [
  ["Nome completo", (header) => header === "nome completo"],
  ["E-mail", (header) => header === "e mail" || header === "email"],
  [
    "Telefone / WhatsApp (com DDD)",
    (header) => header.includes("telefone") && header.includes("whatsapp"),
  ],
  ["Cidade de entrega", (header) => header === "cidade de entrega"],
  [
    "Endereço completo para entrega",
    (header) => header.startsWith("endereco completo para entrega"),
  ],
  ["Quantidade de exemplares", (header) => header === "quantidade de exemplares"],
  ["Forma de pagamento", (header) => header === "forma de pagamento"],
];

function normalizeHeader(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function parseRows(text, delimiter) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];

    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
      continue;
    }

    if (character === '"' && !field) {
      quoted = true;
    } else if (character === delimiter) {
      row.push(field.trim());
      field = "";
    } else if (character === "\n" || character === "\r") {
      row.push(field.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      field = "";
      if (character === "\r" && text[index + 1] === "\n") index += 1;
    } else {
      field += character;
    }
  }

  if (quoted) {
    throw new Error("O CSV contém aspas sem fechamento.");
  }

  row.push(field.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

function getHeaderScore(headers) {
  const normalized = headers.map(normalizeHeader);
  return REQUIRED_COLUMNS.filter(([, matches]) =>
    normalized.some(matches),
  ).length;
}

function findColumnIndex(headers, matches) {
  return headers.findIndex((header) => matches(normalizeHeader(header)));
}

function getColumnKind(header) {
  const normalized = normalizeHeader(header);
  if (normalized === "carimbo de data hora") return "timestamp";
  if (normalized === "nome completo") return "name";
  if (normalized === "e mail" || normalized === "email") return "email";
  if (normalized.includes("telefone") && normalized.includes("whatsapp")) {
    return "phone";
  }
  if (normalized === "cidade de entrega") return "city";
  if (normalized.startsWith("endereco completo para entrega")) return "address";
  if (normalized === "quantidade de exemplares") return "quantity";
  if (normalized === "forma de pagamento") return "paymentMethod";
  if (
    normalized.includes("status") &&
    normalized.includes("pagamento")
  ) {
    return "paymentStatus";
  }
  if (
    normalized.startsWith("data do pagamento") ||
    normalized === "data pagamento"
  ) {
    return "paymentDate";
  }
  if (
    normalized.includes("valor") ||
    normalized.includes("total do pedido")
  ) {
    return "amount";
  }
  return `column:${normalized}`;
}

function findKindIndex(headers, kind) {
  return headers.findIndex((header) => getColumnKind(header) === kind);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function getOrderAmount(row, headers) {
  const amountIndex = findKindIndex(headers, "amount");
  if (amountIndex >= 0 && row[amountIndex]?.trim()) {
    return row[amountIndex].trim();
  }

  const quantityIndex = findKindIndex(headers, "quantity");
  const quantity = quantityIndex >= 0 ? row[quantityIndex] || "" : "";
  const currencyMatch = quantity.match(
    /r\$\s*([\d.]+,\d{2}|[\d,]+\.\d{2}|\d+(?:[.,]\d{1,2})?)/i,
  );
  if (currencyMatch) {
    const rawAmount = currencyMatch[1];
    const normalizedAmount = rawAmount.includes(",")
      ? rawAmount.replace(/\./g, "").replace(",", ".")
      : rawAmount;
    const parsedAmount = Number(normalizedAmount);
    if (Number.isFinite(parsedAmount)) return formatCurrency(parsedAmount);
  }

  const packageMatch = quantity.match(/(\d+)\s*exemplar/i);
  if (packageMatch) {
    return formatCurrency(Number(packageMatch[1]) * 55);
  }
  return "Não informado";
}

function getOrderKey(row, headers) {
  const timestampIndex = findKindIndex(headers, "timestamp");
  const emailIndex = findKindIndex(headers, "email");
  const timestamp = timestampIndex >= 0 ? row[timestampIndex]?.trim() : "";
  const email = emailIndex >= 0 ? row[emailIndex]?.trim().toLowerCase() : "";

  if (timestamp) return `${timestamp.toLowerCase()}\u0000${email}`;

  const fallbackKinds = ["name", "phone", "address", "quantity", "paymentMethod"];
  return [
    email,
    ...fallbackKinds.map((kind) => {
      const index = findKindIndex(headers, kind);
      return index >= 0 ? row[index]?.trim().toLowerCase() || "" : "";
    }),
  ].join("\u0000");
}

function alignRows(rows, sourceHeaders, targetHeaders, preserveBlankTracking = false) {
  const sourceIndexes = targetHeaders.map((header) =>
    findKindIndex(sourceHeaders, getColumnKind(header)),
  );
  const sourceQuantityIndex = findKindIndex(sourceHeaders, "quantity");

  return rows.map((row) =>
    targetHeaders.map((header, index) => {
      const sourceIndex = sourceIndexes[index];
      const kind = getColumnKind(header);
      if (sourceIndex >= 0) {
        const sourceValue = row[sourceIndex] ?? "";
        if (String(sourceValue).trim()) return sourceValue;
        if (preserveBlankTracking && ["amount", "paymentStatus"].includes(kind)) {
          return sourceValue;
        }
      }

      if (kind === "amount") return getOrderAmount(row, sourceHeaders);
      if (kind === "paymentStatus") return "Não informado";
      if (kind === "paymentDate") return "";
      if (kind === "quantity" && sourceQuantityIndex >= 0) {
        return row[sourceQuantityIndex]?.trim() || "";
      }
      return "";
    }),
  );
}

export function parsePreorderCsv(text) {
  if (typeof text !== "string" || !text.trim()) {
    throw new Error("O arquivo CSV está vazio.");
  }

  if (new TextEncoder().encode(text).length > MAX_FILE_BYTES) {
    throw new Error("O arquivo excede o limite de 5 MB.");
  }

  const content = text.replace(/^\uFEFF/, "");
  const candidates = [",", ";"]
    .map((delimiter) => {
      try {
        const rows = parseRows(content, delimiter);
        return { rows, score: getHeaderScore(rows[0] || []) };
      } catch (error) {
        return { error };
      }
    })
    .filter((candidate) => !candidate.error)
    .sort((left, right) => right.score - left.score);
  const parsed = candidates[0];

  if (!parsed) {
    throw new Error("O CSV contém aspas sem fechamento.");
  }

  const [headers, ...dataRows] = parsed.rows;
  const normalizedHeaders = headers.map(normalizeHeader);
  const missingColumns = REQUIRED_COLUMNS.filter(([, matches]) =>
    !normalizedHeaders.some(matches),
  ).map(([name]) => name);

  if (missingColumns.length) {
    throw new Error(
      `Não encontrei as colunas obrigatórias: ${missingColumns.join(", ")}.`,
    );
  }

  const rows = dataRows.filter((row) => row.some(Boolean));
  if (!rows.length) {
    throw new Error("O CSV não contém respostas para importar.");
  }
  if (rows.length > MAX_ROWS) {
    throw new Error(`O CSV excede o limite de ${MAX_ROWS} respostas.`);
  }

  const emailIndex = findColumnIndex(headers, (header) =>
    header === "e mail" || header === "email",
  );
  const cityIndex = findColumnIndex(
    headers,
    (header) => header === "cidade de entrega",
  );
  const invalidRows = [];

  rows.forEach((row, index) => {
    const email = row[emailIndex] || "";
    const city = normalizeHeader(row[cityIndex] || "");
    const rowErrors = [];

    if (!EMAIL_PATTERN.test(email)) rowErrors.push("e-mail inválido");
    if (!["birigui sp", "aracatuba sp"].includes(city)) {
      rowErrors.push("cidade fora das opções permitidas");
    }
    if (rowErrors.length) {
      invalidRows.push(`linha ${index + 2}: ${rowErrors.join(" e ")}`);
    }
  });

  if (invalidRows.length) {
    const shownErrors = invalidRows.slice(0, 5).join("; ");
    const remaining = invalidRows.length - 5;
    throw new Error(
      `Revise ${shownErrors}${remaining > 0 ? `; e mais ${remaining} linha(s)` : ""}.`,
    );
  }

  return {
    headers,
    rows: rows.map((row) =>
      headers.map((_, index) => row[index] || ""),
    ),
  };
}

export function mergePreorderOrders(existing, incoming) {
  const currentHeaders = existing?.headers || [];
  const incomingHeaders = incoming?.headers || [];
  const headers = [...currentHeaders];
  const knownKinds = new Set(headers.map(getColumnKind));

  for (const header of incomingHeaders) {
    const kind = getColumnKind(header);
    if (!knownKinds.has(kind)) {
      headers.push(header);
      knownKinds.add(kind);
    }
  }

  for (const [kind, label] of [
    ["amount", "Valor do pedido (R$)"],
    ["paymentStatus", "Status do pagamento"],
    ["paymentDate", "Data do pagamento"],
  ]) {
    if (!knownKinds.has(kind)) {
      headers.push(label);
      knownKinds.add(kind);
    }
  }

  const rows = alignRows(
    existing?.rows || [],
    currentHeaders,
    headers,
    true,
  );
  const seen = new Set(rows.map((row) => getOrderKey(row, headers)));
  let addedCount = 0;
  let skippedCount = 0;
  const incomingRows = alignRows(
    incoming?.rows || [],
    incomingHeaders,
    headers,
  );

  for (const row of incomingRows) {
    const key = getOrderKey(row, headers);
    if (seen.has(key)) {
      skippedCount += 1;
      continue;
    }

    seen.add(key);
    rows.push(row);
    addedCount += 1;
  }

  if (rows.length > MAX_ROWS) {
    throw new Error(`O total excede o limite de ${MAX_ROWS} respostas.`);
  }

  return {
    headers,
    rows,
    addedCount,
    skippedCount,
    truncated: existing?.truncated === true || incoming?.truncated === true,
    updatedAt: incoming?.updatedAt || existing?.updatedAt || new Date().toISOString(),
  };
}
