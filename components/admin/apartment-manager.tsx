"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

import { fetchAdminApi } from "./admin-api";
import { ImageUploadField } from "./image-upload-field";
import { RichTextEditor } from "./rich-text-editor";
import { slugify } from "./slug";

type ApartmentItem = {
  id: string;
  name: string;
  slug: string;
  areaSlug: string;
  area: string;
  projectSlug: string | null;
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

const initialForm = {
  name: "",
  slug: "",
  address: "",
  size: "",
  rentalType: "Căn hộ",
  price: "",
  hotline: "0377281119",
  thumbnail: "",
  bannerImage: "",
  gallery: "",
  description: "",
  isFeatured: false,
  seoTitle: "",
  seoDescription: "",
  status: "PUBLISHED",
  latitude: "",
  longitude: "",
  badge: "Căn hộ",
  cardMeta: ""
};

export function ApartmentManager({
  projectSlug,
  initialProjectName,
  initialProjectAddress
}: {
  projectSlug: string;
  initialProjectName?: string;
  initialProjectAddress?: string;
}) {
  const [projectName, setProjectName] = useState(initialProjectName ?? "");
  const [projectAddress, setProjectAddress] = useState(initialProjectAddress ?? "");
  const [items, setItems] = useState<ApartmentItem[]>([]);
  const [form, setForm] = useState({
    ...initialForm,
    address: initialProjectAddress ?? ""
  });
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "submitting">("loading");
  const [projectLoaded, setProjectLoaded] = useState(Boolean(initialProjectName || initialProjectAddress));
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      address: current.address || projectAddress
    }));
  }, [projectAddress]);

  useEffect(() => {
    async function loadProject() {
      try {
        const response = await fetchAdminApi(`/api/projects/${projectSlug}`);
        if (!response.ok) {
          throw new Error("LOAD_PROJECT_FAILED");
        }

        const project = (await response.json()) as {
          name: string;
          areaSlug: string;
          address: string;
        };

        setProjectName(project.name);
        setProjectAddress(project.address);
        setProjectLoaded(true);
      } catch {
        setProjectName((current) => current || projectSlug);
        setProjectLoaded(false);
      }
    }

    void loadProject();
  }, [projectSlug]);

  async function loadApartments() {
    setErrorMessage("");
    setStatus("loading");

    try {
      const response = await fetchAdminApi(`/api/apartments?projectSlug=${encodeURIComponent(projectSlug)}`);
      if (!response.ok) {
        throw new Error("LOAD_FAILED");
      }

      const data = (await response.json()) as { items: ApartmentItem[] };
      setItems(data.items);
      setStatus("idle");
    } catch {
      setStatus("idle");
      setErrorMessage("Chưa thể tải danh sách căn hộ.");
    }
  }

  useEffect(() => {
    void loadApartments();
  }, [projectSlug]);

  function resetForm() {
    setForm({ ...initialForm, address: projectAddress });
    setEditingSlug(null);
    setSlugTouched(false);
  }

  function startEdit(item: ApartmentItem) {
    setEditingSlug(item.slug);
    setSlugTouched(true);
    setForm({
      name: item.name,
      slug: item.slug,
      address: item.address,
      size: item.size ?? "",
      rentalType: item.rentalType ?? "Căn hộ",
      price: item.price,
      hotline: item.hotline,
      thumbnail: item.thumbnail,
      bannerImage: item.bannerImage ?? "",
      gallery: item.gallery?.join("\n") ?? "",
      description: item.description,
      isFeatured: item.isFeatured,
      seoTitle: item.seoTitle ?? "",
      seoDescription: item.seoDescription ?? "",
      status: item.status,
      latitude: item.coordinates?.lat?.toString() ?? "",
      longitude: item.coordinates?.lng?.toString() ?? "",
      badge: item.badge ?? "Căn hộ",
      cardMeta: item.cardMeta ?? ""
    });
    setSuccessMessage("");
    setErrorMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetchAdminApi(editingSlug ? `/api/apartments/${editingSlug}` : "/api/apartments", {
        method: editingSlug ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          projectSlug,
          gallery: form.gallery
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),
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
        const errorData = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(errorData?.message || "SAVE_FAILED");
      }

      await loadApartments();
      setSuccessMessage(editingSlug ? "Đã cập nhật căn hộ." : "Đã tạo căn hộ.");
      resetForm();
    } catch (error) {
      setStatus("idle");
      setErrorMessage(error instanceof Error ? error.message : "Chưa thể lưu căn hộ.");
    }
  }

  async function handleDelete(item: ApartmentItem) {
    const confirmed = window.confirm(`Xóa căn hộ "${item.name}"?`);
    if (!confirmed) {
      return;
    }

    setDeletingId(item.id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetchAdminApi(`/api/apartments/${item.slug}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("DELETE_FAILED");
      }

      await loadApartments();
      if (editingSlug === item.slug) {
        resetForm();
      }
    } catch {
      setErrorMessage("Chưa thể xóa căn hộ.");
    } finally {
      setDeletingId(null);
    }
  }

  const fieldClassName = "grid gap-2";
  const labelClassName = "text-sm font-medium text-ink";

  return (
    <section className="rounded-[28px] border border-line bg-white p-6 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-steel">Căn hộ thuộc dự án</p>
          <h2 className="mt-2 font-display text-3xl text-ink">{projectName}</h2>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => void loadApartments()} className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink">
            Tải lại
          </button>
          {editingSlug ? (
            <button type="button" onClick={resetForm} className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink">
              Tạo căn hộ mới
            </button>
          ) : null}
        </div>
      </div>

      {errorMessage ? <p className="mt-4 text-sm font-medium text-red-600">{errorMessage}</p> : null}
      {successMessage ? <p className="mt-4 text-sm font-medium text-green-700">{successMessage}</p> : null}

      <div className="mt-6 grid gap-4">
        {items.length ? (
          items.map((item) => (
            <div key={item.id} className="rounded-[24px] border border-line bg-mist p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-ink">{item.name}</p>
                  <p className="mt-1 text-sm text-steel">
                    {item.price}
                    {item.size ? ` • ${item.size}` : ""}
                    {item.rentalType ? ` • ${item.rentalType}` : ""}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-steel">{item.slug}</p>
                </div>
                <div className="flex items-center gap-2">
                  {item.isFeatured ? <span className="rounded-full bg-sand px-3 py-1 text-xs font-semibold text-ink">Nổi bật</span> : null}
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink">{item.status}</span>
                  <button type="button" onClick={() => startEdit(item)} className="rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-ink">
                    Sửa
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(item)}
                    disabled={deletingId === item.id}
                    className="rounded-full border border-red-200 bg-white px-3 py-1 text-xs font-semibold text-red-600 disabled:opacity-60"
                  >
                    {deletingId === item.id ? "Đang xóa..." : "Xóa"}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-[24px] border border-dashed border-line bg-mist p-5 text-sm text-steel">
            Chưa có căn hộ nào trong dự án này.
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-4 xl:grid-cols-2">
        <div className="xl:col-span-2 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-steel">{editingSlug ? "Chỉnh sửa căn hộ" : "Tạo căn hộ mới"}</p>
            <p className="mt-1 text-sm text-steel">Căn hộ sẽ được gắn trực tiếp vào dự án này.</p>
          </div>
          <Link href={`/du-an/${projectSlug}`} className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink">
            Xem trang dự án
          </Link>
        </div>

        <label className={fieldClassName}>
          <span className={labelClassName}>Tên căn hộ</span>
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
            placeholder="Ví dụ: Căn 102"
            required
          />
        </label>
        <label className={fieldClassName}>
          <span className={labelClassName}>Slug</span>
          <input
            value={form.slug}
            onChange={(event) => {
              setSlugTouched(true);
              setForm((current) => ({ ...current, slug: slugify(event.target.value) }));
            }}
            className="h-12 rounded-full border border-line px-5 text-sm outline-none"
            placeholder="can-102"
            required
          />
        </label>
        <label className={fieldClassName}>
          <span className={labelClassName}>Địa chỉ</span>
          <input
            value={form.address}
            onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
            className="h-12 rounded-full border border-line px-5 text-sm outline-none"
            placeholder="Địa chỉ"
            required
          />
        </label>
        <label className={fieldClassName}>
          <span className={labelClassName}>Giá</span>
          <input
            value={form.price}
            onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
            className="h-12 rounded-full border border-line px-5 text-sm outline-none"
            placeholder="Giá bán hoặc giá thuê"
            required
          />
        </label>
        <label className={fieldClassName}>
          <span className={labelClassName}>Diện tích</span>
          <input
            value={form.size}
            onChange={(event) => setForm((current) => ({ ...current, size: event.target.value }))}
            className="h-12 rounded-full border border-line px-5 text-sm outline-none"
            placeholder="Diện tích"
          />
        </label>
        <label className={fieldClassName}>
          <span className={labelClassName}>Loại hình</span>
          <input
            value={form.rentalType}
            onChange={(event) => setForm((current) => ({ ...current, rentalType: event.target.value }))}
            className="h-12 rounded-full border border-line px-5 text-sm outline-none"
            placeholder="Căn hộ"
          />
        </label>
        <label className={fieldClassName}>
          <span className={labelClassName}>Hotline</span>
          <input
            value={form.hotline}
            onChange={(event) => setForm((current) => ({ ...current, hotline: event.target.value }))}
            className="h-12 rounded-full border border-line px-5 text-sm outline-none"
            placeholder="Hotline"
            required
          />
        </label>
        <label className="flex items-center gap-3 rounded-[20px] border border-line px-5 py-3 text-sm font-medium text-ink">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(event) => setForm((current) => ({ ...current, isFeatured: event.target.checked }))}
            className="h-4 w-4 rounded border-line"
          />
          Căn hộ nổi bật
        </label>
        <div className="xl:col-span-2">
          <ImageUploadField
            label="Ảnh đại diện"
            value={form.thumbnail}
            folder="apartments"
            description="Ảnh hiển thị cho căn hộ trong dashboard và trang dự án."
            onRemove={() => setForm((current) => ({ ...current, thumbnail: "" }))}
            onUploaded={(url) => setForm((current) => ({ ...current, thumbnail: url }))}
          />
        </div>
        <div className="xl:col-span-2">
          <RichTextEditor
            label="Mô tả"
            value={form.description}
            onChange={(value) => setForm((current) => ({ ...current, description: value }))}
            placeholder="Mô tả căn hộ"
          />
        </div>
        <div className="xl:col-span-2">
          <ImageUploadField
            label="Bộ ảnh căn hộ"
            value={form.gallery}
            folder="apartments"
            multiple
            description="Có thể chọn nhiều ảnh một lần."
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
        <button
          disabled={status === "submitting" || !projectLoaded}
          className="h-12 rounded-full bg-ink text-sm font-semibold text-white disabled:opacity-70 xl:col-span-2"
        >
          {status === "submitting" ? "Đang lưu..." : !projectLoaded ? "Đang tải dự án..." : editingSlug ? "Cập nhật căn hộ" : "Tạo căn hộ"}
        </button>
      </form>
    </section>
  );
}
