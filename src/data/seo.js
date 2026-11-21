import capitulos from "./capitulos.json";
import { ebookProduct } from "./bookStores";
import { reinos } from "./reinos";

const siteName = "O Castelo das Marias";
export const siteUrl = "https://livroocastelodasmarias.netlify.app";
const bookCoverUrl = `${siteUrl}/Capalivro.jpeg`;

function getBookStructuredData(description) {
  return {
    "@type": "Book",
    "@id": `${siteUrl}/#book`,
    name: siteName,
    alternateName: "Castelo das Marias",
    description,
    url: `${siteUrl}/`,
    image: bookCoverUrl,
    genre: ["Romance sobrenatural", "Fantasia gótica"],
    author: {
      "@type": "Person",
      "@id": `${siteUrl}/autor/#person`,
      name: "Junior Cristovam",
      url: `${siteUrl}/autor/`,
    },
    inLanguage: "pt-BR",
  };
}

function createBreadcrumbList(items) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: `${siteUrl}${path}`,
    })),
  };
}

const routeMetadata = {
  "/": {
    title: "O Castelo das Marias | Livro PDF e físico",
    description: `Compre O Castelo das Marias em e-book PDF por ${ebookProduct.formattedPrice} (de ${ebookProduct.formattedRegularPrice}). Pagamento à vista no cartão de crédito ou Pix.`,
    image: "/Capalivro.jpeg",
    breadcrumbName: "Início",
    priority: "1.0",
    changefreq: "weekly",
    imageTitle: "Capa oficial de O Castelo das Marias — Romance Sobrenatural",
  },
  "/comprar": {
    title: `Comprar O Castelo das Marias em PDF | ${ebookProduct.formattedPrice}`,
    description: `Compre O Castelo das Marias em e-book PDF por ${ebookProduct.formattedPrice} (de ${ebookProduct.formattedRegularPrice}). Pagamento à vista no cartão de crédito ou Pix; entrega por e-mail após confirmação.`,
    image: "/Capalivro.jpeg",
    breadcrumbName: "Comprar",
    priority: "0.9",
    changefreq: "monthly",
    imageTitle: "Compre O Castelo das Marias em e-book PDF ou edição física",
  },
  "/quiz": {
    title: "Quiz dos Reinos: descubra sua afinidade | Castelo das Marias",
    description:
      "Faça o quiz e descubra com qual dos quatro reinos de O Castelo das Marias sua alma ressoa: Lira, Natural, Cemitério ou Encruzilhada.",
    image: "/Adaga.jpeg",
    breadcrumbName: "Quiz dos Reinos",
    priority: "0.8",
    changefreq: "monthly",
    imageTitle: "Quiz dos Reinos de O Castelo das Marias",
  },
  "/reinos": {
    title: "Os Quatro Reinos de O Castelo das Marias",
    description:
      "Conheça os reinos da Lira, Natural, Cemitério e Encruzilhada: mundos regidos por forças ancestrais no universo de O Castelo das Marias.",
    image: "/lira.jpeg",
    breadcrumbName: "Os Quatro Reinos",
    priority: "0.8",
    changefreq: "monthly",
    imageTitle: "Os Quatro Reinos de O Castelo das Marias",
  },
  "/galeria": {
    title: "Galeria de Imagens e Clipe | O Castelo das Marias",
    description:
      "Explore a galeria de O Castelo das Marias: clipe oficial, personagens, os quatro reinos e cenários que compõem o universo visual do romance.",
    image: "/carrossel/1.jpeg",
    breadcrumbName: "Galeria",
    priority: "0.7",
    changefreq: "monthly",
    imageTitle: "Galeria de imagens de O Castelo das Marias",
  },
  "/autor": {
    title: "Sobre o Autor: Junior Cristovam | O Castelo das Marias",
    description:
      "Conheça Junior Cristovam, autor de O Castelo das Marias, romance que une suspense, drama psicológico e fantasia sombria.",
    image: "/autor.jpeg",
    breadcrumbName: "Sobre o Autor",
    priority: "0.8",
    changefreq: "monthly",
    imageTitle: "Junior Cristovam — Autor de O Castelo das Marias",
  },
};

