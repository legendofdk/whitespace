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
  isSold?: boolean;
  description?: string;
};

export function ListingCard({ href, title, address, area, metric, price, image, badge, isSold, description }: ListingCardProps) {
  const content = (
    <article className="content-lift group flex h-full flex-col overflow-hidden rounded-[28px] border border-line bg-white shadow-soft transition duration-500 hover:shadow-[0_24px_60px_rgba(15,23,42,0.14)]">
      <div className="relative h-48 overflow-hidden">
        <Image src={image} alt={title} fill className="object-cover transition duration-700 group-hover:scale-[1.04]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_56%,rgba(8,18,37,0.18)_100%)] opacity-80" />
        {isSold ? (
          <div className="absolute left-4 top-4 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-red-700 shadow-sm">
            Đã bán
          </div>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-4">
          <span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-navy">{badge ?? area}</span>
          <div className="rounded-xl bg-[linear-gradient(135deg,#fff5e1,#ffebbb)] px-3 py-2 text-right shadow-[0_10px_20px_rgba(191,138,38,0.12)] ring-1 ring-[#ecd39c]">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#9f6a13]">
              {badge?.toLowerCase().includes("thuê") ? "Giá thuê" : "Giá bán"}
            </p>
            <p className="mt-1 text-base font-black leading-none text-[#8b5a16]">{price}</p>
          </div>
        </div>
        <h3 className="min-h-[3.5rem] font-display text-[1.35rem] leading-tight text-ink">{title}</h3>
        <p className="min-h-[2.5rem] text-sm leading-5 text-steel">{address}</p>
        <p className="text-sm leading-6 font-medium text-navy">{metric}</p>
        {description ? (
          <div className="min-h-[5.75rem] overflow-hidden">
            <HtmlContent
              html={description}
              className="prose prose-sm max-w-none overflow-hidden text-steel prose-p:my-0 prose-p:leading-6 prose-li:leading-6 prose-strong:text-ink [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]"
            />
          </div>
        ) : null}
        <div className="mt-auto pt-0.5">
          <span className="inline-flex rounded-full border border-ink px-4 py-2.5 text-sm font-semibold text-ink transition group-hover:bg-ink group-hover:text-white">
            Xem chi tiết
          </span>
        </div>
      </div>
    </article>
  );

  return href ? (
    <Link href={href} className="block">
      {content}
    </Link>
  ) : (
    content
  );
}
