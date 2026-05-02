import Image from "next/image";
import Link from "next/link";

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
          <span className="text-sm font-semibold text-sand">{price}</span>
        </div>
        <h3 className="font-display text-2xl text-ink">{title}</h3>
        <p className="text-sm text-steel">{address}</p>
        <p className="text-sm font-medium text-navy">{metric}</p>
        {description ? <p className="text-sm leading-7 text-steel">{description}</p> : null}
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
