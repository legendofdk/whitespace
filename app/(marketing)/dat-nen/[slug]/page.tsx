import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DetailGallery } from "@/components/shared/detail-gallery";
import { HtmlContent } from "@/components/shared/html-content";
import { MapNearbyPanel } from "@/components/shared/map-nearby-panel";
import { getPublicLandListingBySlug } from "@/lib/public-api";

export const dynamic = "force-dynamic";

export default async function LandDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getPublicLandListingBySlug(slug);

  if (!item) {
    notFound();
  }

  const heroImage = item.bannerImage ?? item.thumbnail;

  return (
    <main className="bg-[#fcfaf4]">
      <section className="relative isolate overflow-hidden bg-[#3e3125] py-20 text-white">
        <div className="absolute inset-0 opacity-20">
          <Image src={heroImage} alt={item.name} fill className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,235,196,0.18),transparent_40%)]" />
        <div className="shell relative z-10">
          <p className="text-sm uppercase tracking-[0.22em] text-[#f4d9a2]">
            <Link href="/dat-nen">Chuyển nhượng</Link> / {item.name}
          </p>
          <h1 className="mt-6 max-w-4xl font-display text-6xl">{item.name}</h1>
        </div>
      </section>

      <section className="shell section-gap">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <div className="rounded-[30px] border border-[#d8c29e] bg-[linear-gradient(135deg,#f7f0e3,#efe3cf)] p-6 shadow-[0_18px_36px_rgba(98,72,36,0.12)]">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#8b6430]">Giá bán tham khảo</p>
              <p className="mt-3 font-display text-5xl leading-none text-[#5e4521]">
                {item.price}
              </p>
              <div className="mt-3 inline-flex rounded-full bg-white/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#8a642f] ring-1 ring-[#d8b47b]">
                Giá theo từng vị trí
              </div>
              <p className="mt-3 text-sm leading-7 text-[#6e5838]">
                Liên hệ để nhận thêm vị trí cụ thể, pháp lý và mức giá cập nhật theo từng lô.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["Khu vực", item.area],
                ["Địa chỉ", item.address],
                ["Diện tích", item.acreage],
                ["Pháp lý", item.legal],
                ["Loại hình", item.badge ?? "Chuyển nhượng"]
              ].map(([label, value]) => (
                <div key={label} className="rounded-[28px] border border-[#e5d8c5] bg-white/80 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8d7656]">{label}</p>
                  <p className="mt-3 text-lg font-semibold text-[#2f2418]">{value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-[32px] border border-[#e5d8c5] bg-white p-8">
              <h2 className="font-display text-4xl text-[#2f2418]">Thông tin chi tiết</h2>
              <div className="mt-6 space-y-4 text-sm leading-8 text-[#6a5843]">
                <HtmlContent html={item.description} className="max-w-none" />
                <p>Thông tin nhanh: {item.cardMeta}.</p>
                <p>Khu vực quan tâm: {item.area}, phù hợp nhu cầu giữ tài sản và theo dõi hạ tầng khu Đông Hà Nội.</p>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[32px] border border-[#4f3e2b] bg-[#3f3124] p-8 text-white">
              <p className="text-sm uppercase tracking-[0.22em] text-[#f1d19b]">Hotline / Zalo</p>
              <p className="mt-3 text-4xl font-semibold">{item.hotline}</p>
              <p className="mt-4 text-sm leading-7 text-[#e7d7c0]">
                Liên hệ để nhận vị trí chi tiết, pháp lý và tư vấn phù hợp với nhu cầu đầu tư hoặc giữ tài sản.
              </p>
            </div>

            <DetailGallery title={item.name} images={item.gallery.length ? item.gallery : [item.thumbnail]} />

            <MapNearbyPanel
              area={item.area}
              center={item.coordinates}
              title={item.name}
              defaultMapUrl={item.mapEmbedUrl}
              hideNearbyPlaces
            />
          </aside>
        </div>
      </section>
    </main>
  );
}
