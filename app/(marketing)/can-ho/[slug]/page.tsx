import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DetailGallery } from "@/components/shared/detail-gallery";
import { HtmlContent } from "@/components/shared/html-content";
import { getPublicApartmentBySlug } from "@/lib/public-api";

export const dynamic = "force-dynamic";

export default async function ApartmentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getPublicApartmentBySlug(slug);

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
            {item.projectSlug ? <Link href={`/du-an/${item.projectSlug}`}>{item.projectName ?? "Dự án"}</Link> : <span>Căn hộ</span>} / {item.name}
          </p>
          <h1 className="mt-6 max-w-4xl font-display text-6xl">{item.name}</h1>
        </div>
      </section>

      <section className="shell section-gap">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <div className="rounded-[30px] border border-[#e4c58a] bg-[radial-gradient(circle_at_top_left,#fff8e8,transparent_45%),linear-gradient(135deg,#fff4dc,#ffe6aa)] p-6 shadow-[0_18px_36px_rgba(191,138,38,0.18)]">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#a56a10]">Giá tham khảo</p>
              <p className="mt-3 font-display text-5xl leading-none text-[#7f4f10] drop-shadow-[0_8px_18px_rgba(191,138,38,0.18)]">
                {item.price}
              </p>
              <div className="mt-3 inline-flex rounded-full bg-white/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#9f6a13] ring-1 ring-[#e7c06d]">
                Thông tin cập nhật liên tục
              </div>
              <p className="mt-3 text-sm leading-7 text-[#7a6335]">
                Liên hệ để nhận thông tin giá, tình trạng căn và phương án phù hợp theo nhu cầu thực tế.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["Dự án", item.projectName ?? "Đang cập nhật"],
                ["Khu vực", item.area],
                ["Địa chỉ", item.address],
                ["Diện tích", item.size],
                ["Loại hình", item.rentalType ?? item.badge ?? "Căn hộ"],
                ["Thông tin nhanh", item.cardMeta]
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
                <HtmlContent html={item.description} className="max-w-none" />
                <p>Thông tin nhanh: {item.cardMeta}.</p>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[32px] border border-line bg-ink p-8 text-white">
              <p className="text-sm uppercase tracking-[0.22em] text-sand">Hotline / Zalo</p>
              <p className="mt-3 text-4xl font-semibold">{item.hotline}</p>
              <p className="mt-4 text-sm leading-7 text-slate-300">Liên hệ để nhận thông tin căn hộ chi tiết và lịch xem thực tế.</p>
            </div>

            <DetailGallery title={item.name} images={item.gallery.length ? item.gallery : [item.thumbnail]} />
          </aside>
        </div>
      </section>
    </main>
  );
}
