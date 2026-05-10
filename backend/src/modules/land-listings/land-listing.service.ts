import { Prisma, PropertyKind } from "@prisma/client";

import { deleteCloudinaryAssets, getCloudinaryPublicIdFromUrl, getRemovedAssetPublicIds } from "../../lib/cloudinary.js";
import { prisma } from "../../lib/prisma.js";
import type { LandListingBodyInput, ListLandListingsQueryInput } from "./land-listing.schema.js";

const landListingInclude = {
  area: true,
  gallery: {
    orderBy: {
      sortOrder: "asc" as const
    }
  }
};

function mapLandListing(item: Prisma.PropertyGetPayload<{ include: typeof landListingInclude }>) {
  return {
    id: item.id,
    kind: item.kind,
    name: item.name,
    slug: item.slug,
    area: item.area.name,
    areaSlug: item.area.slug,
    address: item.address,
    acreage: item.acreage,
    legal: item.legal,
    price: item.price,
    hotline: item.hotline,
    badge: item.badge,
    cardMeta: item.cardMeta,
    thumbnail: item.thumbnail,
    bannerImage: item.bannerImage,
    gallery: item.gallery.map((media) => media.url),
    description: item.description,
    mapEmbedUrl: item.mapEmbedUrl,
    isFeatured: item.isFeatured,
    isSold: item.isSold,
    seoTitle: item.seoTitle,
    seoDescription: item.seoDescription,
    status: item.status,
    coordinates:
      item.latitude !== null && item.longitude !== null
        ? {
            lat: Number(item.latitude),
            lng: Number(item.longitude)
          }
        : null,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt
  };
}

async function getAreaIdBySlug(areaSlug: string) {
  const area = await prisma.area.findUnique({
    where: { slug: areaSlug }
  });

  if (!area) {
    throw new Error("AREA_NOT_FOUND");
  }

  return area.id;
}

export async function getLandListingList(query: ListLandListingsQueryInput = {}) {
  const where: Prisma.PropertyWhereInput = {
    kind: PropertyKind.LAND
  };

  if (query.search) {
    where.OR = [
      {
        name: {
          contains: query.search,
          mode: "insensitive"
        }
      },
      {
        address: {
          contains: query.search,
          mode: "insensitive"
        }
      }
    ];
  }

  if (query.area) {
    where.area = {
      slug: query.area
    };
  }

  if (typeof query.featured === "boolean") {
    where.isFeatured = query.featured;
  }

  if (query.status) {
    where.status = query.status;
  }

  const items = await prisma.property.findMany({
    where,
    include: landListingInclude,
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }]
  });

  return items.map(mapLandListing);
}

export async function getLandListingBySlug(slug: string) {
  const item = await prisma.property.findFirst({
    where: {
      kind: PropertyKind.LAND,
      slug
    },
    include: landListingInclude
  });

  if (!item) {
    return null;
  }

  return mapLandListing(item);
}

export async function createLandListing(input: LandListingBodyInput) {
  const areaId = await getAreaIdBySlug(input.areaSlug);

  const item = await prisma.property.create({
    data: {
      kind: PropertyKind.LAND,
      name: input.name,
      slug: input.slug,
      areaId,
      address: input.address,
      acreage: input.acreage,
      legal: input.legal,
      price: input.price,
      hotline: input.hotline,
      thumbnail: input.thumbnail,
      thumbnailPublicId: getCloudinaryPublicIdFromUrl(input.thumbnail),
      bannerImage: input.bannerImage,
      bannerImagePublicId: getCloudinaryPublicIdFromUrl(input.bannerImage),
      description: input.description,
      mapEmbedUrl: input.mapEmbedUrl,
      isFeatured: input.isFeatured,
      isSold: input.isSold,
      seoTitle: input.seoTitle,
      seoDescription: input.seoDescription,
      status: input.status,
      latitude: input.latitude,
      longitude: input.longitude,
      badge: input.badge,
      cardMeta: input.cardMeta,
      gallery: {
        create: input.gallery.map((url, index) => ({
          url,
          publicId: getCloudinaryPublicIdFromUrl(url),
          sortOrder: index
        }))
      }
    },
    include: landListingInclude
  });

  return mapLandListing(item);
}

export async function updateLandListing(slug: string, input: LandListingBodyInput) {
  const existing = await prisma.property.findFirst({
    where: {
      kind: PropertyKind.LAND,
      slug
    },
    include: {
      gallery: true
    }
  });

  if (!existing) {
    return null;
  }

  const areaId = await getAreaIdBySlug(input.areaSlug);
  const nextUrls = [input.thumbnail, input.bannerImage, ...input.gallery].filter((value): value is string => Boolean(value));
  const removedAssetPublicIds = getRemovedAssetPublicIds(
    [
      { url: existing.thumbnail, publicId: existing.thumbnailPublicId },
      { url: existing.bannerImage, publicId: existing.bannerImagePublicId },
      ...existing.gallery.map((media) => ({ url: media.url, publicId: media.publicId }))
    ],
    nextUrls
  );

  const item = await prisma.property.update({
    where: {
      id: existing.id
    },
    data: {
      name: input.name,
      slug: input.slug,
      areaId,
      address: input.address,
      acreage: input.acreage,
      legal: input.legal,
      price: input.price,
      hotline: input.hotline,
      thumbnail: input.thumbnail,
      thumbnailPublicId: getCloudinaryPublicIdFromUrl(input.thumbnail),
      bannerImage: input.bannerImage,
      bannerImagePublicId: getCloudinaryPublicIdFromUrl(input.bannerImage),
      description: input.description,
      mapEmbedUrl: input.mapEmbedUrl,
      isFeatured: input.isFeatured,
      isSold: input.isSold,
      seoTitle: input.seoTitle,
      seoDescription: input.seoDescription,
      status: input.status,
      latitude: input.latitude,
      longitude: input.longitude,
      badge: input.badge,
      cardMeta: input.cardMeta,
      gallery: {
        deleteMany: {},
        create: input.gallery.map((url, index) => ({
          url,
          publicId: getCloudinaryPublicIdFromUrl(url),
          sortOrder: index
        }))
      }
    },
    include: landListingInclude
  });

  await deleteCloudinaryAssets(removedAssetPublicIds);

  return mapLandListing(item);
}

export async function deleteLandListing(slug: string) {
  const existing = await prisma.property.findFirst({
    where: {
      kind: PropertyKind.LAND,
      slug
    },
    include: {
      gallery: true
    }
  });

  if (!existing) {
    return false;
  }

  const assetPublicIds = [
    existing.thumbnailPublicId,
    existing.bannerImagePublicId,
    ...existing.gallery.map((media) => media.publicId)
  ].filter((value): value is string => Boolean(value));

  await prisma.property.delete({
    where: {
      id: existing.id
    }
  });

  await deleteCloudinaryAssets(assetPublicIds);

  return true;
}
