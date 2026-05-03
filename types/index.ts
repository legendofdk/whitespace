export type RealEstateKind = "project" | "land" | "rental";

export type RealEstateBase = {
  id: string;
  slug: string;
  name: string;
  kind: RealEstateKind;
  area: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  price: string;
  hotline: string;
  thumbnail: string;
  gallery: string[];
  description: string;
  mapEmbedUrl?: string;
  isFeatured: boolean;
  badge?: string;
  cardMeta: string;
};

export type Project = RealEstateBase & {
  investor: string;
  bannerImage: string;
  scale: string;
  productTypes: string[];
  villaInfo?: string;
  shophouseInfo?: string;
  startTime?: string;
  handoverTime?: string;
  ownership?: string;
  utilities: string[];
  floorPlanImages?: string[];
  seoTitle?: string;
  seoDescription?: string;
};

export type LandListing = RealEstateBase & {
  acreage: string;
  legal: string;
  bannerImage?: string;
};

export type RentalListing = RealEstateBase & {
  size: string;
  rentalType?: string;
  bannerImage?: string;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  category: string;
  publishedAt: string;
  excerpt: string;
  thumbnail: string;
  bannerImage?: string;
  content: string;
  relatedPostSlugs?: string[];
  seoTitle?: string;
  seoDescription?: string;
};
