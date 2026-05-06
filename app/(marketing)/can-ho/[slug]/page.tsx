import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DetailGallery } from "@/components/shared/detail-gallery";
import { HtmlContent } from "@/components/shared/html-content";
import { formatAreaValue } from "@/lib/format-area";
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
    <main className="bg-[#f5f7fb]">
      <section className="relative isolate overflow-hidden bg-[#243349] py-20 text-white">
        <div className="absolute inset-0 opacity-20">
          <Image src={heroImage} alt={item.name} fill className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(164,191,255,0.24),transparent_38%)]" />
        <div className="shell relative z-10">
          <p className="hero-animate hero-animate-delay-1 text-sm uppercase tracking-[0.22em] text-[#b8cdf4]">
            {item.projectSlug ? <Link href={`/du-an/${item.projectSlug}`}>{item.projectName ?? "Dự án"}</Link> : <span>Căn hộ</span>} / {item.name}
          </p>
          <h1 className="hero-animate hero-animate-delay-2 mt-6 max-w-4xl font-display text-6xl">{item.name}</h1>
        </div>
      </section>

      <section className="shell section-gap">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <div className="section-reveal rounded-[30px] border border-[#d8e2f2] bg-[linear-gradient(135deg,#ffffff,#e9f0fb)] p-6 shadow-[0_18px_36px_rgba(60,91,145,0.12)]">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#4c6790]">Giá tham khảo</p>
              <p className="mt-3 font-display text-5xl leading-none text-[#21314a]">
                {item.price}
              </p>
              <div className="mt-3 inline-flex rounded-full bg-white/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#56739f] ring-1 ring-[#c8d6ee]">
                Căn hộ theo từng mã căn
              </div>
              <p className="mt-3 text-sm leading-7 text-[#59708f]">
                Liên hệ để nhận thông tin giá, tình trạng căn và phương án phù hợp theo nhu cầu thực tế.
              </p>
            </div>

            <div className="section-reveal grid gap-4 sm:grid-cols-2">
              {[
                ["Dự án", item.projectName ?? "Đang cập nhật"],
                ["Khu vực", item.area],
                ["Diện tích", formatAreaValue(item.size)],
                ["Loại hình", item.rentalType ?? item.badge ?? "Căn hộ"],
                ["Thông tin nhanh", item.cardMeta]
              ].map(([label, value]) => (
                <div key={label} className="rounded-[28px] border border-[#d8e2f2] bg-white p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6881a8]">{label}</p>
                  <p className="mt-3 text-lg font-semibold text-[#21314a]">{value}</p>
                </div>
              ))}
            </div>

            <div className="section-reveal rounded-[32px] border border-[#d8e2f2] bg-white p-8">
              <h2 className="font-display text-4xl text-[#21314a]">Thông tin chi tiết</h2>
              <div className="mt-6 space-y-4 text-sm leading-8 text-[#60758f]">
                <HtmlContent html={item.description} className="max-w-none" />
                <p>Thông tin nhanh: {item.cardMeta}.</p>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="section-reveal rounded-[32px] border border-[#314662] bg-[#23344c] p-8 text-white">
              <p className="text-sm uppercase tracking-[0.22em] text-[#b8cdf4]">Hotline / Zalo</p>
              <p className="mt-3 text-4xl font-semibold">{item.hotline}</p>
              <p className="mt-4 text-sm leading-7 text-[#d9e4f2]">Liên hệ để nhận thông tin căn hộ chi tiết và lịch xem thực tế.</p>
            </div>

            <div className="section-reveal">
              <DetailGallery title={item.name} images={item.gallery.length ? item.gallery : [item.thumbnail]} />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
