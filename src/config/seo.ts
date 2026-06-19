export const SITE_NAME = "QuackLinks";

export const SITE_URL =
  (import.meta.env.VITE_APP_URL || "https://quacklinks.com.br").replace(/\/$/, "");

export const SITE_DOMAIN =
  import.meta.env.VITE_APP_DOMAIN || "quacklinks.com.br";

export const DEFAULT_TITLE =
  "QuackLinks — Página de links para bio | Biolinks personalizados";

export const DEFAULT_DESCRIPTION =
  "QuackLinks é a plataforma brasileira para criar sua página de links na bio. Personalize sua identidade digital, centralize links e acompanhe cliques em tempo real. Crie sua bio grátis em quacklinks.com.br.";

export const DEFAULT_KEYWORDS = [
  "QuackLinks",
  "quacklinks",
  "quack links",
  "quacklinks.com.br",
  "biolink",
  "link na bio",
  "página de links",
  "links bio instagram",
  "linktree alternativa",
  "bio link brasil",
].join(", ");

export const DEFAULT_OG_IMAGE = `${SITE_URL}/duckbio.png`;

export const TWITTER_HANDLE = "@quacklinks";

export interface SeoOptions {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  path?: string;
  noindex?: boolean;
  type?: "website" | "article" | "profile";
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  skipRouterSeo?: boolean;
}

export function buildCanonicalUrl(path = "/"): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath === "/" ? "" : normalizedPath}`;
}

export function buildPageTitle(title?: string): string {
  if (!title) return DEFAULT_TITLE;
  if (title.includes(SITE_NAME)) return title;
  return `${title} | ${SITE_NAME}`;
}

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    alternateName: ["Quack Links", "quacklinks", "quacklinks.com.br"],
    url: SITE_URL,
    logo: `${SITE_URL}/duckbio.png`,
    description: DEFAULT_DESCRIPTION,
    sameAs: [],
  };
}

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: ["QuackLinks", "quacklinks", "quack links"],
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    inLanguage: "pt-BR",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/{search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function getSoftwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BRL",
    },
  };
}

export function getFaqSchema(
  items: Array<{ question: string; answer: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer.replace(/<[^>]+>/g, ""),
      },
    })),
  };
}
