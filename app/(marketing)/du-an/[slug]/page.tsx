import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DetailGallery } from "@/components/shared/detail-gallery";
import { MapNearbyPanel } from "@/components/shared/map-nearby-panel";
import { projects } from "@/data/mock";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="bg-white">
      <section className="relative isolate overflow-hidden bg-ink py-20 text-white">
        <div className="absolute inset-0 opacity-25">
          <Image src={project.bannerImage} alt={project.name} fill className="object-cover" />
        </div>
        <div className="shell relative z-10">
          <p className="text-sm uppercase tracking-[0.22em] text-sand">
            <Link href="/du-an">Dự án</Link> / {project.name}
          </p>
          <h1 className="mt-6 max-w-4xl font-display text-6xl">{project.name}</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-200">{project.description}</p>
        </div>
      </section>

      <section className="shell section-gap">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["Chủ đầu tư", project.investor],
                ["Địa chỉ", project.address],
                ["Quy mô", project.scale],
                ["Khởi công", project.startTime ?? "Đang cập nhật"],
                ["Giá bán", project.price],
                ["Bàn giao", project.handoverTime ?? "Đang cập nhật"],
                ["Pháp lý", project.ownership ?? "Đang cập nhật"]
              ].map(([label, value]) => (
                <div key={label} className="rounded-[28px] border border-line bg-mist p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-steel">{label}</p>
                  <p className="mt-3 text-lg font-semibold text-ink">{value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-[32px] border border-line p-8">
              <h2 className="font-display text-4xl text-ink">Thông tin chi tiết</h2>
              <div className="mt-6 space-y-4 text-sm leading-8 text-steel">
                <p>{project.description}</p>
                <p>Sản phẩm: {project.productTypes.join(", ")}.</p>
                <p>Biệt thự: {project.villaInfo ?? "Đang cập nhật"}.</p>
                <p>Shophouse: {project.shophouseInfo ?? "Đang cập nhật"}.</p>
              </div>
            </div>

            <div className="rounded-[32px] border border-line p-8">
              <h2 className="font-display text-4xl text-ink">Tiện ích nổi bật</h2>
              <div className="mt-6 flex flex-wrap gap-3">
                {project.utilities.map((utility) => (
                  <span key={utility} className="rounded-full bg-mist px-4 py-2 text-sm font-medium text-navy">
                    {utility}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[32px] border border-line bg-ink p-8 text-white">
              <p className="text-sm uppercase tracking-[0.22em] text-sand">Hotline / Zalo</p>
              <p className="mt-3 text-4xl font-semibold">{project.hotline}</p>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Liên hệ ngay để nhận thông tin chi tiết, bảng giá cập nhật và tư vấn phù hợp với nhu cầu đầu tư hoặc ở thực.
              </p>
            </div>

            <DetailGallery title={project.name} images={project.gallery.length ? project.gallery : [project.thumbnail]} />

            <MapNearbyPanel
              area={project.area}
              center={project.coordinates}
              title={project.name}
              defaultMapUrl={project.mapEmbedUrl}
              hideNearbyPlaces
            />
          </aside>
        </div>
      </section>
    </main>
  );
}
