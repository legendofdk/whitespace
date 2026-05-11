import type { Metadata } from "next";

import { ProjectCard } from "@/components/cards/project-card";
import { FeaturedProjectCarousel } from "@/components/shared/featured-project-carousel";
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
  searchParams: Promise<{ featured?: string; area?: string }>;
}) {
  const params = await searchParams;
  const [featuredProjects, filteredProjects] = await Promise.all([
    getPublicProjects({ featured: true }),
    getPublicProjects({
      featured: params.featured === "true" ? true : params.featured === "false" ? false : undefined,
      area: params.area || undefined
    })
  ]);

  return (
    <main className="bg-mist pb-16">
      <section className="shell pt-8 sm:pt-10">
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
            }
          ]}
        />
      </section>

      {featuredProjects.length ? (
        <section className="shell pt-5 sm:pt-6">
          <div className="overflow-hidden rounded-[32px] border border-line bg-white py-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] sm:py-6">
            <FeaturedProjectCarousel projects={featuredProjects} />
          </div>
        </section>
      ) : null}

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
