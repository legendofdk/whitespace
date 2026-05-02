import { ProjectCard } from "@/components/cards/project-card";
import { FilterBar } from "@/components/shared/filter-bar";
import { SectionHeading } from "@/components/shared/section-heading";
import { projects } from "@/data/mock";

export default async function ProjectsPage({
  searchParams
}: {
  searchParams: Promise<{ featured?: string }>;
}) {
  const params = await searchParams;
  const filteredProjects = params.featured === "true" ? projects.filter((project) => project.isFeatured) : projects;

  return (
    <main className="bg-mist pb-16">
      <section className="shell py-16">
        <p className="eyebrow">Danh sách dự án</p>
        <h1 className="mt-4 font-display text-6xl text-ink">Không gian đầu tư và an cư được tuyển chọn</h1>
      </section>

      <section className="shell">
        <FilterBar placeholder="Tìm theo tên dự án" filters={["Khu vực", "Loại sản phẩm", "Mức giá"]} />
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
