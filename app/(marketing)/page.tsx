import Link from "next/link";
import Image from "next/image";

import { ListingCard } from "@/components/cards/listing-card";
import { FeaturedProjectCarousel } from "@/components/shared/featured-project-carousel";
import { SectionHeading } from "@/components/shared/section-heading";
import { formatAreaValue } from "@/lib/format-area";
import { getPublicLandListings, getPublicPosts, getPublicProjects, getPublicRentals } from "@/lib/public-api";
import { toLandCardItem } from "@/lib/real-estate";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredProjects, landListings, rentals, posts] = await Promise.all([
    getPublicProjects({ featured: true }),
    getPublicLandListings({ featured: true }),
    getPublicRentals({ featured: true }),
    getPublicPosts()
  ]);
  const featuredLandListings = landListings.slice(0, 6);
  const latestPost = posts[0];
  const secondaryPosts = posts.slice(1, 5);
  const featuredRentals = rentals.slice(0, 10);

  return (
    <main>
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <div className="absolute inset-0">
          <Image
            src="/hero-hanoi.jpg"
            alt="Toàn cảnh đô thị phía Đông Hà Nội"
            fill
            priority
            className="object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,16,34,0.9)_0%,rgba(7,16,34,0.74)_42%,rgba(7,16,34,0.5)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(226,198,140,0.24),transparent_28%)]" />
        <div className="shell relative z-10 grid min-h-[calc(100vh-80px)] items-center gap-14 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative">
            <p className="eyebrow text-sand">Điểm nóng đầu tư</p>
            <h1 className="mt-6 max-w-4xl font-display text-6xl leading-none sm:text-7xl">
              Bất Động Sản Phía Đông Hà Nội
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200">
              Tập trung vào các dự án, chuyển nhượng và sản phẩm cho thuê tại Gia Lâm, Long Biên, Đông Anh và các khu vực hưởng lợi trực tiếp từ hạ tầng mới, cầu mới và trục phát triển đô thị.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/du-an" className="rounded-full bg-sand px-6 py-3 text-sm font-semibold text-ink shadow-[0_14px_30px_rgba(227,194,132,0.24)]">
                Xem dự án nổi bật
              </Link>
              <Link href="/lien-he" className="rounded-full border border-white/20 bg-white/8 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm">
                Nhận tư vấn khu vực
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[32px] border border-white/15 bg-[linear-gradient(135deg,rgba(255,255,255,0.18),rgba(255,255,255,0.06))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
            <div className="rounded-[28px] border border-white/10 bg-[#dbe6ff14] p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-sand">Bộ sưu tập nổi bật</p>
              <h2 className="mt-4 font-display text-5xl">Tâm điểm tăng trưởng mới</h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Khu vực trọng điểm</p>
                  <p className="mt-2 text-xl font-semibold">Gia Lâm</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Loại hình</p>
                  <p className="mt-2 text-xl font-semibold">Dự án, chuyển nhượng</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Động lực tăng giá</p>
                  <p className="mt-2 text-xl font-semibold">Hạ tầng mới</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-gap">
        <div className="shell">
          <SectionHeading eyebrow="Dự án nổi bật" title="Những dự án đáng quan tâm tại khu Đông Hà Nội" />
          <FeaturedProjectCarousel projects={featuredProjects} />
        </div>
      </section>

      <section className="section-gap bg-mist">
        <div className="shell">
          <SectionHeading eyebrow="Chuyển nhượng hot" title="Sản phẩm nổi bật theo từng khu vực tiềm năng" />
          <div className="grid gap-5">
            {featuredLandListings.map((item) => {
              const cardItem = toLandCardItem(item);

              return (
                <Link
                  key={item.id}
                  href={cardItem.href}
                  className="group grid gap-5 overflow-hidden rounded-[28px] border border-line bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)] md:grid-cols-[260px_1fr]"
                >
                  <div className="relative h-52 overflow-hidden rounded-[24px] bg-mist md:h-full">
                    <Image
                      src={cardItem.thumbnail}
                      alt={cardItem.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col gap-4 md:py-2">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-navy">
                          {cardItem.area}
                        </span>
                        <h3 className="mt-4 font-display text-4xl leading-tight text-ink">{cardItem.name}</h3>
                        <p className="mt-3 text-sm text-steel">{cardItem.address}</p>
                      </div>
                      <div className="rounded-2xl bg-[linear-gradient(135deg,#fff3d6,#ffe7ad)] px-4 py-3 text-right shadow-[0_12px_24px_rgba(191,138,38,0.14)] ring-1 ring-[#e7c06d]">
                        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#9f6a13]">Giá bán</p>
                        <p className="mt-1 text-2xl font-black leading-none text-[#8b5a16]">{cardItem.price}</p>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-navy">{cardItem.cardMeta}</p>
                    <p className="line-clamp-3 max-w-3xl text-sm leading-7 text-steel">{cardItem.description.replace(/<[^>]+>/g, " ")}</p>
                    <span className="mt-auto inline-flex self-start rounded-full border border-ink px-4 py-2.5 text-sm font-semibold text-ink transition group-hover:bg-ink group-hover:text-white">
                      Xem chi tiết
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="mt-8 flex justify-center">
            <Link
              href="/dat-nen"
              className="inline-flex rounded-full border border-ink px-6 py-3 text-sm font-semibold text-ink transition hover:bg-ink hover:text-white"
            >
              Xem tất cả chuyển nhượng
            </Link>
          </div>
        </div>
      </section>

      <section className="section-gap">
        <div className="shell">
          <SectionHeading eyebrow="Cho thuê nổi bật" title="Mặt bằng và shophouse phù hợp khai thác thương mại" />
          <div className="overflow-hidden rounded-[28px] border border-line bg-white shadow-soft">
            <div className="hidden grid-cols-[88px_1.1fr_0.95fr_0.9fr_0.8fr_0.7fr] gap-4 border-b border-line bg-mist px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-steel lg:grid">
              <span>Ảnh</span>
              <span>Khu vực</span>
              <span>Diện tích</span>
              <span>Loại hình</span>
              <span>Giá thuê</span>
              <span className="text-right">Chi tiết</span>
            </div>
            <div className="divide-y divide-line">
              {featuredRentals.map((item) => (
                <Link
                  key={item.id}
                  href={`/cho-thue/${item.slug}`}
                  className="group block transition hover:bg-mist/60"
                >
                  <div className="grid gap-4 px-6 py-5 lg:grid-cols-[88px_1.1fr_0.95fr_0.9fr_0.8fr_0.7fr] lg:items-center">
                    <div className="relative h-20 overflow-hidden rounded-2xl border border-line bg-mist">
                      <Image
                        src={item.thumbnail}
                        alt={item.name}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-steel lg:hidden">Khu vực</p>
                      <p className="text-lg font-semibold text-ink">{item.name}</p>
                      <p className="mt-1 text-sm font-medium text-navy">{item.area}</p>
                      <p className="mt-1 text-sm text-steel">{item.address}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-steel lg:hidden">Diện tích</p>
                      <p className="text-sm font-medium text-ink">{formatAreaValue(item.size)}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-steel lg:hidden">Loại hình</p>
                      <p className="text-sm text-ink">{item.rentalType ?? item.cardMeta}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-steel lg:hidden">Giá thuê</p>
                      <p className="text-lg font-bold text-[#8b5a16]">{item.price}</p>
                    </div>
                    <div className="flex lg:justify-end">
                      <span className="inline-flex rounded-full border border-ink px-4 py-2 text-sm font-semibold text-ink transition group-hover:bg-ink group-hover:text-white">
                        Xem chi tiết
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-8 flex justify-center">
            <Link
              href="/cho-thue"
              className="inline-flex rounded-full border border-ink px-6 py-3 text-sm font-semibold text-ink transition hover:bg-ink hover:text-white"
            >
              Xem thêm
            </Link>
          </div>
        </div>
      </section>

      <section className="section-gap bg-mist">
        <div className="shell">
          <SectionHeading eyebrow="Tin tức thị trường" title="Góc nhìn thị trường và thông tin đáng chú ý" />
          {latestPost ? (
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <Link
                href={`/tin-tuc/${latestPost.slug}`}
                className="group relative block overflow-hidden rounded-[32px] bg-ink shadow-soft"
              >
                <div className="relative min-h-[540px]">
                  <Image
                    src={latestPost.thumbnail}
                    alt={latestPost.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,18,37,0.08),rgba(8,18,37,0.82))]" />
                  <div className="absolute inset-x-0 bottom-0 p-8 text-white sm:p-10">
                    <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-sand">
                      <span>{latestPost.category}</span>
                      <span>{latestPost.publishedAt}</span>
                    </div>
                    <h3 className="mt-4 max-w-2xl font-display text-4xl leading-tight sm:text-5xl">
                      {latestPost.title}
                    </h3>
                    <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-200">{latestPost.excerpt}</p>
                  </div>
                </div>
              </Link>

              <div className="grid content-start gap-x-6 gap-y-12 sm:grid-cols-2">
                {secondaryPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/tin-tuc/${post.slug}`}
                    className="group relative block overflow-hidden rounded-[28px] bg-ink shadow-soft"
                  >
                    <div className="relative aspect-square">
                      <Image
                        src={post.thumbnail}
                        alt={post.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,18,37,0.12),rgba(8,18,37,0.86))]" />
                      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sand">{post.publishedAt}</p>
                        <h3 className="mt-3 font-display text-2xl leading-tight">{post.title}</h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="section-gap bg-ink text-white">
        <div className="shell">
          <div className="rounded-[36px] border border-white/10 bg-white/5 p-10 sm:p-14">
            <p className="eyebrow text-sand">Liên hệ nhanh</p>
            <div className="mt-4 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <h2 className="font-display text-5xl">Cần tư vấn nhanh về dự án phía Đông Hà Nội?</h2>
                <p className="mt-4 text-base leading-8 text-slate-300">
                  Liên hệ ngay để nhận thông tin dự án, chuyển nhượng và sản phẩm cho thuê phù hợp với nhu cầu đầu tư hoặc khai thác thực tế.
                </p>
              </div>
              <Link href="/lien-he" className="rounded-full bg-sand px-6 py-3 text-sm font-semibold text-ink">
                Liên hệ tư vấn ngay
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
