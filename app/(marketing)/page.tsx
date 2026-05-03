import Link from "next/link";

import { ListingCard } from "@/components/cards/listing-card";
import { PostCard } from "@/components/cards/post-card";
import { ProjectCard } from "@/components/cards/project-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { getPublicLandListings, getPublicPosts, getPublicProjects, getPublicRentals } from "@/lib/public-api";
import { toLandCardItem, toRentalCardItem } from "@/lib/real-estate";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredProjects, landListings, rentals, posts] = await Promise.all([
    getPublicProjects({ featured: true }),
    getPublicLandListings({ featured: true }),
    getPublicRentals({ featured: true }),
    getPublicPosts()
  ]);

  return (
    <main>
      <section className="overflow-hidden bg-ink text-white">
        <div className="shell grid min-h-[calc(100vh-80px)] items-center gap-14 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative">
            <p className="eyebrow text-sand">Điểm nóng đầu tư</p>
            <h1 className="mt-6 max-w-4xl font-display text-6xl leading-none sm:text-7xl">
              Bất Động Sản Phía Đông Hà Nội
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">
              Tập trung vào các dự án, đất nền và sản phẩm cho thuê tại Gia Lâm, Long Biên, Đông Anh và các khu vực hưởng lợi trực tiếp từ hạ tầng mới, cầu mới và trục phát triển đô thị.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/du-an" className="rounded-full bg-sand px-6 py-3 text-sm font-semibold text-ink">
                Xem dự án nổi bật
              </Link>
              <Link href="/lien-he" className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white">
                Nhận tư vấn khu vực
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.14),rgba(255,255,255,0.05))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.22)] backdrop-blur-xl">
            <div className="rounded-[28px] border border-white/10 bg-[#dbe6ff0d] p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-sand">Bộ sưu tập nổi bật</p>
              <h2 className="mt-4 font-display text-5xl">Tâm điểm tăng trưởng mới</h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Khu vực trọng điểm</p>
                  <p className="mt-2 text-xl font-semibold">Gia Lâm</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Loại hình</p>
                  <p className="mt-2 text-xl font-semibold">Dự án, đất nền</p>
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

      <section className="section-gap bg-mist">
        <div className="shell">
          <SectionHeading
            eyebrow="Danh mục chủ lực"
            title="Danh mục bất động sản nổi bật tại phía Đông Hà Nội"
          />
          <div className="grid gap-5 md:grid-cols-3">
            {[
              ["Dự án cao cấp", "Tập trung những dự án nổi bật, phù hợp nhu cầu an cư và đầu tư dài hạn."],
              ["Đất nền chọn lọc", "Ưu tiên các vị trí có pháp lý rõ ràng và tiềm năng tăng giá theo hạ tầng."],
              ["Cho thuê thương mại", "Phù hợp nhu cầu khai thác kinh doanh, mở văn phòng hoặc phát triển thương hiệu."]
            ].map(([title, text]) => (
              <div key={title} className="rounded-[28px] border border-line bg-white p-8 shadow-soft">
                <h3 className="font-display text-3xl text-ink">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-steel">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-gap">
        <div className="shell">
          <SectionHeading eyebrow="Dự án nổi bật" title="Những dự án đáng quan tâm tại khu Đông Hà Nội" />
          <div className="grid gap-6 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-gap bg-mist">
        <div className="shell">
          <SectionHeading eyebrow="Đất nền hot" title="Sản phẩm nổi bật theo từng khu vực tiềm năng" />
          <div className="grid gap-6 lg:grid-cols-2">
            {landListings.map((item) => {
              const cardItem = toLandCardItem(item);

              return (
                <ListingCard
                  key={item.id}
                  href={cardItem.href}
                  title={cardItem.name}
                  address={cardItem.address}
                  area={cardItem.area}
                  badge={cardItem.badge}
                  metric={cardItem.cardMeta}
                  price={cardItem.price}
                  image={cardItem.thumbnail}
                />
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-gap">
        <div className="shell">
          <SectionHeading eyebrow="Cho thuê nổi bật" title="Mặt bằng và shophouse phù hợp khai thác thương mại" />
          <div className="grid gap-6 lg:grid-cols-2">
            {rentals.map((item) => {
              const cardItem = toRentalCardItem(item);

              return (
                <ListingCard
                  key={item.id}
                  href={cardItem.href}
                  title={cardItem.name}
                  address={cardItem.address}
                  area={cardItem.area}
                  badge={cardItem.badge}
                  metric={cardItem.cardMeta}
                  price={cardItem.price}
                  image={cardItem.thumbnail}
                />
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-gap bg-mist">
        <div className="shell">
          <SectionHeading eyebrow="Tin tức thị trường" title="Góc nhìn thị trường và thông tin đáng chú ý" />
          <div className="grid gap-6 lg:grid-cols-3">
            {posts.slice(0, 3).map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
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
                  Liên hệ ngay để nhận thông tin dự án, đất nền và sản phẩm cho thuê phù hợp với nhu cầu đầu tư hoặc khai thác thực tế.
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
