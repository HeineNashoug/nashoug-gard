import type { MetadataRoute } from "next";
import { nav, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", ...nav.map((n) => n.href), "/book"].map((sti) => ({
    url: site.url + sti,
    changeFrequency: sti === "/book" ? "daily" : "monthly",
    priority: sti === "" ? 1 : sti === "/book" || sti === "/potetbua" ? 0.9 : 0.7,
  }));
}
