import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/shared/json-ld";
import { DetailGallery } from "@/components/shared/detail-gallery";
import { HtmlContent } from "@/components/shared/html-content";
import { MapNearbyPanel } from "@/components/shared/map-nearby-panel";
import { formatAreaValue } from "@/lib/format-area";
import { getPublicProjectBySlug } from "@/lib/public-api";
import { buildBreadcrumbSchema, buildMetadata, buildRealEstateWebPageSchema } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);

  if (!project) {
    return buildMetadata({
      title: "Dự án không tồn tại",
      description: "Không tìm thấy dự án bạn đang quan tâm.",
      path: `/du-an/${slug}`
    });
  }

  return buildMetadata({
    title: project.seoTitle ?? project.name,
    description:
      project.seoDescription ??
      `${project.name} tại ${project.area}. Giá tham khảo ${project.price}. Xem chi tiết vị trí, tiện ích, pháp lý và danh sách căn hộ.`,
    path: `/du-an/${project.slug}`,
    image: project.bannerImage ?? project.thumbnail
  });
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="bg-white">
      <JsonLd
        data={[
          buildBreadcrumbSchema([
            { name: "Trang chủ", path: "/" },
            { name: "Dự án", path: "/du-an" },
            { name: project.name, path: `/du-an/${project.slug}` }
          ]),
          buildRealEstateWebPageSchema({
            title: project.seoTitle ?? project.name,
            description:
              project.seoDescription ??
              `${project.name} tại ${project.area}. Giá tham khảo ${project.price}. Xem chi tiết vị trí, tiện ích, pháp lý và danh sách căn hộ.`,
            path: `/du-an/${project.slug}`,
            image: project.bannerImage ?? project.thumbnail,
            price: project.price,
            address: project.address,
            area: project.area,
            hotline: project.hotline
          })
        ]}
      />
      <section className="relative isolate overflow-hidden bg-ink py-20 text-white">
        <div className="absolute inset-0 opacity-25">
          <Image src={project.bannerImage} alt={project.name} fill className="object-cover" />
        </div>
        <div className="shell relative z-10">
          <p className="hero-animate hero-animate-delay-1 text-sm uppercase tracking-[0.22em] text-sand">
            <Link href="/du-an">Dự án</Link> / {project.name}
          </p>
          <h1 className="hero-animate hero-animate-delay-2 mt-6 max-w-4xl font-display text-6xl">{project.name}</h1>
        </div>
      </section>

      <section className="shell section-gap">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <div className="section-reveal rounded-[30px] border border-[#e4c58a] bg-[radial-gradient(circle_at_top_left,#fff8e8,transparent_45%),linear-gradient(135deg,#fff4dc,#ffe6aa)] p-6 shadow-[0_18px_36px_rgba(191,138,38,0.18)]">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#9f6a13]">Giá bán tham khảo</p>
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

            <div className="section-reveal rounded-[32px] border border-line bg-mist p-8">
              <h2 className="font-display text-4xl text-ink">Tổng quan dự án</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {[
                  ["Chủ đầu tư", project.investor],
                  ["Địa chỉ", project.address],
                  ["Quy mô", project.scale],
                  ["Khởi công", project.startTime ?? "Đang cập nhật"],
                  ["Bàn giao", project.handoverTime ?? "Đang cập nhật"],
                  ["Pháp lý", project.ownership ?? "Đang cập nhật"]
                ].map(([label, value]) => (
                  <div key={label} className="border-b border-line/80 pb-4 last:border-b-0 last:pb-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-steel">{label}</p>
                    <p className="mt-2 text-lg font-semibold text-ink">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-reveal rounded-[32px] border border-line p-8">
              <h2 className="font-display text-4xl text-ink">Thông tin chi tiết</h2>
              <div className="mt-6 space-y-4 text-sm leading-8 text-steel">
                <HtmlContent html={project.description} className="max-w-none" />
                <p>Sản phẩm: {project.productTypes.join(", ")}.</p>
                {project.villaInfo ? <p>Biệt thự: {project.villaInfo}.</p> : null}
                {project.shophouseInfo ? <p>Shophouse: {project.shophouseInfo}.</p> : null}
              </div>
            </div>

            <div className="section-reveal rounded-[32px] border border-line p-8">
              <h2 className="font-display text-4xl text-ink">Danh sách căn hộ</h2>
              {project.apartments?.length ? (
                <div className="mt-6 grid gap-4">
                  {project.apartments.map((apartment) => (
                    <Link
                      key={apartment.id}
                      href={`/can-ho/${apartment.slug}`}
                      className="content-lift rounded-[24px] border border-line bg-mist/70 p-5 transition hover:border-ink/20 hover:bg-mist"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-2xl font-semibold text-ink">{apartment.name}</p>
                          <p className="mt-1 text-sm text-steel">{apartment.rentalType ?? "Căn hộ"} • {apartment.status}</p>
                        </div>
                        <span className="inline-flex w-fit rounded-full border border-ink px-4 py-2 text-sm font-semibold text-ink">
                          Xem chi tiết
                        </span>
                      </div>
                      <div className="mt-5 grid gap-4 border-t border-line/80 pt-4 sm:grid-cols-2">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-steel">Giá</p>
                          <p className="mt-1 font-semibold text-ink">{apartment.price}</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-steel">Diện tích</p>
                          <p className="mt-1 font-semibold text-ink">{formatAreaValue(apartment.size ?? "Đang cập nhật")}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="mt-6 text-sm leading-7 text-steel">Dự án này chưa có căn hộ nào được cập nhật.</p>
              )}
            </div>

          </div>

          <aside className="space-y-6">
            <div className="section-reveal rounded-[32px] border border-line p-8">
              <h2 className="font-display text-4xl text-ink">Tiện ích nổi bật</h2>
              <div className="mt-6 flex flex-wrap gap-3">
                {project.utilities.map((utility) => (
                  <span key={utility} className="rounded-full bg-mist px-4 py-2 text-sm font-medium text-navy">
                    {utility}
                  </span>
                ))}
              </div>
            </div>

            <div className="section-reveal">
              <DetailGallery title={project.name} images={project.gallery.length ? project.gallery : [project.thumbnail]} />
            </div>

            <div className="section-reveal">
              <MapNearbyPanel
                area={project.area}
                center={project.coordinates}
                title={project.name}
                defaultMapUrl={project.mapEmbedUrl}
                hideNearbyPlaces
              />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
