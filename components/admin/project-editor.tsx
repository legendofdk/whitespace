"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { ImageUploadField } from "./image-upload-field";
import { FieldLabel } from "./field-label";
import { RichTextEditor } from "./rich-text-editor";
import { slugify } from "./slug";
import { fetchAdminApi } from "./admin-api";
import type { AreaOption } from "./area-options";

const initialForm = {
  name: "",
  slug: "",
  investor: "",
  areaSlug: "gia-lam",
  address: "",
  scale: "",
  productTypes: "Biệt thự, Shophouse",
  villaInfo: "",
  shophouseInfo: "",
  startTime: "",
  handoverTime: "",
  ownership: "",
  price: "",
  hotline: "0377281119",
  thumbnail: "",
  bannerImage: "",
  gallery: "",
  description: "",
  utilities: "",
  mapEmbedUrl: "",
  isFeatured: true,
  seoTitle: "",
  seoDescription: "",
  status: "PUBLISHED",
  latitude: "",
  longitude: "",
  badge: "",
  cardMeta: ""
};

type ProjectEditorProps = {
  slug?: string;
};

export function ProjectEditor({ slug }: ProjectEditorProps) {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<"idle" | "loading" | "submitting" | "success" | "error">(
    slug ? "loading" : "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [areaOptions, setAreaOptions] = useState<AreaOption[]>([]);
  const isEditing = Boolean(slug);
  const fieldClassName = "grid gap-2";
  const labelClassName = "text-sm font-medium text-ink";

  useEffect(() => {
    async function loadAreas() {
      try {
        const response = await fetchAdminApi("/api/areas");
        if (!response.ok) {
          throw new Error("LOAD_AREAS_FAILED");
        }

        const data = (await response.json()) as { items: AreaOption[] };
        setAreaOptions(data.items);
      } catch {
        setAreaOptions([]);
      }
    }

    void loadAreas();
  }, []);

  useEffect(() => {
    async function loadProject() {
      if (!slug) {
        return;
      }

      try {
        const response = await fetchAdminApi(`/api/projects/${slug}`);
        if (!response.ok) {
          throw new Error("LOAD_FAILED");
        }

        const item = (await response.json()) as {
          name: string;
          slug: string;
          investor?: string | null;
          area: string;
          areaSlug: string;
          address: string;
          scale?: string | null;
          productTypes?: string[];
          villaInfo?: string | null;
          shophouseInfo?: string | null;
          startTime?: string | null;
          handoverTime?: string | null;
          ownership?: string | null;
          price: string;
          hotline: string;
          thumbnail: string;
          bannerImage?: string | null;
          gallery?: string[];
          description: string;
          utilities?: string[];
          mapEmbedUrl?: string | null;
          isFeatured: boolean;
          seoTitle?: string | null;
          seoDescription?: string | null;
          status: string;
          coordinates?: { lat: number; lng: number } | null;
          badge?: string | null;
          cardMeta?: string | null;
        };

        setForm({
          name: item.name,
          slug: item.slug,
          investor: item.investor ?? "",
          areaSlug: item.areaSlug,
          address: item.address,
          scale: item.scale ?? "",
          productTypes: item.productTypes?.join(", ") ?? "",
          villaInfo: item.villaInfo ?? "",
          shophouseInfo: item.shophouseInfo ?? "",
          startTime: item.startTime ?? "",
          handoverTime: item.handoverTime ?? "",
          ownership: item.ownership ?? "",
          price: item.price,
          hotline: item.hotline,
          thumbnail: item.thumbnail,
          bannerImage: item.bannerImage ?? "",
          gallery: item.gallery?.join("\n") ?? "",
          description: item.description,
          utilities: item.utilities?.join(", ") ?? "",
          mapEmbedUrl: item.mapEmbedUrl ?? "",
          isFeatured: item.isFeatured,
          seoTitle: item.seoTitle ?? "",
          seoDescription: item.seoDescription ?? "",
          status: item.status,
          latitude: item.coordinates?.lat?.toString() ?? "",
          longitude: item.coordinates?.lng?.toString() ?? "",
          badge: item.badge ?? "",
          cardMeta: item.cardMeta ?? ""
        });
        setStatus("idle");
      } catch {
        setStatus("error");
        setErrorMessage("Chưa thể tải chi tiết dự án.");
      }
    }

    void loadProject();
  }, [slug]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const payload = {
        ...form,
        productTypes: form.productTypes.split(",").map((item) => item.trim()).filter(Boolean),
        gallery: form.gallery.split("\n").map((item) => item.trim()).filter(Boolean),
        utilities: form.utilities.split(",").map((item) => item.trim()).filter(Boolean),
        latitude: form.latitude || undefined,
        longitude: form.longitude || undefined,
        bannerImage: form.bannerImage || undefined,
        mapEmbedUrl: form.mapEmbedUrl || undefined,
        seoTitle: form.seoTitle || undefined,
        seoDescription: form.seoDescription || undefined,
        investor: form.investor || undefined,
        scale: form.scale || undefined,
        villaInfo: form.villaInfo || undefined,
        shophouseInfo: form.shophouseInfo || undefined,
        startTime: form.startTime || undefined,
        handoverTime: form.handoverTime || undefined,
        ownership: form.ownership || undefined,
        badge: form.badge || undefined,
        cardMeta: form.cardMeta || undefined
      };

      const response = await fetchAdminApi(isEditing ? `/api/projects/${slug}` : "/api/projects", {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("SAVE_FAILED");
      }

      setStatus("success");
      router.push("/dashboard/projects");
      router.refresh();
    } catch {
      setStatus("error");
      setErrorMessage("Chưa thể lưu dự án.");
    }
  }

  return (
    <main className="py-4">
      <div className="rounded-[28px] border border-line bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-steel">
              {isEditing ? "Chi tiết dự án" : "Tạo dự án"}
            </p>
            <h1 className="mt-2 font-display text-4xl text-ink">
              {isEditing ? "Chỉnh sửa thông tin dự án" : "Tạo mới dự án"}
            </h1>
          </div>

          <Link href="/dashboard/projects" className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink">
            Quay lại danh sách
          </Link>
        </div>

        {errorMessage ? <p className="mt-4 text-sm font-medium text-red-600">{errorMessage}</p> : null}
        {status === "success" ? <p className="mt-4 text-sm font-medium text-green-700">Lưu dữ liệu thành công.</p> : null}

        <form onSubmit={handleSubmit} className="mt-8 grid gap-4 xl:grid-cols-2">
          <label className={fieldClassName}>
            <FieldLabel label="Tên dự án" required className={labelClassName} />
            <input
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  name: event.target.value,
                  slug: slugTouched ? current.slug : slugify(event.target.value)
                }))
              }
              className="h-12 rounded-full border border-line px-5 text-sm outline-none"
              placeholder="Tên dự án"
              required
            />
          </label>
          <label className={fieldClassName}>
            <FieldLabel label="Slug" required className={labelClassName} />
            <input
              value={form.slug}
              onChange={(event) => {
                setSlugTouched(true);
                setForm((current) => ({ ...current, slug: slugify(event.target.value) }));
              }}
              className="h-12 rounded-full border border-line px-5 text-sm outline-none"
              placeholder="Slug"
              required
            />
          </label>
          <label className={fieldClassName}>
            <FieldLabel label="Chủ đầu tư" className={labelClassName} />
            <input value={form.investor} onChange={(e) => setForm((c) => ({ ...c, investor: e.target.value }))} className="h-12 rounded-full border border-line px-5 text-sm outline-none" placeholder="Chủ đầu tư" />
          </label>
          <label className={fieldClassName}>
            <FieldLabel label="Khu vực" className={labelClassName} />
            <select value={form.areaSlug} onChange={(e) => setForm((c) => ({ ...c, areaSlug: e.target.value }))} className="h-12 rounded-full border border-line px-5 text-sm outline-none">
              {areaOptions.map((area) => (
                <option key={area.id} value={area.slug}>
                  {area.name}
                </option>
              ))}
            </select>
          </label>
          <label className={`${fieldClassName} xl:col-span-2`}>
            <FieldLabel label="Địa chỉ" required className={labelClassName} />
            <input value={form.address} onChange={(e) => setForm((c) => ({ ...c, address: e.target.value }))} className="h-12 rounded-full border border-line px-5 text-sm outline-none" placeholder="Địa chỉ" required />
          </label>
          <label className={`${fieldClassName} xl:col-span-2`}>
            <FieldLabel label="Link Google Map" className={labelClassName} />
            <input
              value={form.mapEmbedUrl}
              onChange={(e) => setForm((c) => ({ ...c, mapEmbedUrl: e.target.value }))}
              className="h-12 rounded-full border border-line px-5 text-sm outline-none"
              placeholder="Dán link Google Map hoặc link embed"
            />
          </label>
          <label className={fieldClassName}>
            <FieldLabel label="Giá bán" required className={labelClassName} />
            <input value={form.price} onChange={(e) => setForm((c) => ({ ...c, price: e.target.value }))} className="h-12 rounded-full border border-line px-5 text-sm outline-none" placeholder="Giá bán" required />
          </label>
          <label className={fieldClassName}>
            <FieldLabel label="Quy mô" className={labelClassName} />
            <input value={form.scale} onChange={(e) => setForm((c) => ({ ...c, scale: e.target.value }))} className="h-12 rounded-full border border-line px-5 text-sm outline-none" placeholder="Quy mô" />
          </label>
          <label className="flex items-center gap-3 rounded-[20px] border border-line px-5 py-3 text-sm font-medium text-ink">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => setForm((c) => ({ ...c, isFeatured: e.target.checked }))}
              className="h-4 w-4 rounded border-line"
            />
            Dự án nổi bật
          </label>
          <label className={`${fieldClassName} xl:col-span-2`}>
            <FieldLabel label="Loại sản phẩm" className={labelClassName} />
            <input value={form.productTypes} onChange={(e) => setForm((c) => ({ ...c, productTypes: e.target.value }))} className="h-12 rounded-full border border-line px-5 text-sm outline-none" placeholder="Loại sản phẩm, cách nhau bằng dấu phẩy" />
          </label>
          <div className="xl:col-span-2">
            <ImageUploadField label="Ảnh đại diện" required value={form.thumbnail} folder="projects" description="Chọn một ảnh đại diện để hiển thị ở card và trang chi tiết." onUploaded={(url) => setForm((c) => ({ ...c, thumbnail: url }))} />
          </div>
          <div className="xl:col-span-2">
            <RichTextEditor
              label="Mô tả"
              required
              value={form.description}
              onChange={(value) => setForm((c) => ({ ...c, description: value }))}
              placeholder="Mô tả"
            />
          </div>
          <label className={`${fieldClassName} xl:col-span-2`}>
            <FieldLabel label="Tiện ích" className={labelClassName} />
            <textarea value={form.utilities} onChange={(e) => setForm((c) => ({ ...c, utilities: e.target.value }))} className="min-h-24 rounded-[24px] border border-line px-5 py-4 text-sm outline-none" placeholder="Tiện ích, cách nhau bằng dấu phẩy" />
          </label>
          <div className="xl:col-span-2">
            <ImageUploadField
              label="Bộ ảnh dự án"
              value={form.gallery}
              folder="projects"
              multiple
              description="Có thể chọn nhiều ảnh một lần để thêm vào bộ gallery của dự án."
              onRemove={(url) =>
                setForm((c) => ({
                  ...c,
                  gallery: c.gallery
                    .split("\n")
                    .map((item) => item.trim())
                    .filter((item) => item && item !== url)
                    .join("\n")
                }))
              }
              onUploaded={(url) => setForm((c) => ({ ...c, gallery: c.gallery ? `${c.gallery}\n${url}` : url }))}
            />
          </div>
          <button disabled={status === "submitting" || status === "loading"} className="h-12 rounded-full bg-ink text-sm font-semibold text-white disabled:opacity-70 xl:col-span-2">
            {status === "submitting" ? "Đang lưu..." : isEditing ? "Cập nhật dự án" : "Tạo dự án"}
          </button>
        </form>
      </div>
    </main>
  );
}
