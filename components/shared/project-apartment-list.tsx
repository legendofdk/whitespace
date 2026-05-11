"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { formatAreaValue } from "@/lib/format-area";
import type { Project } from "@/types";

const PAGE_SIZE = 5;

type ApartmentItem = NonNullable<Project["apartments"]>[number];

export function ProjectApartmentList({ apartments }: { apartments: ApartmentItem[] }) {
  const [availableOnly, setAvailableOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredApartments = useMemo(
    () => apartments.filter((apartment) => (availableOnly ? !apartment.isSold : true)),
    [apartments, availableOnly]
  );

  const totalPages = Math.max(1, Math.ceil(filteredApartments.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const visibleApartments = filteredApartments.slice(startIndex, startIndex + PAGE_SIZE);

  function handleToggleAvailableOnly(checked: boolean) {
    setAvailableOnly(checked);
    setCurrentPage(1);
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
  }

  return (
    <div className="mt-4">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] text-steel">
          Hiển thị {visibleApartments.length ? startIndex + 1 : 0}-{Math.min(startIndex + PAGE_SIZE, filteredApartments.length)} /{" "}
          {filteredApartments.length} căn
        </p>
        <label className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 text-[13px] font-medium text-ink">
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(event) => handleToggleAvailableOnly(event.target.checked)}
            className="h-4 w-4 accent-[#8f2d1f]"
          />
          Chỉ hiện căn chưa bán
        </label>
      </div>

      {visibleApartments.length ? (
        <>
          <div className="mt-3 grid gap-2.5">
            {visibleApartments.map((apartment) => (
              <Link
                key={apartment.id}
                href={`/can-ho/${apartment.slug}`}
                className="content-lift rounded-[18px] border border-line bg-mist/70 p-3.5 transition hover:border-ink/20 hover:bg-mist"
              >
                <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[1.45rem] font-semibold leading-none text-ink">{apartment.name}</p>
                      {apartment.isSold ? (
                        <span className="rounded-full bg-red-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-red-700">
                          Đã bán
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-0.5 text-[13px] text-steel">{apartment.rentalType ?? "Căn hộ"}</p>
                  </div>
                  <span className="inline-flex w-fit rounded-full border border-ink px-3 py-1.5 text-[13px] font-semibold text-ink">
                    Xem chi tiết
                  </span>
                </div>
                <div className="mt-3 grid gap-2.5 border-t border-line/80 pt-2.5 sm:grid-cols-2">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-steel">Giá</p>
                    <p className="mt-0.5 text-[1rem] font-semibold leading-5 text-ink">{apartment.price}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-steel">Diện tích</p>
                    <p className="mt-0.5 text-[1rem] font-semibold leading-5 text-ink">
                      {formatAreaValue(apartment.size ?? "Đang cập nhật")}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 ? (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => {
                const isActive = page === safePage;

                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handlePageChange(page)}
                    className={
                      isActive
                        ? "rounded-full border border-ink bg-ink px-3.5 py-1.5 text-[13px] font-semibold text-white"
                        : "rounded-full border border-line bg-white px-3.5 py-1.5 text-[13px] font-semibold text-ink transition hover:border-ink/30"
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
