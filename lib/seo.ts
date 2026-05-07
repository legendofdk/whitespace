import type { Metadata } from "next";

const defaultSiteUrl = "https://batdongsanphiadong.vn";

export function getSiteUrl() {
  const value =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    defaultSiteUrl;

  return value.replace(/\/+$/, "");
}

export function absoluteUrl(path = "/") {
  return `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildMetadata({
  title,
  description,
  path = "/",
  image,
  type = "website",
  keywords
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  keywords?: string[];
}): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image ? [image] : [absoluteUrl("/hero-hanoi.jpg")];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Batdongsanphiadong",
      locale: "vi_VN",
      type,
      images: ogImage.map((item) => ({ url: item }))
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage
    }
  };
}
