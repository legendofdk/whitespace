import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DetailGallery } from "@/components/shared/detail-gallery";
import { HtmlContent } from "@/components/shared/html-content";
import { formatAreaValue } from "@/lib/format-area";
import { getPublicRentalBySlug } from "@/lib/public-api";

export const dynamic = "force-dynamic";

export default async function RentalDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getPublicRentalBySlug(slug);

  if (!item) {
    notFound();
  }

  const heroImage = item.bannerImage ?? item.thumbnail;

  return (
    <main className="bg-[#fffaf2]">
      <section className="relative isolate overflow-hidden bg-[#1f2d3d] py-20 text-white">
        <div className="absolute inset-0 opacity-20">
          <Image src={heroImage} alt={item.name} fill className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,173,59,0.24),transparent_40%)]" />
        <div className="shell relative z-10">
          <p className="hero-animate hero-animate-delay-1 text-sm uppercase tracking-[0.22em] text-[#ffd08a]">
            <Link href="/cho-thue">Cho thuê</Link> / {item.name}
          </p>
          <h1 className="hero-animate hero-animate-delay-2 mt-6 max-w-4xl font-display text-6xl">{item.name}</h1>
        </div>
      </section>

      <section className="shell section-gap">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <div className="section-reveal rounded-[30px] border border-[#f0c06f] bg-[linear-gradient(135deg,#fff2d6,#ffd996)] p-6 shadow-[0_18px_36px_rgba(215,142,22,0.16)]">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#9f6a13]">Giá thuê tham khảo</p>
              <p className="mt-3 font-display text-5xl leading-none text-[#8a4c09]">
                {item.price}
              </p>
              <div className="mt-3 inline-flex rounded-full bg-white/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#9a5b0b] ring-1 ring-[#f2bf66]">
                Điều kiện thuê linh hoạt
              </div>
              <p className="mt-3 text-sm leading-7 text-[#7b561c]">
                Mức giá đang chào thuê theo vị trí và diện tích, liên hệ để nhận điều kiện thuê chi tiết.
              </p>
            </div>

            <div className="section-reveal grid gap-4 sm:grid-cols-2">
              {[
                ["Khu vực", item.area],
                ["Địa chỉ", item.address],
                ["Diện tích", formatAreaValue(item.size)],
                ["Loại hình", item.rentalType ?? item.badge ?? "Cho thuê"],
                ["Hình thức", item.cardMeta]
              ].map(([label, value]) => (
                <div key={label} className="rounded-[28px] border border-[#f0dcc0] bg-white p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9b7a49]">{label}</p>
                  <p className="mt-3 text-lg font-semibold text-[#1f2d3d]">{value}</p>
                </div>
              ))}
            </div>

            <div className="section-reveal rounded-[32px] border border-[#f0dcc0] bg-white p-8">
              <h2 className="font-display text-4xl text-[#1f2d3d]">Thông tin chi tiết</h2>
              <div className="mt-6 space-y-4 text-sm leading-8 text-[#6d6252]">
                <HtmlContent html={item.description} className="max-w-none" />
                <p>Thông tin nhanh: {item.cardMeta}.</p>
                <p>Phù hợp nhu cầu khai thác thương mại, văn phòng giao dịch hoặc mở rộng điểm kinh doanh tại khu Đông Hà Nội.</p>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="section-reveal rounded-[32px] border border-[#34475b] bg-[#213143] p-8 text-white">
              <p className="text-sm uppercase tracking-[0.22em] text-[#ffd08a]">Hotline / Zalo</p>
              <p className="mt-3 text-4xl font-semibold">{item.hotline}</p>
              <p className="mt-4 text-sm leading-7 text-[#dae4ef]">
                Liên hệ ngay để nhận mặt bằng phù hợp, điều kiện thuê và thông tin khai thác chi tiết.
              </p>
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
