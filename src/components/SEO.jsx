import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getSeoMetadata } from "../data/seo";

function setMetaAttribute(attribute, value, content) {
  let element = document.head.querySelector(`meta[${attribute}="${value}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function SEO() {
  const { pathname } = useLocation();

  useEffect(() => {
    const {
      title,
      description,
      imageUrl,
      canonicalUrl,
      isNotFound,
      structuredData,
    } = getSeoMetadata(pathname);

    document.title = title;
    document.documentElement.lang = "pt-BR";

    setMetaAttribute("name", "description", description);
    setMetaAttribute(
      "name",
      "robots",
      isNotFound ? "noindex, nofollow" : "index, follow",
    );
    setMetaAttribute("property", "og:title", title);
    setMetaAttribute("property", "og:description", description);
    setMetaAttribute("property", "og:type", "website");
    setMetaAttribute("property", "og:url", canonicalUrl);
    setMetaAttribute("property", "og:image", imageUrl);
    setMetaAttribute("property", "og:locale", "pt_BR");
    setMetaAttribute("name", "twitter:card", "summary_large_image");
    setMetaAttribute("name", "twitter:title", title);
    setMetaAttribute("name", "twitter:description", description);
    setMetaAttribute("name", "twitter:image", imageUrl);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    let structuredDataElement = document.head.querySelector(
      'script[data-seo="structured-data"]',
    );
    if (!structuredDataElement) {
      structuredDataElement = document.createElement("script");
      structuredDataElement.type = "application/ld+json";
      structuredDataElement.dataset.seo = "structured-data";
      document.head.appendChild(structuredDataElement);
    }
    structuredDataElement.textContent = JSON.stringify(structuredData);
  }, [pathname]);

  return null;
}

export default SEO;
