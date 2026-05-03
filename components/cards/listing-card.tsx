import Image from "next/image";
import Link from "next/link";

import { HtmlContent } from "@/components/shared/html-content";

type ListingCardProps = {
  href?: string;
  title: string;
  address: string;
  area: string;
  metric: string;
  price: string;
  image: string;
  badge?: string;
  description?: string;
};

export function ListingCard({ href, title, address, area, metric, price, image, badge, description }: ListingCardProps) {
  const content = (
    <article className="overflow-hidden rounded-[28px] border border-line bg-white shadow-soft">
      <div className="relative h-56">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-steel">{badge ?? area}</span>
          <div className="rounded-xl bg-[linear-gradient(135deg,#fff3d6,#ffe7ad)] px-3 py-2 text-right shadow-[0_10px_20px_rgba(191,138,38,0.16)] ring-1 ring-[#e7c06d]">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#9f6a13]">
              {badge?.toLowerCase().includes("thuê") ? "Giá thuê" : "Giá bán"}
            </p>
            <p className="mt-1 text-lg font-black leading-none text-[#8b5a16]">{price}</p>
          </div>
        </div>
        <h3 className="font-display text-2xl text-ink">{title}</h3>
        <p className="text-sm text-steel">{address}</p>
        <p className="text-sm font-medium text-navy">{metric}</p>
        {description ? (
          <HtmlContent
            html={description}
            className="prose prose-sm max-w-none overflow-hidden text-steel prose-p:my-0 prose-p:leading-7 prose-li:leading-7 prose-strong:text-ink [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]"
          />
        ) : null}
        <div className="pt-1">
          <span className="inline-flex rounded-full border border-ink px-5 py-3 text-sm font-semibold text-ink transition group-hover:bg-ink group-hover:text-white">
            Xem chi tiết
          </span>
        </div>
      </div>
    </article>
  );

  return href ? (
    <Link href={href} className="group block transition-transform hover:-translate-y-1">
      {content}
    </Link>
  ) : (
    content
  );
}
