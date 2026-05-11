"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { formatAreaValue } from "@/lib/format-area";
import type { Project } from "@/types";

const PAGE_SIZE = 5;

type ApartmentItem = NonNullable<Project["apartments"]>[number];

export function ProjectApartmentList({ apartments }: { apartments: ApartmentItem[] }) {
  const [soldOnly, setSoldOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredApartments = useMemo(
    () => apartments.filter((apartment) => (soldOnly ? apartment.isSold : true)),
    [apartments, soldOnly]
  );

  const totalPages = Math.max(1, Math.ceil(filteredApartments.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const visibleApartments = filteredApartments.slice(startIndex, startIndex + PAGE_SIZE);

  function handleToggleSoldOnly(checked: boolean) {
    setSoldOnly(checked);
    setCurrentPage(1);
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
  }

  return (
    <div className="mt-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-steel">
          Hiển thị {visibleApartments.length ? startIndex + 1 : 0}-{Math.min(startIndex + PAGE_SIZE, filteredApartments.length)} /{" "}
          {filteredApartments.length} căn
        </p>
        <label className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink">
          <input
            type="checkbox"
            checked={soldOnly}
            onChange={(event) => handleToggleSoldOnly(event.target.checked)}
            className="h-4 w-4 accent-[#8f2d1f]"
          />
          Chỉ hiện căn đã bán
        </label>
      </div>

      {visibleApartments.length ? (
        <>
          <div className="mt-4 grid gap-3">
            {visibleApartments.map((apartment) => (
              <Link
                key={apartment.id}
                href={`/can-ho/${apartment.slug}`}
                className="content-lift rounded-[20px] border border-line bg-mist/70 p-4 transition hover:border-ink/20 hover:bg-mist"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[1.7rem] font-semibold leading-none text-ink">{apartment.name}</p>
                      {apartment.isSold ? (
                        <span className="rounded-full bg-red-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-red-700">
                          Đã bán
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm text-steel">{apartment.rentalType ?? "Căn hộ"}</p>
                  </div>
                  <span className="inline-flex w-fit rounded-full border border-ink px-3.5 py-1.5 text-sm font-semibold text-ink">
                    Xem chi tiết
                  </span>
                </div>
                <div className="mt-4 grid gap-3 border-t border-line/80 pt-3 sm:grid-cols-2">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-steel">Giá</p>
                    <p className="mt-1 text-[1.05rem] font-semibold leading-6 text-ink">{apartment.price}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-steel">Diện tích</p>
                    <p className="mt-1 text-[1.05rem] font-semibold leading-6 text-ink">
                      {formatAreaValue(apartment.size ?? "Đang cập nhật")}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 ? (
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => {
                const isActive = page === safePage;

                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handlePageChange(page)}
                    className={
                      isActive
                        ? "rounded-full border border-ink bg-ink px-4 py-2 text-sm font-semibold text-white"
                        : "rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-ink/30"
                    }
                  >
                    {page}
                  </button>
                );
              })}
            </div>
          ) : null}
        </>
      ) : (
        <p className="mt-4 text-sm leading-7 text-steel">Không có căn hộ nào phù hợp với bộ lọc hiện tại.</p>
      )}
    </div>
  );
}
