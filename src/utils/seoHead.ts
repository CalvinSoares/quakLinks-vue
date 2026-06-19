import type { Router } from "vue-router";
import type { SeoOptions } from "@/config/seo";
import {
  buildCanonicalUrl,
  buildPageTitle,
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  SITE_NAME,
  TWITTER_HANDLE,
} from "@/config/seo";
import { head } from "@/plugins/head";

export function buildSeoHead(options: SeoOptions = {}) {
  const title = buildPageTitle(options.title);
  const description = options.description ?? DEFAULT_DESCRIPTION;
  const keywords = options.keywords ?? DEFAULT_KEYWORDS;
  const image = options.image ?? DEFAULT_OG_IMAGE;
  const canonical = buildCanonicalUrl(options.path ?? "/");
  const ogType = options.type ?? "website";
  const robots = options.noindex ? "noindex, nofollow" : "index, follow";

  const jsonLdScripts = options.jsonLd
    ? (Array.isArray(options.jsonLd) ? options.jsonLd : [options.jsonLd]).map(
        (schema) => ({
          type: "application/ld+json" as const,
          innerHTML: JSON.stringify(schema),
        }),
      )
    : [];

  return {
    title: options.title ? title : DEFAULT_TITLE,
    htmlAttrs: {
      lang: "pt-BR",
    },
    meta: [
      { name: "description", content: description },
      { name: "keywords", content: keywords },
      { name: "author", content: SITE_NAME },
      { name: "robots", content: robots },
      { name: "googlebot", content: robots },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: ogType },
      { property: "og:url", content: canonical },
      { property: "og:image", content: image },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: TWITTER_HANDLE },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
    ],
    link: [{ rel: "canonical" as const, href: canonical }],
    script: jsonLdScripts,
  };
}

export function registerSeoRouter(router: Router) {
  router.afterEach((to) => {
    const seo = to.meta.seo as SeoOptions | undefined;
    if (!seo || seo.skipRouterSeo) {
      return;
    }

    head.push(buildSeoHead({ ...seo, path: to.path }));
  });
}
