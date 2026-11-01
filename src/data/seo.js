import capitulos from "./capitulos.json";

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
    image: "/guardiao-padilha.jpeg",
  },
  "/natural": {
    title: "Reino Natural | Guardião Esdras | O Castelo das Marias",
    description:
      "Sob o olhar de Esdras, o Reino Natural pulsa entre árvores milenares e forças elementais, regido pelo princípio sagrado da troca.",
    image: "/guardiao-esdras.jpeg",
  },
  "/cemiterio": {
    title:
      "Reino do Cemitério | Guardião Senhor Caveira | O Castelo das Marias",
    description:
      "O domínio da justiça implacável e da lei do retorno sob o julgamento do Senhor Caveira em O Castelo das Marias.",
    image: "/guardiao-caveira.jpeg",
  },
  "/encruzilhada": {
    title:
      "Reino da Encruzilhada | Guardião Sete da Encruzilhada | O Castelo das Marias",
    description:
      "O ponto de encontro de todos os caminhos e escolhas, regido pelo Guardião Sete da Encruzilhada em O Castelo das Marias.",
    image: "/guardiao-sete.jpeg",
  },
};

export const prerenderPaths = [
  ...new Set([
    "/",
    ...Object.keys(routeMetadata),
    ...Object.keys(kingdomMetadata),
    ...capitulos.map((chapter) =>
      chapter.number === 1 ? "/livro" : `/livro/${chapter.number}`,
    ),
  ]),
];

export function getSeoMetadata(pathname) {
  const normalizedPath =
    pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  const isAdminRoute = normalizedPath === "/junioradm";
  const chapterMatch = normalizedPath.match(/^\/livro(?:\/(\d+))?$/);
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
  const metadata = isAdminRoute
    ? {
        title: `Administração | ${siteName}`,
        description: "Área administrativa restrita.",
        image: "/livro.webp",
      }
    : chapterMetadata || routeMetadata[normalizedPath] ||
      kingdomMetadata[normalizedPath] || {
      title: `Página não encontrada | ${siteName}`,
      description: `A página que você procura não foi encontrada em ${siteName}.`,
      image: "/livro.webp",
      };

  const isNotFound =
    !chapterMetadata &&
    !routeMetadata[normalizedPath] &&
    !kingdomMetadata[normalizedPath];
  const canonicalPath =
    chapterMetadata && chapterNumber === 1 ? "/livro" : normalizedPath;
  const canonicalUrl = `${siteUrl}${canonicalPath}`;
  const imageUrl = `${siteUrl}${metadata.image}`;

  let structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: metadata.title,
    description: metadata.description,
    url: canonicalUrl,
    image: imageUrl,
  };

  if (normalizedPath === "/") {
    structuredData = {
      "@context": "https://schema.org",
      "@type": "Book",
      name: siteName,
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
        name: siteName,
        author: {
          "@type": "Person",
          name: "Junior Cristovam",
        },
      },
      position: chapterNumber,
      url: canonicalUrl,
      inLanguage: "pt-BR",
    };
  } else if (normalizedPath === "/autor") {
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

  return {
    ...metadata,
    canonicalUrl,
    imageUrl,
    isNotFound,
    noIndex: isNotFound || isAdminRoute,
    structuredData,
  };
}
