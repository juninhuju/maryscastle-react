import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const siteName = "O Castelo das Marias";
const siteUrl = "https://livroocastelodasmarias.netlify.app";

const routeMetadata = {
  "/": {
    title: "O Castelo das Marias | Romance Sobrenatural de Junior Cristovam",
    description:
      "Mergulhe no drama sobrenatural de O Castelo das Marias, de Junior Cristovam. A traição de uma esposa, o ódio, a vingança e os quatro reinos do além.",
    image: "/livro.jpeg",
  },
  "/livro": {
    title: "Primeiro Capítulo | O Castelo das Marias - Leia Online Grátis",
    description:
      "Leia o primeiro capítulo de O Castelo das Marias. Acompanhe o choque da traição e a travessia de Joaquim por um universo paralelo.",
    image: "/Adaga.jpeg",
  },
  "/quiz": {
    title: "Quiz dos Reinos | Descubra Sua Afinidade em O Castelo das Marias",
    description:
      "Faça o quiz e descubra com qual dos quatro reinos de O Castelo das Marias sua alma ressoa: Lira, Natural, Cemitério ou Encruzilhada.",
    image: "/guardiao-sete.jpeg",
  },
  "/reinos": {
    title:
      "Os Quatro Reinos de O Castelo das Marias | Mundos Paralelos",
    description:
      "Conheça os reinos da Lira, Natural, Cemitério e Encruzilhada: mundos paralelos que refletem a jornada e os dilemas humanos em O Castelo das Marias.",
    image: "/lira.jpeg",
  },
  "/galeria": {
    title: "Galeria de Imagens | O Castelo das Marias - Personagens e Cenários",
    description:
      "Veja imagens exclusivas dos personagens, reinos e cenários do universo sombrio de O Castelo das Marias.",
    image: "/carrossel/1.jpeg",
  },
  "/autor": {
    title:
      "Junior Cristovam | Autor do Romance Sobrenatural O Castelo das Marias",
    description:
      "Conheça Junior Cristovam, autor de 'O Castelo das Marias', obra que une drama psicológico e mistério sobrenatural.",
    image: "/autor.jpeg",
  },
  "/downloads": {
    title:
      "Materiais para Download | O Castelo das Marias - Capítulo e Músicas",
    description:
      "Baixe o primeiro capítulo de O Castelo das Marias, trilhas sonoras originais e artes exclusivas do livro.",
    image: "/capa.jpeg",
  },
};

const kingdomMetadata = {
  "/lira": {
    title: "Reino da Lira | O Castelo das Marias - Maria Padilha",
    description:
      "Conheça o Reino da Lira, governado por Maria Padilha, um dos quatro reinos de O Castelo das Marias. Magia e mistério neste universo de fantasia.",
    image: "/guardiao-padilha.jpeg",
  },
  "/natural": {
    title: "Reino Natural | O Castelo das Marias - Esdras, Natureza e Magia",
    description:
      "Explore o Reino Natural, governado por Esdras, no universo de O Castelo das Marias. Descubra a conexão com a natureza e a magia ancestral.",
    image: "/guardiao-esdras.jpeg",
  },
  "/cemiterio": {
    title: "Reino do Cemitério | O Castelo das Marias - Senhor Caveira",
    description:
      "Desvende o Reino do Cemitério, governado pelo misterioso Senhor Caveira, em O Castelo das Marias. Um reino de segredos sombrios e poder.",
    image: "/guardiao-caveira.jpeg",
  },
  "/encruzilhada": {
    title: "Reino da Encruzilhada | O Castelo das Marias - Guardião Sete",
    description:
      "Descubra o Reino da Encruzilhada, governado pelo Guardião Sete, um dos reinos mais enigmáticos de O Castelo das Marias. Fantasia e mistério aguardam.",
    image: "/guardiao-sete.jpeg",
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
    const metadata = routeMetadata[pathname] ||
      kingdomMetadata[pathname] || {
        title: `Página não encontrada | ${siteName}`,
        description: `A página que você procura não foi encontrada em ${siteName}.`,
        image: "/livro.jpeg",
      };
    const canonicalUrl = `${siteUrl}${pathname === "/" ? "/" : pathname}`;
    const imageUrl = `${siteUrl}${metadata.image}`;

    document.title = metadata.title;
    document.documentElement.lang = "pt-BR";

    setMetaAttribute("name", "description", metadata.description);
    setMetaAttribute(
      "name",
      "robots",
      pathname === "/404" ? "noindex" : "index, follow",
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

    const structuredData = {
      "@context": "https://schema.org",
      "@type": pathname === "/" ? "Book" : "WebPage",
      name: pathname === "/" ? siteName : metadata.title,
      headline: metadata.title,
      description: metadata.description,
      url: canonicalUrl,
      image: imageUrl,
      ...(pathname === "/" && {
        author: {
          "@type": "Person",
          name: "Junior Cristovam",
        },
        inLanguage: "pt-BR",
      }),
    };

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
