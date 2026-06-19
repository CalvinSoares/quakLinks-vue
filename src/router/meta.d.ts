import "vue-router";
import type { SeoOptions } from "@/config/seo";

declare module "vue-router" {
  interface RouteMeta {
    requiresAuth?: boolean;
    seo?: SeoOptions;
  }
}
