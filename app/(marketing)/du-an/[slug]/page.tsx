import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DetailGallery } from "@/components/shared/detail-gallery";
import { HtmlContent } from "@/components/shared/html-content";
import { MapNearbyPanel } from "@/components/shared/map-nearby-panel";
import { getPublicProjectBySlug } from "@/lib/public-api";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);

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
        </div>
      </section>

      <section className="shell section-gap">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <div className="rounded-[30px] border border-[#e4c58a] bg-[radial-gradient(circle_at_top_left,#fff8e8,transparent_45%),linear-gradient(135deg,#fff4dc,#ffe6aa)] p-6 shadow-[0_18px_36px_rgba(191,138,38,0.18)]">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#a56a10]">Giá bán tham khảo</p>
              <p className="mt-3 font-display text-5xl leading-none text-[#7f4f10] drop-shadow-[0_8px_18px_rgba(191,138,38,0.18)]">
                {project.price}
              </p>
              <div className="mt-3 inline-flex rounded-full bg-white/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#9f6a13] ring-1 ring-[#e7c06d]">
                Bảng giá cập nhật liên tục
              </div>
              <p className="mt-3 text-sm leading-7 text-[#7a6335]">
                Mức giá hiện tại của dự án, liên hệ trực tiếp để nhận bảng hàng và chính sách cập nhật.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["Chủ đầu tư", project.investor],
                ["Địa chỉ", project.address],
                ["Quy mô", project.scale],
                ["Khởi công", project.startTime ?? "Đang cập nhật"],
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
                <HtmlContent html={project.description} className="max-w-none" />
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

            <div className="rounded-[32px] border border-line p-8">
              <h2 className="font-display text-4xl text-ink">Danh sách căn hộ</h2>
              {project.apartments?.length ? (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {project.apartments.map((apartment) => (
                    <div key={apartment.id} className="rounded-[24px] border border-line bg-mist p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-steel">Căn hộ</p>
                      <p className="mt-2 text-2xl font-semibold text-ink">{apartment.name}</p>
                      <p className="mt-3 text-sm text-steel">
                        {apartment.price}
                        {apartment.size ? ` • ${apartment.size}` : ""}
                        {apartment.rentalType ? ` • ${apartment.rentalType}` : ""}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-6 text-sm leading-7 text-steel">Dự án này chưa có căn hộ nào được cập nhật.</p>
              )}
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
