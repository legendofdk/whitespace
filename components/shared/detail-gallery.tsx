"use client";

import Image from "next/image";
import { useState } from "react";

type DetailGalleryProps = {
  title: string;
  images: string[];
};

export function DetailGallery({ title, images }: DetailGalleryProps) {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  if (!images.length) {
    return null;
  }

  return (
    <>
      <div className="rounded-[32px] border border-line p-8">
        <h2 className="font-display text-4xl text-ink">Hình ảnh</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {images.map((image) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveImage(image)}
              className="relative h-44 overflow-hidden rounded-[24px] text-left transition hover:scale-[1.02]"
            >
              <Image src={image} alt={title} fill className="object-cover" />
            </button>
          ))}
        </div>
      </div>

      {activeImage ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setActiveImage(null)}
        >
          <button
            type="button"
            aria-label="Close image"
            onClick={() => setActiveImage(null)}
            className="absolute right-5 top-5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white"
          >
            Đóng
          </button>
          <div
            className="relative h-[75vh] w-full max-w-6xl overflow-hidden rounded-[28px]"
            onClick={(event) => event.stopPropagation()}
          >
            <Image src={activeImage} alt={title} fill className="object-contain" />
          </div>
        </div>
      ) : null}
    </>
  );
}
