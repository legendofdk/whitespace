import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DetailGallery } from "@/components/shared/detail-gallery";
import { MapNearbyPanel } from "@/components/shared/map-nearby-panel";
import { landListings } from "@/data/mock";

export function generateStaticParams() {
  return landListings.map((item) => ({ slug: item.slug }));
}

export default async function LandDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = landListings.find((entry) => entry.slug === slug);

  if (!item) {
    notFound();
  }

  const heroImage = item.bannerImage ?? item.thumbnail;

  return (
    <main className="bg-white">
      <section className="relative isolate overflow-hidden bg-ink py-20 text-white">
        <div className="absolute inset-0 opacity-25">
          <Image src={heroImage} alt={item.name} fill className="object-cover" />
        </div>
        <div className="shell relative z-10">
          <p className="text-sm uppercase tracking-[0.22em] text-sand">
            <Link href="/dat-nen">Đất nền</Link> / {item.name}
          </p>
          <h1 className="mt-6 max-w-4xl font-display text-6xl">{item.name}</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-200">{item.description}</p>
        </div>
      </section>

      <section className="shell section-gap">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["Khu vực", item.area],
                ["Địa chỉ", item.address],
                ["Diện tích", item.acreage],
                ["Giá bán", item.price],
                ["Pháp lý", item.legal],
                ["Loại hình", item.badge ?? "Đất nền"]
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
                <p>{item.description}</p>
                <p>Thông tin nhanh: {item.cardMeta}.</p>
                <p>Khu vực quan tâm: {item.area}, phù hợp nhu cầu giữ tài sản và theo dõi hạ tầng khu Đông Hà Nội.</p>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[32px] border border-line bg-ink p-8 text-white">
              <p className="text-sm uppercase tracking-[0.22em] text-sand">Hotline / Zalo</p>
              <p className="mt-3 text-4xl font-semibold">{item.hotline}</p>
              <p className="mt-4 text-sm leading-7 text-slate-300">
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
