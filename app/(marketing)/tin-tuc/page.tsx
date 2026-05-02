import { PostCard } from "@/components/cards/post-card";
import { FilterBar } from "@/components/shared/filter-bar";
import { SectionHeading } from "@/components/shared/section-heading";
import { posts } from "@/data/mock";

export default function NewsPage() {
  return (
    <main className="bg-mist">
      <section className="shell section-gap">
        <SectionHeading
          eyebrow="Tin tức"
          title="Cập nhật thị trường và kinh nghiệm đầu tư thực tế"
        />
        <FilterBar placeholder="Tìm kiếm bài viết" filters={["Danh mục"]} />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </main>
  );
}
