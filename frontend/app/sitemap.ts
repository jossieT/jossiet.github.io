import { MetadataRoute } from "next";
import { getProjects, getArticles } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yosefteshome.dev";

  const staticRoutes = [
    "",
    "/about",
    "/projects",
    "/experience",
    "/services",
    "/articles",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  let projectRoutes: MetadataRoute.Sitemap = [];
  let articleRoutes: MetadataRoute.Sitemap = [];

  try {
    const projectsData = await getProjects(undefined, 1);
    projectRoutes = projectsData.items.map((p) => ({
      url: `${baseUrl}/projects/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    }));
  } catch {}

  try {
    const articlesData = await getArticles(1);
    articleRoutes = articlesData.items.map((a) => ({
      url: `${baseUrl}/articles/${a.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {}

  return [...staticRoutes, ...projectRoutes, ...articleRoutes];
}
