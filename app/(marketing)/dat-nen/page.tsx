import { ListingCard } from "@/components/cards/listing-card";
import { FilterBar } from "@/components/shared/filter-bar";
import { SectionHeading } from "@/components/shared/section-heading";
import { getPublicLandListings } from "@/lib/public-api";
import { toLandCardItem } from "@/lib/real-estate";

export const dynamic = "force-dynamic";

export default async function LandPage({
  searchParams
}: {
  searchParams: Promise<{ area?: string; search?: string; featured?: string }>;
}) {
  const params = await searchParams;
  const filteredLandListings = await getPublicLandListings({
    area: params.area,
    search: params.search || undefined,
    featured: params.featured === "true" ? true : params.featured === "false" ? false : undefined
  });

  return (
    <main className="bg-mist pb-16">
      <section className="shell py-16">
        <p className="eyebrow">Đất nền</p>
        <h1 className="mt-4 font-display text-6xl text-ink">Những vị trí đáng chú ý tại phía Đông Hà Nội</h1>
      </section>

      <section className="shell">
        <FilterBar
          action="/dat-nen"
          searchPlaceholder="Tìm kiếm đất nền"
          searchDefaultValue={params.search ?? ""}
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
                { label: "Đất nền nổi bật", value: "true" }
              ]
            }
          ]}
        />
      </section>

      <section className="shell pt-16">
        <SectionHeading eyebrow="Đất nền hot" title="Các sản phẩm nổi bật theo từng khu vực tiềm năng" />
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredLandListings.map((item) => {
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
