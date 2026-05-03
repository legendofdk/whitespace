"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { fetchAdminApi } from "./admin-api";

type Item = { id: string; title: string; slug: string; category: string; status: string; publishedAt?: string | null };

export function PostList() {
  const [items, setItems] = useState<Item[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  async function loadItems() {
    setErrorMessage("");
    try {
      const response = await fetchAdminApi("/api/posts");
      if (!response.ok) throw new Error("LOAD_FAILED");
      const data = (await response.json()) as { items: Item[] };
      setItems(data.items);
    } catch {
      setErrorMessage("Chưa thể tải danh sách bài viết từ backend.");
    }
  }
  useEffect(() => { void loadItems(); }, []);
  return (
    <main className="py-4">
      <div className="rounded-[28px] border border-line bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div><p className="text-sm font-semibold uppercase tracking-[0.22em] text-steel">Danh sách tin tức</p><h1 className="mt-2 font-display text-4xl text-ink">Quản lý bài viết</h1></div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => void loadItems()} className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink">Tải lại</button>
            <Link href="/dashboard/posts/new" className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">Tạo mới</Link>
          </div>
        </div>
        {errorMessage ? <p className="mt-4 text-sm font-medium text-red-600">{errorMessage}</p> : null}
        <div className="mt-6 grid gap-4">
          {items.map((item) => (
            <Link key={item.id} href={`/dashboard/posts/${item.slug}`} className="block rounded-[24px] border border-line bg-mist p-5 transition hover:-translate-y-0.5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                  <p className="mt-1 text-sm text-steel">{item.category}{item.publishedAt ? ` • ${new Date(item.publishedAt).toLocaleDateString("vi-VN")}` : ""}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-steel">{item.slug}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink">{item.status}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
