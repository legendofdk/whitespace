import { ListingCard } from "@/components/cards/listing-card";
import { FilterBar } from "@/components/shared/filter-bar";
import { SectionHeading } from "@/components/shared/section-heading";
import { landListings } from "@/data/mock";
import { toLandCardItem } from "@/lib/real-estate";

export default function LandPage() {
  return (
    <main className="bg-mist pb-16">
      <section className="shell py-16">
        <p className="eyebrow">Đất nền</p>
        <h1 className="mt-4 font-display text-6xl text-ink">Những vị trí đáng chú ý tại phía Đông Hà Nội</h1>
      </section>

      <section className="shell">
        <FilterBar placeholder="Tìm kiếm đất nền" filters={["Khu vực", "Mức giá", "Diện tích"]} />
      </section>

      <section className="shell pt-16">
        <SectionHeading eyebrow="Đất nền hot" title="Các sản phẩm nổi bật theo từng khu vực tiềm năng" />
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
                description={cardItem.description}
              />
            );
          })}
        </div>
      </section>
    </main>
  );
}
