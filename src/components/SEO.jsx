import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import capitulos from "../data/capitulos.json";

const siteName = "O Castelo das Marias";
const siteUrl = "https://livroocastelodasmarias.netlify.app";

const routeMetadata = {
  "/": {
    title: "O Castelo das Marias | Romance Sobrenatural de Junior Cristovam",
    description:
      "Mergulhe no drama sobrenatural de O Castelo das Marias, de Junior Cristovam. A traição de uma esposa, o ódio, a vingança e os mistérios dos quatro reinos.",
    image: "/Adaga.webp",
  },
  "/livro": {
    title:
      "Primeiro Capítulo - Onde o Sangue Beija a Seda | O Castelo das Marias",
    description:
      "Leia online o primeiro capítulo de O Castelo das Marias. A dor da traição e a descida de Joaquim aos reinos sobrenaturais.",
    image: "/Adaga.webp",
  },
  "/quiz": {
    title: "Quiz dos Reinos | Descubra Sua Afinidade | O Castelo das Marias",
    description:
      "Faça o quiz e descubra com qual dos quatro reinos de O Castelo das Marias sua alma ressoa: Lira, Natural, Cemitério ou Encruzilhada.",
    image: "/Adaga.webp",
  },
  "/reinos": {
    title: "Os Quatro Reinos | O Castelo das Marias",
    description:
      "Conheça os reinos da Lira, Natural, Cemitério e Encruzilhada: mundos regidos por forças ancestrais no universo de O Castelo das Marias.",
    image: "/lira.webp",
  },
  "/galeria": {
    title: "Galeria de Imagens | Cenários e Personagens | O Castelo das Marias",
    description:
      "Veja imagens exclusivas dos personagens, reinos e cenários conceituais de O Castelo das Marias.",
    image: "/carrossel/1.webp",
  },
  "/autor": {
    title: "Sobre o Autor: Junior Cristovam | O Castelo das Marias",
    description:
      "Conheça Junior Cristovam, autor de O Castelo das Marias, romance que une suspense, drama psicológico e fantasia sombria.",
    image: "/autor.webp",
  },
};

const kingdomMetadata = {
  "/lira": {
    title: "Reino da Lira | Guardiã Maria Padilha | O Castelo das Marias",
    description:
      "Governado por Maria Padilha, o Reino da Lira é a morada do desejo, da música e da soberania feminina no universo de O Castelo das Marias.",
    image: "/guardiao-padilha.webp",
  },
  "/natural": {
    title: "Reino Natural | Guardião Esdras | O Castelo das Marias",
    description:
      "Sob o olhar de Esdras, o Reino Natural pulsa entre árvores milenares e forças elementais, regido pelo princípio sagrado da troca.",
    image: "/guardiao-esdras.webp",
  },
  "/cemiterio": {
    title:
      "Reino do Cemitério | Guardião Senhor Caveira | O Castelo das Marias",
    description:
      "O domínio da justiça implacável e da lei do retorno sob o julgamento do Senhor Caveira em O Castelo das Marias.",
    image: "/guardiao-caveira.webp",
  },
  "/encruzilhada": {
    title: "Reino da Encruzilhada | Guardião Sete da Encruzilhada | O Castelo das Marias",
    description:
      "O ponto de encontro de todos os caminhos e escolhas, regido pelo Guardião Sete da Encruzilhada em O Castelo das Marias.",
    image: "/guardiao-sete.webp",
  },
};

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
    const chapterMatch = pathname.match(/^\/livro(?:\/(\d+))?$/);
    const chapterNumber = Number(chapterMatch?.[1] || 1);
    const chapterTitle = capitulos.find(
      (chapter) => chapter.number === chapterNumber,
    )?.title;
    const chapterMetadata =
      chapterMatch && chapterTitle
        ? {
            title: `Capítulo ${chapterNumber} — ${chapterTitle} | ${siteName}`,
            description: `Leia online o capítulo ${chapterNumber} de O Castelo das Marias, romance sobrenatural de Junior Cristovam.`,
            image: "/Adaga.webp",
          }
        : null;
    const metadata = chapterMetadata || routeMetadata[pathname] ||
      kingdomMetadata[pathname] || {
        title: `Página não encontrada | ${siteName}`,
        description: `A página que você procura não foi encontrada em ${siteName}.`,
        image: "/livro.webp",
      };

    const isNotFound =
      !chapterMetadata &&
      !routeMetadata[pathname] &&
      !kingdomMetadata[pathname];
    const canonicalPath =
      chapterMetadata && chapterNumber === 1 ? "/livro" : pathname;
    const canonicalUrl = `${siteUrl}${canonicalPath}`;
    const imageUrl = `${siteUrl}${metadata.image}`;

    document.title = metadata.title;
    document.documentElement.lang = "pt-BR";

    setMetaAttribute("name", "description", metadata.description);
    setMetaAttribute(
      "name",
      "robots",
      isNotFound ? "noindex, nofollow" : "index, follow",
    );
    setMetaAttribute("property", "og:title", metadata.title);
    setMetaAttribute("property", "og:description", metadata.description);
    setMetaAttribute("property", "og:type", "website");
    setMetaAttribute("property", "og:url", canonicalUrl);
    setMetaAttribute("property", "og:image", imageUrl);
    setMetaAttribute("property", "og:locale", "pt_BR");
    setMetaAttribute("name", "twitter:card", "summary_large_image");
    setMetaAttribute("name", "twitter:title", metadata.title);
    setMetaAttribute("name", "twitter:description", metadata.description);
    setMetaAttribute("name", "twitter:image", imageUrl);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    // Gerar Schema estruturado dinâmico
    let structuredData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: metadata.title,
      description: metadata.description,
      url: canonicalUrl,
      image: imageUrl,
    };

    if (pathname === "/") {
      structuredData = {
        "@context": "https://schema.org",
        "@type": "Book",
        name: "O Castelo das Marias",
        headline: metadata.title,
        description: metadata.description,
        url: canonicalUrl,
        image: imageUrl,
        author: {
          "@type": "Person",
          name: "Junior Cristovam",
        },
        inLanguage: "pt-BR",
      };
    } else if (chapterMatch && chapterTitle) {
      structuredData = {
        "@context": "https://schema.org",
        "@type": "Chapter",
        name: `Capítulo ${chapterNumber} — ${chapterTitle}`,
        isPartOf: {
          "@type": "Book",
          name: "O Castelo das Marias",
          author: {
            "@type": "Person",
            name: "Junior Cristovam",
          },
        },
        position: chapterNumber,
        url: canonicalUrl,
        inLanguage: "pt-BR",
      };
    } else if (pathname === "/autor") {
      structuredData = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Junior Cristovam",
        jobTitle: "Escritor",
        description: metadata.description,
        url: canonicalUrl,
        image: imageUrl,
      };
    }

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
