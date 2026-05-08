import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/shared/json-ld";
import { DetailGallery } from "@/components/shared/detail-gallery";
import { HtmlContent } from "@/components/shared/html-content";
import { formatAreaValue } from "@/lib/format-area";
import { getPublicRentalBySlug } from "@/lib/public-api";
import { buildBreadcrumbSchema, buildMetadata, buildRealEstateWebPageSchema } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPublicRentalBySlug(slug);

  if (!item) {
    return buildMetadata({
      title: "Sản phẩm không tồn tại",
      description: "Không tìm thấy sản phẩm cho thuê bạn đang quan tâm.",
      path: `/cho-thue/${slug}`
    });
  }

  return buildMetadata({
    title: item.seoTitle ?? item.name,
    description:
      item.seoDescription ??
      `${item.name} tại ${item.area}. Giá thuê ${item.price}, diện tích ${item.size}. Xem chi tiết vị trí và khả năng khai thác.`,
    path: `/cho-thue/${item.slug}`,
    image: item.bannerImage ?? item.thumbnail
  });
}

export default async function RentalDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getPublicRentalBySlug(slug);

  if (!item) {
    notFound();
  }

  const heroImage = item.bannerImage ?? item.thumbnail;

  return (
    <main className="bg-[#fffaf2]">
      <JsonLd
        data={[
          buildBreadcrumbSchema([
            { name: "Trang chủ", path: "/" },
            { name: "Cho thuê", path: "/cho-thue" },
            { name: item.name, path: `/cho-thue/${item.slug}` }
          ]),
          buildRealEstateWebPageSchema({
            title: item.seoTitle ?? item.name,
            description:
              item.seoDescription ??
              `${item.name} tại ${item.area}. Giá thuê ${item.price}, diện tích ${item.size}. Xem chi tiết vị trí và khả năng khai thác.`,
            path: `/cho-thue/${item.slug}`,
            image: item.bannerImage ?? item.thumbnail,
            price: item.price,
            address: item.address,
            area: item.area,
            hotline: item.hotline
          })
        ]}
      />
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
            <div className="section-reveal rounded-[26px] border border-[#efc06b] bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.45),transparent_34%),linear-gradient(135deg,#fff5e3,#ffd892)] px-5 py-5 shadow-[0_18px_34px_rgba(215,142,22,0.14)]">
              <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-[#a56a10]">Giá thuê tham khảo</p>
              <p className="mt-2.5 font-display text-[2.6rem] leading-[0.95] text-[#8a4c09] sm:text-[2.9rem]">
                {item.price}
              </p>
              <div className="mt-3 inline-flex rounded-full bg-white/78 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9a5b0b] ring-1 ring-[#efbf66]">
                Điều kiện thuê linh hoạt
              </div>
            </div>

            <div className="section-reveal grid gap-3 sm:grid-cols-2">
              {[
                ["Khu vực", item.area],
                ["Địa chỉ", item.address],
                ["Diện tích", formatAreaValue(item.size)],
                ["Loại hình", item.rentalType ?? item.badge ?? "Cho thuê"],
                ["Hình thức", item.cardMeta]
              ].map(([label, value]) => (
                <div key={label} className="rounded-[22px] border border-[#f0dcc0] bg-white px-4 py-3.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9b7a49]">{label}</p>
                  <p className="mt-1.5 text-[15px] font-semibold leading-6 text-[#1f2d3d]">{value}</p>
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
            <div className="section-reveal rounded-[26px] border border-[#34475b] bg-[#213143] px-5 py-5 text-white">
              <p className="text-xs uppercase tracking-[0.2em] text-[#ffd08a]">Hotline / Zalo</p>
              <p className="mt-2.5 text-[2rem] font-semibold leading-none">{item.hotline}</p>
              <p className="mt-3 text-sm leading-6 text-[#dae4ef]">
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
