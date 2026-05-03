"use client";

import Image from "next/image";
import { useState } from "react";

type DetailGalleryProps = {
  title: string;
  images: string[];
};

export function DetailGallery({ title, images }: DetailGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  if (!images.length) {
    return null;
  }

  const currentImage = images[activeIndex] ?? images[0];

  const goToPrevious = () => {
    setActiveIndex((current) => (current === 0 ? images.length - 1 : current - 1));
  };

  const goToNext = () => {
    setActiveIndex((current) => (current === images.length - 1 ? 0 : current + 1));
  };

  return (
    <>
      <div className="rounded-[32px] border border-line p-8">
        <h2 className="font-display text-4xl text-ink">Hình ảnh</h2>

        <div className="mt-6">
          <div className="relative overflow-hidden rounded-[28px]">
            <button
              type="button"
              onClick={() => setActiveImage(currentImage)}
              className="relative block h-64 w-full overflow-hidden bg-mist text-left sm:h-80"
            >
              <Image src={currentImage} alt={title} fill className="object-cover" />
            </button>

            {images.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={goToPrevious}
                  aria-label="Ảnh trước"
                  className="absolute left-4 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/30 text-xl text-white backdrop-blur transition hover:bg-black/45"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={goToNext}
                  aria-label="Ảnh sau"
                  className="absolute right-4 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/30 text-xl text-white backdrop-blur transition hover:bg-black/45"
                >
                  ›
                </button>
                <div className="absolute bottom-4 right-4 rounded-full bg-black/45 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                  {activeIndex + 1}/{images.length}
                </div>
              </>
            ) : null}
          </div>

          {images.length > 1 ? (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`relative h-20 overflow-hidden rounded-[20px] border transition ${
                    index === activeIndex
                      ? "border-ink shadow-[0_8px_20px_rgba(8,18,37,0.14)]"
                      : "border-line opacity-75 hover:opacity-100"
                  }`}
                >
                  <Image src={image} alt={`${title} ${index + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          ) : null}
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