const kingdomMetadata = {
  "/lira": {
    title: "Reino da Lira | Guardiã Maria Padilha | O Castelo das Marias",
    description:
      "Governado por Maria Padilha, o Reino da Lira é a morada do desejo, da música e da soberania feminina no universo de O Castelo das Marias.",
    image: "/guardiao-padilha.jpeg",
    breadcrumbName: "Reino da Lira",
    priority: "0.8",
    changefreq: "monthly",
    imageTitle: "Maria Padilha — Guardiã do Reino da Lira",
  },
  "/natural": {
    title: "Reino Natural | Guardião Esdras | O Castelo das Marias",
    description:
      "Sob o olhar de Esdras, o Reino Natural pulsa entre árvores milenares e forças elementais, regido pelo princípio sagrado da troca.",
    image: "/guardiao-esdras.jpeg",
    breadcrumbName: "Reino Natural",
    priority: "0.8",
    changefreq: "monthly",
    imageTitle: "Esdras — Guardião do Reino Natural",
  },
  "/cemiterio": {
    title: "Reino do Cemitério | Senhor Caveira | Castelo das Marias",
    description:
      "Conheça o Reino do Cemitério em O Castelo das Marias: um domínio de névoa, justiça e consequências, sob o julgamento do Senhor Caveira.",
    image: "/guardiao-caveira.jpeg",
    breadcrumbName: "Reino do Cemitério",
    priority: "0.8",
    changefreq: "monthly",
    imageTitle: "Senhor Caveira — Guardião do Reino do Cemitério",
  },
  "/encruzilhada": {
    title: "Reino da Encruzilhada | Guardião Sete | Castelo das Marias",
    description:
      "Conheça o Reino da Encruzilhada de O Castelo das Marias, onde caminhos e escolhas se cruzam sob a guarda do Sete da Encruzilhada.",
    image: "/guardiao-sete.jpeg",
    breadcrumbName: "Reino da Encruzilhada",
    priority: "0.8",
    changefreq: "monthly",
    imageTitle: "Sete — Guardião do Reino da Encruzilhada",
  },
};

export const prerenderPaths = [
  ...new Set([
    "/",
    "/comprar/",
    ...capitulos.map((chapter) =>
      chapter.number === 1 ? "/livro/" : `/livro/${chapter.number}/`,
    ),
    "/quiz/",
    "/reinos/",
    ...Object.keys(kingdomMetadata).map((path) => `${path}/`),
    "/autor/",
    "/galeria/",
  ]),
];

