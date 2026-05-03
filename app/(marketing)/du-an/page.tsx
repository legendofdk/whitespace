import { ProjectCard } from "@/components/cards/project-card";
import { FilterBar } from "@/components/shared/filter-bar";
import { SectionHeading } from "@/components/shared/section-heading";
import { getPublicProjects } from "@/lib/public-api";

export const dynamic = "force-dynamic";

export default async function ProjectsPage({
  searchParams
}: {
  searchParams: Promise<{ featured?: string; area?: string; search?: string }>;
}) {
  const params = await searchParams;
  const filteredProjects = await getPublicProjects({
    featured: params.featured === "true" ? true : params.featured === "false" ? false : undefined,
    area: params.area || undefined,
    search: params.search || undefined
  });

  return (
    <main className="bg-mist pb-16">
      <section className="shell py-16">
        <p className="eyebrow">Danh sách dự án</p>
        <h1 className="mt-4 font-display text-6xl text-ink">Không gian đầu tư và an cư được tuyển chọn</h1>
      </section>

      <section className="shell">
        <FilterBar
          action="/du-an"
          searchPlaceholder="Tìm theo tên dự án"
          searchDefaultValue={params.search ?? ""}
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

      <section className="shell pt-16">
        <SectionHeading eyebrow="Toàn bộ dự án" title="Danh sách dự án đáng chú ý tại khu Đông Hà Nội" />
        <div className="grid gap-6 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </main>
  );
}
