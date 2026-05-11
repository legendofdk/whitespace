import type { Metadata } from "next";

import { ListingCard } from "@/components/cards/listing-card";
import { FilterBar } from "@/components/shared/filter-bar";
import { getPublicRentals } from "@/lib/public-api";
import { toRentalCardItem } from "@/lib/real-estate";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata: Metadata = buildMetadata({
  title: "Mặt bằng và shophouse cho thuê phía Đông Hà Nội",
  description: "Khám phá mặt bằng, shophouse và sản phẩm cho thuê tại Long Biên, Gia Lâm, Đông Anh với thông tin diện tích và khả năng khai thác.",
  path: "/cho-thue",
  keywords: ["cho thuê shophouse long biên", "mặt bằng gia lâm", "cho thuê bất động sản phía đông hà nội"]
});

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
      <section className="shell pt-8 sm:pt-10">
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

      <section className="shell pb-12 pt-5 sm:pb-14 sm:pt-6">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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
                isSold={cardItem.isSold}
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
