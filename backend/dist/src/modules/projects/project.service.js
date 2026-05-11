import { PropertyKind } from "@prisma/client";
import { deleteCloudinaryAssets, getCloudinaryPublicIdFromUrl, getRemovedAssetPublicIds } from "../../lib/cloudinary.js";
import { prisma } from "../../lib/prisma.js";
const projectInclude = {
    area: true,
    apartments: {
        where: {
            kind: PropertyKind.APARTMENT
        },
        orderBy: {
            name: "asc"
        }
    },
    utilities: {
        orderBy: {
            createdAt: "asc"
        }
    },
    gallery: {
        orderBy: {
            sortOrder: "asc"
        }
    }
};
function mapProject(item) {
    return {
        id: item.id,
        kind: item.kind,
        name: item.name,
        slug: item.slug,
        investor: item.investor,
        area: item.area.name,
        areaSlug: item.area.slug,
        address: item.address,
        scale: item.scale,
        productTypes: item.productTypes,
        villaInfo: item.villaInfo,
        shophouseInfo: item.shophouseInfo,
        startTime: item.startTime,
        handoverTime: item.handoverTime,
        ownership: item.ownership,
        price: item.price,
        hotline: item.hotline,
        badge: item.badge,
        cardMeta: item.cardMeta,
        projectStatusTag: item.projectStatusTag,
        apartments: item.apartments.map((apartment) => ({
            id: apartment.id,
            name: apartment.name,
            slug: apartment.slug,
            price: apartment.price,
            size: apartment.size,
            rentalType: apartment.rentalType,
            status: apartment.status,
            isFeatured: apartment.isFeatured,
            isSold: apartment.isSold
        })),
        thumbnail: item.thumbnail,
        bannerImage: item.bannerImage,
        gallery: item.gallery.map((media) => media.url),
        description: item.description,
        utilities: item.utilities.map((utility) => utility.label),
        mapEmbedUrl: item.mapEmbedUrl,
        isFeatured: item.isFeatured,
        seoTitle: item.seoTitle,
        seoDescription: item.seoDescription,
        status: item.status,
        coordinates: item.latitude !== null && item.longitude !== null
            ? {
                lat: Number(item.latitude),
                lng: Number(item.longitude)
            }
            : null,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
    };
}
async function getAreaIdBySlug(areaSlug) {
    const area = await prisma.area.findUnique({
        where: { slug: areaSlug }
    });
    if (!area) {
        throw new Error("AREA_NOT_FOUND");
    }
    return area.id;
}
export async function getProjectList(query = {}) {
    const where = {
        kind: PropertyKind.PROJECT
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
                investor: {
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
        include: projectInclude,
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }]
    });
    return items.map(mapProject);
}
export async function getProjectBySlug(slug) {
    const item = await prisma.property.findFirst({
        where: {
            kind: PropertyKind.PROJECT,
            slug
        },
        include: projectInclude
    });
    if (!item) {
        return null;
    }
    return mapProject(item);
}
export async function createProject(input) {
    const areaId = await getAreaIdBySlug(input.areaSlug);
    const item = await prisma.property.create({
        data: {
            kind: PropertyKind.PROJECT,
            name: input.name,
            slug: input.slug,
            investor: input.investor,
            areaId,
            address: input.address,
            scale: input.scale,
            productTypes: input.productTypes,
            villaInfo: input.villaInfo,
            shophouseInfo: input.shophouseInfo,
            startTime: input.startTime,
            handoverTime: input.handoverTime,
            ownership: input.ownership,
            price: input.price,
            hotline: input.hotline,
            thumbnail: input.thumbnail,
            thumbnailPublicId: getCloudinaryPublicIdFromUrl(input.thumbnail),
            bannerImage: input.bannerImage,
            bannerImagePublicId: getCloudinaryPublicIdFromUrl(input.bannerImage),
            description: input.description,
            mapEmbedUrl: input.mapEmbedUrl,
            isFeatured: input.isFeatured,
            seoTitle: input.seoTitle,
            seoDescription: input.seoDescription,
            status: input.status,
            latitude: input.latitude,
            longitude: input.longitude,
            badge: input.badge,
            cardMeta: input.cardMeta,
            projectStatusTag: input.projectStatusTag === "NONE" ? null : input.projectStatusTag,
            utilities: {
                create: input.utilities.map((label) => ({ label }))
            },
            gallery: {
                create: input.gallery.map((url, index) => ({
                    url,
                    publicId: getCloudinaryPublicIdFromUrl(url),
                    sortOrder: index
                }))
            }
        },
        include: projectInclude
    });
    return mapProject(item);
}
export async function updateProject(slug, input) {
    const existing = await prisma.property.findFirst({
        where: {
            kind: PropertyKind.PROJECT,
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
    const nextUrls = [input.thumbnail, input.bannerImage, ...input.gallery].filter((value) => Boolean(value));
    const removedAssetPublicIds = getRemovedAssetPublicIds([
        { url: existing.thumbnail, publicId: existing.thumbnailPublicId },
        { url: existing.bannerImage, publicId: existing.bannerImagePublicId },
        ...existing.gallery.map((media) => ({ url: media.url, publicId: media.publicId }))
    ], nextUrls);
    const item = await prisma.property.update({
        where: {
            id: existing.id
        },
        data: {
            name: input.name,
            slug: input.slug,
            investor: input.investor,
            areaId,
            address: input.address,
            scale: input.scale,
            productTypes: input.productTypes,
            villaInfo: input.villaInfo,
            shophouseInfo: input.shophouseInfo,
            startTime: input.startTime,
            handoverTime: input.handoverTime,
            ownership: input.ownership,
            price: input.price,
            hotline: input.hotline,
            thumbnail: input.thumbnail,
            thumbnailPublicId: getCloudinaryPublicIdFromUrl(input.thumbnail),
            bannerImage: input.bannerImage,
            bannerImagePublicId: getCloudinaryPublicIdFromUrl(input.bannerImage),
            description: input.description,
            mapEmbedUrl: input.mapEmbedUrl,
            isFeatured: input.isFeatured,
            seoTitle: input.seoTitle,
            seoDescription: input.seoDescription,
            status: input.status,
            latitude: input.latitude,
            longitude: input.longitude,
            badge: input.badge,
            cardMeta: input.cardMeta,
            projectStatusTag: input.projectStatusTag === "NONE" ? null : input.projectStatusTag,
            utilities: {
                deleteMany: {},
                create: input.utilities.map((label) => ({ label }))
            },
            gallery: {
                deleteMany: {},
                create: input.gallery.map((url, index) => ({
                    url,
                    publicId: getCloudinaryPublicIdFromUrl(url),
                    sortOrder: index
                }))
            }
        },
        include: projectInclude
    });
    await deleteCloudinaryAssets(removedAssetPublicIds);
    return mapProject(item);
}
export async function deleteProject(slug) {
    const existing = await prisma.property.findFirst({
        where: {
            kind: PropertyKind.PROJECT,
            slug
        },
        include: {
            gallery: true,
            apartments: {
                where: {
                    kind: PropertyKind.APARTMENT
                },
                include: {
                    gallery: true
                }
            }
        }
    });
    if (!existing) {
        return false;
    }
    const assetPublicIds = [
        existing.thumbnailPublicId,
        existing.bannerImagePublicId,
        ...existing.gallery.map((media) => media.publicId),
        ...existing.apartments.flatMap((apartment) => [
            apartment.thumbnailPublicId,
            apartment.bannerImagePublicId,
            ...apartment.gallery.map((media) => media.publicId)
        ])
    ].filter((value) => Boolean(value));
    await prisma.property.deleteMany({
        where: {
            parentProjectId: existing.id,
            kind: PropertyKind.APARTMENT
        }
    });
    await prisma.property.delete({
        where: {
            id: existing.id
        }
    });
    await deleteCloudinaryAssets(assetPublicIds);
    return true;
}
