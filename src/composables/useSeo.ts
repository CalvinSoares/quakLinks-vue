import { useHead } from "@unhead/vue";
import type { SeoOptions } from "@/config/seo";
import { buildSeoHead } from "@/utils/seoHead";

export function useSeo(options: SeoOptions = {}) {
  useHead(buildSeoHead(options));
}

export type { SeoOptions };
