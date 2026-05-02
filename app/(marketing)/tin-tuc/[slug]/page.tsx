import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PostCard } from "@/components/cards/post-card";
import { posts } from "@/data/mock";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = posts.filter((item) => post.relatedPostSlugs?.includes(item.slug));
  const heroImage = post.bannerImage ?? post.thumbnail;

  return (
    <main className="bg-white">
      <section className="relative isolate overflow-hidden bg-ink py-20 text-white">
        <div className="absolute inset-0 opacity-25">
          <Image src={heroImage} alt={post.title} fill className="object-cover" />
        </div>
        <div className="shell relative z-10">
          <p className="text-sm uppercase tracking-[0.22em] text-sand">
            <Link href="/tin-tuc">Tin tức</Link> / {post.category}
          </p>
          <h1 className="mt-6 max-w-5xl font-display text-6xl">{post.title}</h1>
          <div className="mt-6 flex flex-wrap gap-6 text-sm text-slate-300">
            <span>{post.publishedAt}</span>
            <span>{post.category}</span>
          </div>
        </div>
      </section>

      <section className="shell section-gap">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <article className="space-y-8">
            <div className="relative h-[420px] overflow-hidden rounded-[32px]">
              <Image src={post.thumbnail} alt={post.title} fill className="object-cover" />
            </div>

            <div className="rounded-[32px] border border-line p-8">
              <div className="space-y-5 text-base leading-8 text-steel">
                <p className="text-lg font-medium text-ink">{post.excerpt}</p>
                {post.content.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </article>

          <aside className="space-y-6">
            <div className="rounded-[32px] border border-line bg-mist p-8">
              <p className="text-sm uppercase tracking-[0.22em] text-steel">Chuyên mục</p>
              <p className="mt-3 text-2xl font-semibold text-ink">{post.category}</p>
              <p className="mt-6 text-sm uppercase tracking-[0.22em] text-steel">Ngày đăng</p>
              <p className="mt-3 text-lg font-semibold text-ink">{post.publishedAt}</p>
            </div>

            <div className="rounded-[32px] border border-line bg-ink p-8 text-white">
              <p className="text-sm uppercase tracking-[0.22em] text-sand">Nhận tư vấn nhanh</p>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Cần thêm thông tin về dự án, đất nền hoặc sản phẩm cho thuê tại phía Đông Hà Nội, liên hệ ngay để được hỗ trợ.
              </p>
              <a
                href="tel:0234235344"
                className="mt-6 inline-flex rounded-full bg-sand px-5 py-3 text-sm font-semibold text-ink"
              >
                Hotline 0234235344
              </a>
            </div>
          </aside>
        </div>
      </section>

      {relatedPosts.length ? (
        <section className="section-gap bg-mist">
          <div className="shell">
            <div className="mb-10">
              <p className="eyebrow">Bài viết liên quan</p>
              <h2 className="section-title mt-3">Tiếp tục theo dõi thị trường</h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {relatedPosts.map((item) => (
                <PostCard key={item.id} post={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