export function getSeoMetadata(pathname) {
  const normalizedPath =
    pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  const chapterMatch = normalizedPath.match(/^\/livro(?:\/(\d+))?$/);
  const chapterNumber = Number(chapterMatch?.[1] || 1);
  const chapterTitle = capitulos.find(
    (chapter) => chapter.number === chapterNumber,
  )?.title;
  const chapterSiteName =
    chapterNumber === 1 ? "Castelo das Marias" : siteName;
  const chapterMetadata =
    chapterMatch && chapterTitle
      ? {
          title: `Capítulo ${chapterNumber} — ${chapterTitle} | ${chapterSiteName}`,
          description: `Leia o capítulo ${chapterNumber}, “${chapterTitle}”, de O Castelo das Marias. Acompanhe Joaquim neste romance sobrenatural de Junior Cristovam.`,
          image: "/Adaga.jpeg",
          breadcrumbName: `Capítulo ${chapterNumber} — ${chapterTitle}`,
          priority: chapterNumber === 1 ? "0.9" : "0.8",
          changefreq: "monthly",
          imageTitle: `Capítulo ${chapterNumber} — ${chapterTitle} | O Castelo das Marias`,
        }
      : null;
  const metadata =
    chapterMetadata ||
    routeMetadata[normalizedPath] ||
    kingdomMetadata[normalizedPath] || {
      title: `Página não encontrada | ${siteName}`,
      description: `A página que você procura não foi encontrada em ${siteName}.`,
      image: "/Capalivro.jpeg",
    };

  const isNotFound =
    !chapterMetadata &&
    !routeMetadata[normalizedPath] &&
    !kingdomMetadata[normalizedPath];
  const canonicalPath =
    chapterMetadata && chapterNumber === 1
      ? "/livro/"
      : normalizedPath === "/"
        ? "/"
        : `${normalizedPath}/`;
  const canonicalUrl = `${siteUrl}${canonicalPath}`;
  const imageUrl = `${siteUrl}${metadata.image}`;

  let structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: metadata.title,
    description: metadata.description,
    url: canonicalUrl,
    image: imageUrl,
    inLanguage: "pt-BR",
  };

  if (normalizedPath === "/") {
    const bookNode = {
      ...getBookStructuredData(metadata.description),
      bookFormat: "https://schema.org/EBook",
      numberOfPages: ebookProduct.pageCount,
      offers: {
        "@type": "Offer",
        price: ebookProduct.price,
        priceCurrency: "BRL",
        availability: "https://schema.org/InStock",
        url: `${siteUrl}/comprar/`,
        description: `E-book em formato PDF. De ${ebookProduct.formattedRegularPrice} por ${ebookProduct.formattedPrice}; pagamento à vista no cartão de crédito ou Pix.`,
      },
    };
    structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": `${siteUrl}/#website`,
          name: siteName,
          url: `${siteUrl}/`,
          inLanguage: "pt-BR",
        },
        bookNode,
      ],
    };
  } else if (normalizedPath === "/comprar") {
    const bookNode = {
      ...getBookStructuredData(
        `E-book de O Castelo das Marias em formato PDF por ${ebookProduct.formattedPrice} (de ${ebookProduct.formattedRegularPrice}).`,
      ),
      bookFormat: "https://schema.org/EBook",
      numberOfPages: ebookProduct.pageCount,
      encodingFormat: "application/pdf",
      offers: {
        "@type": "Offer",
        price: ebookProduct.price,
        priceCurrency: "BRL",
        availability: "https://schema.org/InStock",
        url: ebookProduct.checkoutUrl,
        description: `Pagamento à vista no cartão de crédito ou Pix. De ${ebookProduct.formattedRegularPrice} por ${ebookProduct.formattedPrice}.`,
      },
    };
    structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          name: metadata.title,
          description: metadata.description,
          url: canonicalUrl,
          primaryImageOfPage: imageUrl,
          inLanguage: "pt-BR",
          mainEntity: bookNode,
        },
        createBreadcrumbList([
          ["Início", "/"],
          ["Comprar", "/comprar/"],
        ]),
      ],
    };
  } else if (chapterMatch && chapterTitle) {
    const breadcrumbItems =
      chapterNumber === 1
        ? [
            ["Início", "/"],
            ["Ler grátis — Capítulo 1", "/livro/"],
          ]
        : [
            ["Início", "/"],
            ["Ler grátis", "/livro/"],
            [`Capítulo ${chapterNumber}`, canonicalPath],
          ];
    structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Chapter",
          name: `Capítulo ${chapterNumber} — ${chapterTitle}`,
          isPartOf: {
            "@type": "Book",
            "@id": `${siteUrl}/#book`,
            name: siteName,
            url: `${siteUrl}/`,
            author: {
              "@type": "Person",
              name: "Junior Cristovam",
              url: `${siteUrl}/autor/`,
            },
          },
          position: chapterNumber,
          url: canonicalUrl,
          image: imageUrl,
          inLanguage: "pt-BR",
          isAccessibleForFree: true,
        },
        createBreadcrumbList(breadcrumbItems),
      ],
    };
  } else if (normalizedPath === "/autor") {
    structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Person",
          "@id": `${siteUrl}/autor/#person`,
          name: "Junior Cristovam",
          jobTitle: "Escritor",
          description: metadata.description,
          url: canonicalUrl,
          image: imageUrl,
          sameAs: [
            "https://www.instagram.com/ocastelodasmarias/",
            "https://www.tiktok.com/@ocastelodasmariaslivro/",
          ],
        },
        createBreadcrumbList([
          ["Início", "/"],
          ["Sobre o Autor", "/autor/"],
        ]),
      ],
    };
  } else if (normalizedPath === "/reinos") {
    structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          name: metadata.title,
          description: metadata.description,
          url: canonicalUrl,
          image: imageUrl,
          inLanguage: "pt-BR",
          mainEntity: {
            "@type": "ItemList",
            itemListElement: reinos.map((reino, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: `Reino ${reino.titulo}`,
              url: `${siteUrl}${reino.rota}`,
            })),
          },
        },
        createBreadcrumbList([
          ["Início", "/"],
          ["Os Quatro Reinos", "/reinos/"],
        ]),
      ],
    };
  } else if (kingdomMetadata[normalizedPath]) {
    structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          name: metadata.title,
          description: metadata.description,
          url: canonicalUrl,
          image: imageUrl,
          inLanguage: "pt-BR",
        },
        createBreadcrumbList([
          ["Início", "/"],
          ["Os Quatro Reinos", "/reinos/"],
          [metadata.breadcrumbName, canonicalPath],
        ]),
      ],
    };
  } else if (normalizedPath === "/galeria") {
    structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "ImageGallery",
          name: metadata.title,
          description: metadata.description,
          url: canonicalUrl,
          image: imageUrl,
          inLanguage: "pt-BR",
        },
        createBreadcrumbList([
          ["Início", "/"],
          ["Galeria", "/galeria/"],
        ]),
      ],
    };
  } else if (normalizedPath === "/quiz") {
    structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          name: metadata.title,
          description: metadata.description,
          url: canonicalUrl,
          image: imageUrl,
          inLanguage: "pt-BR",
        },
        createBreadcrumbList([
          ["Início", "/"],
          ["Quiz dos Reinos", "/quiz/"],
        ]),
      ],
    };
  }

  return {
    ...metadata,
    canonicalPath,
    canonicalUrl,
    imageUrl,
    isNotFound,
    noIndex: isNotFound,
    structuredData,
  };
}
