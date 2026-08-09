"use client";

import { useState } from "react";

type GalleryImage = {
  id: string;
  url: string;
  altText?: string | null;
};

type ProductGalleryProps = {
  images: GalleryImage[];
  productName: string;
};

export default function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] =
    useState<GalleryImage | null>(images[0] ?? null);

  if (!selectedImage) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-[28px] border border-stone-200 bg-white p-8 shadow-sm">
        <div className="text-center">
          <svg
            viewBox="0 0 120 120"
            fill="none"
            className="mx-auto h-24 w-28 text-black/20"
            aria-hidden="true"
          >
            <rect
              x="27"
              y="17"
              width="66"
              height="82"
              rx="13"
              stroke="currentColor"
              strokeWidth="4"
            />

            <rect
              x="37"
              y="28"
              width="46"
              height="21"
              rx="6"
              stroke="currentColor"
              strokeWidth="3"
            />

            <path
              d="M43 63H77"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />

            <path
              d="M60 64V79"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />

            <path
              d="M45 88H75"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>

          <p className="mt-4 text-sm text-black/45">
            لا تتوفر صورة حاليًا
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="group flex h-[460px] items-center justify-center rounded-[28px] border border-stone-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:h-[520px]">
        <img
 key={selectedImage.id}
          src={selectedImage.url}
          alt={selectedImage.altText ?? productName}
          className="h-auto max-h-[88%] w-auto max-w-[88%] animate-[fadeIn_.25s_ease] object-contain transition-transform duration-500 group-hover:scale-[1.06]"
        />
      </div>

      {images.length > 1 ? (
        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.slice(0, 5).map((image) => {
            const isSelected =
              image.id === selectedImage.id;

            return (
              <button
                key={image.id}
                type="button"
                onClick={() => setSelectedImage(image)}
                aria-label={`عرض صورة ${productName}`}
                className={`group flex aspect-square items-center justify-center overflow-hidden rounded-3xl border bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  isSelected
                    ? "border-[#C85A1A] ring-2 ring-orange-200 shadow-md"
                    : "border-stone-200 hover:border-orange-300"
                }`}
              >
                <img
                  src={image.url}
                  alt={image.altText ?? productName}
                  className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}