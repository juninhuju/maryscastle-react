import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import { createServer } from "vite";

const projectDirectory = dirname(dirname(fileURLToPath(import.meta.url)));
const outputDirectory = join(projectDirectory, "dist");
const rootTemplate = await readFile(join(outputDirectory, "index.html"), "utf8");

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function upsertMeta(html, attribute, value, content) {
  const tagPattern = new RegExp(
    `<meta\\b(?=[^>]*\\b${attribute}="${escapeRegExp(value)}")[^>]*>`,
    "i",
  );
  const escapedContent = escapeHtml(content);

  if (tagPattern.test(html)) {
    return html.replace(tagPattern, (tag) =>
      /\bcontent="/i.test(tag)
        ? tag.replace(/\bcontent="[^"]*"/i, `content="${escapedContent}"`)
        : tag.replace(/\s*\/?>$/, ` content="${escapedContent}" />`),
    );
  }

  return html.replace(
    "</head>",
    `  <meta ${attribute}="${escapeHtml(value)}" content="${escapedContent}" />\n  </head>`,
  );
}

function setCanonical(html, url) {
  const tagPattern = /<link\b(?=[^>]*\brel="canonical")[^>]*>/i;
  const escapedUrl = escapeHtml(url);

  if (tagPattern.test(html)) {
    return html.replace(tagPattern, (tag) =>
      tag.replace(/\bhref="[^"]*"/i, `href="${escapedUrl}"`),
    );
  }

  return html.replace(
    "</head>",
    `  <link rel="canonical" href="${escapedUrl}" />\n  </head>`,
  );
}

function applyMetadata(html, metadata) {
  html = html.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapeHtml(metadata.title)}</title>`,
  );

  for (const [attribute, value, content] of [
    ["name", "description", metadata.description],
    [
      "name",
      "robots",
      metadata.noIndex ? "noindex, nofollow" : "index, follow",
    ],
    ["property", "og:title", metadata.title],
    ["property", "og:description", metadata.description],
    ["property", "og:type", "website"],
    ["property", "og:url", metadata.canonicalUrl],
    ["property", "og:image", metadata.imageUrl],
    ["property", "og:locale", "pt_BR"],
    ["name", "twitter:card", "summary_large_image"],
    ["name", "twitter:title", metadata.title],
    ["name", "twitter:description", metadata.description],
    ["name", "twitter:image", metadata.imageUrl],
  ]) {
    html = upsertMeta(html, attribute, value, content);
  }

  html = setCanonical(html, metadata.canonicalUrl);
  html = html.replace(
    /<script\b(?=[^>]*data-seo="structured-data")[^>]*>[\s\S]*?<\/script>/gi,
    "",
  );
  const structuredData = JSON.stringify(metadata.structuredData).replace(
    /</g,
    "\\u003c",
  );

  return html.replace(
    "</head>",
    `  <script type="application/ld+json" data-seo="structured-data">${structuredData}</script>\n  </head>`,
  );
}

const vite = await createServer({
  appType: "custom",
  server: { middlewareMode: true },
});

try {
  const [{ AppContent }, { getSeoMetadata, prerenderPaths }] =
    await Promise.all([
      vite.ssrLoadModule("/src/App.jsx"),
      vite.ssrLoadModule("/src/data/seo.js"),
    ]);

  for (const route of prerenderPaths) {
    const appHtml = renderToString(
      createElement(
        StaticRouter,
        { location: route },
        createElement(AppContent),
      ),
    );
    const routeHtml = applyMetadata(rootTemplate, getSeoMetadata(route)).replace(
      '<div id="root"></div>',
      `<div id="root" data-prerender-path="${escapeHtml(route)}">${appHtml}</div>`,
    );

    if (routeHtml === rootTemplate) {
      throw new Error(`Não foi possível gerar o HTML pré-renderizado de ${route}.`);
    }

    const routeDirectory =
      route === "/" ? outputDirectory : join(outputDirectory, route.slice(1));
    await mkdir(routeDirectory, { recursive: true });
    await writeFile(join(routeDirectory, "index.html"), routeHtml);
  }

  console.log(`HTML pré-renderizado para ${prerenderPaths.length} rotas.`);
} finally {
  await vite.close();
}
