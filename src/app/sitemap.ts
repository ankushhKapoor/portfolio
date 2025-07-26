import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://ankushhkapoor.vercel.app";

  const routes = ["", "/resume", "/links"];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: route === "" ? 1 : 0.7,
  }));
}
