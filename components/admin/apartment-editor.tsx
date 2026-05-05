"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { fetchAdminApi } from "./admin-api";
import { FieldLabel } from "./field-label";
import { ImageUploadField } from "./image-upload-field";
import { RichTextEditor } from "./rich-text-editor";
import { slugify } from "./slug";

type ProjectOption = {
  id: string;
  name: string;
  slug: string;
  area: string;
};

const initialForm = {
  name: "",
  slug: "",
  projectSlug: "",
  address: "",
  size: "",
  rentalType: "Căn hộ",
  price: "",
  hotline: "0377281119",
  thumbnail: "",
  bannerImage: "",
  gallery: "",
  description: "",
  seoTitle: "",
  seoDescription: "",
  status: "PUBLISHED",
  latitude: "",
  longitude: "",
  badge: "Căn hộ",
  cardMeta: ""
};

export function ApartmentEditor({ slug }: { slug?: string }) {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<"idle" | "loading" | "submitting" | "success" | "error">(slug ? "loading" : "idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [projectOptions, setProjectOptions] = useState<ProjectOption[]>([]);
  const isEditing = Boolean(slug);
  const fieldClassName = "grid gap-2";
  const labelClassName = "text-sm font-medium text-ink";

  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await fetchAdminApi("/api/projects");
        if (!response.ok) {
          throw new Error("LOAD_PROJECTS_FAILED");
        }

        const data = (await response.json()) as {
          items: { id: string; name: string; slug: string; area: string }[];
        };

        setProjectOptions(data.items);
        setForm((current) => ({
          ...current,
          projectSlug: current.projectSlug || data.items[0]?.slug || ""
        }));
      } catch {
        setProjectOptions([]);
      }
    }

    void loadProjects();
  }, []);

  useEffect(() => {
    async function loadItem() {
      if (!slug) {
        return;
      }

      try {
        const response = await fetchAdminApi(`/api/apartments/${slug}`);
        if (!response.ok) {
          throw new Error("LOAD_FAILED");
        }

        const item = (await response.json()) as {
          name: string;
          slug: string;
          projectSlug?: string | null;
          address: string;
          size?: string | null;
          rentalType?: string | null;
          price: string;
          hotline: string;
          thumbnail: string;
          bannerImage?: string | null;
          gallery?: string[];
          description: string;
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
          projectSlug: item.projectSlug ?? "",
          address: item.address,
          size: item.size ?? "",
          rentalType: item.rentalType ?? "Căn hộ",
          price: item.price,
          hotline: item.hotline,
          thumbnail: item.thumbnail,
          bannerImage: item.bannerImage ?? "",
          gallery: item.gallery?.join("\n") ?? "",
          description: item.description,
          seoTitle: item.seoTitle ?? "",
          seoDescription: item.seoDescription ?? "",
          status: item.status,
          latitude: item.coordinates?.lat?.toString() ?? "",
          longitude: item.coordinates?.lng?.toString() ?? "",
          badge: item.badge ?? "Căn hộ",
          cardMeta: item.cardMeta ?? ""
        });
        setStatus("idle");
      } catch {
        setStatus("error");
        setErrorMessage("Chưa thể tải chi tiết căn hộ.");
      }
    }

    void loadItem();
  }, [slug]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetchAdminApi(isEditing ? `/api/apartments/${slug}` : "/api/apartments", {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          gallery: form.gallery.split("\n").map((item) => item.trim()).filter(Boolean),
          size: form.size || undefined,
          rentalType: form.rentalType || undefined,
          latitude: form.latitude || undefined,
          longitude: form.longitude || undefined,
          bannerImage: form.bannerImage || undefined,
          seoTitle: form.seoTitle || undefined,
          seoDescription: form.seoDescription || undefined,
          badge: form.badge || undefined,
          cardMeta: form.cardMeta || undefined
        })
      });

      if (!response.ok) {
        throw new Error("SAVE_FAILED");
      }

      setStatus("success");
      router.push("/dashboard/apartments");
      router.refresh();
    } catch {
      setStatus("error");
      setErrorMessage("Chưa thể lưu căn hộ.");
    }
  }

  return (
    <main className="py-4">
      <div className="rounded-[28px] border border-line bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-steel">{isEditing ? "Chi tiết căn hộ" : "Tạo căn hộ"}</p>
            <h1 className="mt-2 font-display text-4xl text-ink">{isEditing ? "Chỉnh sửa căn hộ" : "Tạo mới căn hộ"}</h1>
          </div>
          <Link href="/dashboard/apartments" className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink">
            Quay lại danh sách
          </Link>
        </div>

        {errorMessage ? <p className="mt-4 text-sm font-medium text-red-600">{errorMessage}</p> : null}
        {status === "success" ? <p className="mt-4 text-sm font-medium text-green-700">Lưu dữ liệu thành công.</p> : null}

        <form onSubmit={handleSubmit} className="mt-8 grid gap-4 xl:grid-cols-2">
          <label className={fieldClassName}>
            <FieldLabel label="Tên căn hộ" required className={labelClassName} />
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
              placeholder="Ví dụ: 102"
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
            <FieldLabel label="Dự án" required className={labelClassName} />
            <select
              value={form.projectSlug}
              onChange={(event) => setForm((current) => ({ ...current, projectSlug: event.target.value }))}
              className="h-12 rounded-full border border-line px-5 text-sm outline-none"
              required
            >
              <option value="" disabled>
                Chọn dự án
              </option>
              {projectOptions.map((project) => (
                <option key={project.id} value={project.slug}>
                  {project.name} • {project.area}
                </option>
              ))}
            </select>
          </label>
          <label className={fieldClassName}>
            <FieldLabel label="Địa chỉ" required className={labelClassName} />
            <input
              value={form.address}
              onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
              className="h-12 rounded-full border border-line px-5 text-sm outline-none"
              placeholder="Địa chỉ"
              required
            />
          </label>
          <label className={fieldClassName}>
            <FieldLabel label="Giá" required className={labelClassName} />
            <input value={form.price} onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))} className="h-12 rounded-full border border-line px-5 text-sm outline-none" placeholder="Giá" required />
          </label>
          <label className={fieldClassName}>
            <FieldLabel label="Diện tích" className={labelClassName} />
            <input value={form.size} onChange={(event) => setForm((current) => ({ ...current, size: event.target.value }))} className="h-12 rounded-full border border-line px-5 text-sm outline-none" placeholder="Diện tích" />
          </label>
          <label className={fieldClassName}>
            <FieldLabel label="Loại hình" className={labelClassName} />
            <input value={form.rentalType} onChange={(event) => setForm((current) => ({ ...current, rentalType: event.target.value }))} className="h-12 rounded-full border border-line px-5 text-sm outline-none" placeholder="Loại hình" />
          </label>
          <label className={fieldClassName}>
            <FieldLabel label="Hotline" required className={labelClassName} />
            <input value={form.hotline} onChange={(event) => setForm((current) => ({ ...current, hotline: event.target.value }))} className="h-12 rounded-full border border-line px-5 text-sm outline-none" placeholder="Hotline" required />
          </label>
          <div className="xl:col-span-2">
            <ImageUploadField
              label="Ảnh đại diện"
              required
              value={form.thumbnail}
              folder="apartments"
              description="Chọn một ảnh đại diện để hiển thị ở danh sách và trang chi tiết."
              onRemove={() => setForm((current) => ({ ...current, thumbnail: "" }))}
              onUploaded={(url) => setForm((current) => ({ ...current, thumbnail: url }))}
            />
          </div>
          <div className="xl:col-span-2">
            <RichTextEditor label="Mô tả" required value={form.description} onChange={(value) => setForm((current) => ({ ...current, description: value }))} placeholder="Mô tả căn hộ" />
          </div>
          <div className="xl:col-span-2">
            <ImageUploadField
              label="Bộ ảnh căn hộ"
              value={form.gallery}
              folder="apartments"
              multiple
              description="Có thể chọn nhiều ảnh một lần để thêm vào bộ ảnh."
              onRemove={(url) =>
                setForm((current) => ({
                  ...current,
                  gallery: current.gallery
                    .split("\n")
                    .map((item) => item.trim())
                    .filter((item) => item && item !== url)
                    .join("\n")
                }))
              }
              onUploaded={(url) => setForm((current) => ({ ...current, gallery: current.gallery ? `${current.gallery}\n${url}` : url }))}
            />
          </div>
          <button disabled={status === "submitting" || status === "loading" || !form.projectSlug} className="h-12 rounded-full bg-ink text-sm font-semibold text-white disabled:opacity-70 xl:col-span-2">
            {status === "submitting" ? "Đang lưu..." : isEditing ? "Cập nhật căn hộ" : "Tạo căn hộ"}
          </button>
        </form>
      </div>
    </main>
  );
}
