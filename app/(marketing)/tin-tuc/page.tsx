import type { Metadata } from "next";

import { PostCard } from "@/components/cards/post-card";
import { FilterBar } from "@/components/shared/filter-bar";
import { SectionHeading } from "@/components/shared/section-heading";
import { getPublicPosts } from "@/lib/public-api";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata: Metadata = buildMetadata({
  title: "Tin tức bất động sản phía Đông Hà Nội",
  description: "Cập nhật tin tức thị trường, kinh nghiệm đầu tư và phân tích dự án tại khu Đông Hà Nội.",
  path: "/tin-tuc",
  keywords: ["tin tức bất động sản hà nội", "thị trường gia lâm", "phân tích long biên"]
});

export default async function NewsPage({
  searchParams
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const params = await searchParams;
  const posts = await getPublicPosts({
    category: params.category || undefined,
    search: params.search || undefined
  });

  return (
    <main className="bg-mist">
      <section className="shell section-gap">
        <SectionHeading
          eyebrow="Tin tức"
          title="Cập nhật thị trường và kinh nghiệm đầu tư thực tế"
        />
        <FilterBar
          action="/tin-tuc"
          searchPlaceholder="Tìm kiếm bài viết"
          searchDefaultValue={params.search ?? ""}
          filters={[
            {
              name: "category",
              label: "Danh mục",
              defaultValue: params.category ?? "",
              options: [
                { label: "Tất cả danh mục", value: "" },
                { label: "Thị trường", value: "Thị trường" },
                { label: "Kinh nghiệm", value: "Kinh nghiệm" },
                { label: "Phân tích", value: "Phân tích" }
              ]
            }
          ]}
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </main>
  );
}
