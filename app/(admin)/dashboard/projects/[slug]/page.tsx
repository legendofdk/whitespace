import { ProjectEditor } from "@/components/admin/project-editor";
import { ApartmentManager } from "@/components/admin/apartment-manager";

export default async function AdminProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <div className="grid gap-6">
      <ProjectEditor slug={slug} />
      <ApartmentManager projectSlug={slug} />
    </div>
  );
}
