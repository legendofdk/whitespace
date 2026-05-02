import Image from "next/image";
import Link from "next/link";

import { Post } from "@/types";

export function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/tin-tuc/${post.slug}`} className="block transition-transform hover:-translate-y-1">
    <article className="overflow-hidden rounded-[28px] border border-line bg-white shadow-soft">
      <div className="relative h-56">
        <Image src={post.thumbnail} alt={post.title} fill className="object-cover" />
      </div>
      <div className="space-y-3 p-6">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-steel">
          <span>{post.category}</span>
          <span>{post.publishedAt}</span>
        </div>
        <h3 className="font-display text-2xl text-ink">{post.title}</h3>
        <p className="text-sm leading-7 text-steel">{post.excerpt}</p>
      </div>
    </article>
    </Link>
  );
}
