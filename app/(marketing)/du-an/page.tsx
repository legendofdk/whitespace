import type { Metadata } from "next";

import { ProjectCard } from "@/components/cards/project-card";
import { FeaturedProjectHeroCarousel } from "@/components/shared/featured-project-hero-carousel";
import { FilterBar } from "@/components/shared/filter-bar";
import { getPublicProjects } from "@/lib/public-api";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata: Metadata = buildMetadata({
  title: "Danh sách dự án",
  description: "Danh sách dự án bất động sản đáng chú ý tại khu Đông Hà Nội, cập nhật theo khu vực và mức độ nổi bật.",
  path: "/du-an"
});

export default async function ProjectsPage({
  searchParams
}: {
  searchParams: Promise<{ featured?: string; area?: string; propertyType?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const [featuredProjects, filteredProjects] = await Promise.all([
    getPublicProjects({ featured: true }),
    getPublicProjects({
      featured: params.featured === "true" ? true : params.featured === "false" ? false : undefined,
      area: params.area || undefined,
      propertyType: params.propertyType || undefined,
      sort: params.sort || undefined
    })
  ]);

  return (
    <main className="bg-mist pb-16">
      {featuredProjects.length ? (
        <section>
          <FeaturedProjectHeroCarousel projects={featuredProjects} />
        </section>
      ) : null}

      <section className="shell pt-5 sm:pt-6">
        <FilterBar
          action="/du-an"
          showSearch={false}
          filters={[
            {
              name: "area",
              label: "Khu vực",
              defaultValue: params.area ?? "",
              options: [
                { label: "Tất cả khu vực", value: "" },
                { label: "Gia Lâm", value: "gia-lam" },
                { label: "Long Biên", value: "long-bien" },
                { label: "Đông Anh", value: "dong-anh" }
              ]
            },
            {
              name: "featured",
              label: "Nổi bật",
              defaultValue: params.featured ?? "",
              options: [
                { label: "Tất cả dự án", value: "" },
                { label: "Dự án nổi bật", value: "true" }
              ]
            },
            {
              name: "propertyType",
              label: "Loại hình",
              defaultValue: params.propertyType ?? "",
              options: [
                { label: "Tất cả loại hình", value: "" },
                { label: "Chung cư", value: "Chung cư" },
                { label: "Biệt thự", value: "Biệt thự" },
                { label: "Shophouse", value: "Shophouse" },
                { label: "Liền kề", value: "Liền kề" }
              ]
            },
            {
              name: "sort",
              label: "Sắp xếp",
              defaultValue: params.sort ?? "latest",
              options: [
                { label: "Mới nhất", value: "latest" },
                { label: "Giá cao nhất", value: "price_desc" },
                { label: "Giá thấp nhất", value: "price_asc" }
              ]
            }
          ]}
        />
        <p className="mt-3 text-sm font-medium text-steel">
          Hiện đang có {filteredProjects.length.toLocaleString("vi-VN")} dự án
        </p>
      </section>

      <section className="shell pb-12 pt-5 sm:pb-14 sm:pt-6">
        <div className="grid gap-5 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </main>
  );
}
