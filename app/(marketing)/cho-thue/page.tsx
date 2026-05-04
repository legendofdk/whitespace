import { ListingCard } from "@/components/cards/listing-card";
import { FilterBar } from "@/components/shared/filter-bar";
import { SectionHeading } from "@/components/shared/section-heading";
import { getPublicRentals } from "@/lib/public-api";
import { toRentalCardItem } from "@/lib/real-estate";

export const dynamic = "force-dynamic";

export default async function RentalPage({
  searchParams
}: {
  searchParams: Promise<{ area?: string; featured?: string }>;
}) {
  const params = await searchParams;
  const filteredRentals = await getPublicRentals({
    area: params.area,
    featured: params.featured === "true" ? true : params.featured === "false" ? false : undefined
  });

  return (
    <main className="bg-mist pb-16">
      <section className="shell py-16">
        <p className="eyebrow">Cho thuê</p>
        <h1 className="mt-4 font-display text-6xl text-ink">Mặt bằng và shophouse phù hợp khai thác thương mại</h1>
      </section>

      <section className="shell">
        <FilterBar
          action="/cho-thue"
          showSearch={false}
          filters={[
            {
              name: "area",
              label: "Khu vực",
              defaultValue: params.area ?? "",
              options: [
                { label: "Tất cả khu vực", value: "" },
                { label: "Gia Lâm", value: "gia-lam" },
                { label: "Long Biên", value: "long-bien" },
                { label: "Đông Anh", value: "dong-anh" }
              ]
            },
            {
              name: "featured",
              label: "Nổi bật",
              defaultValue: params.featured ?? "",
              options: [
                { label: "Tất cả sản phẩm", value: "" },
                { label: "Cho thuê nổi bật", value: "true" }
              ]
            }
          ]}
        />
      </section>

      <section className="shell pt-16">
        <SectionHeading eyebrow="Cho thuê nổi bật" title="Các vị trí phù hợp kinh doanh và vận hành thực tế" />
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredRentals.map((item) => {
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
                description={cardItem.description}
              />
            );
          })}
        </div>
      </section>
    </main>
  );
}
