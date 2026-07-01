import { useState } from "react";

export default function ImageGallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);

  if (!images.length) {
    return (
      <div className="flex h-48 items-center justify-center rounded bg-gray-100 text-gray-400 dark:bg-gray-800">
        Нет изображений
      </div>
    );
  }

  return (
    <div>
      <div
        className="mb-2 cursor-zoom-in overflow-hidden rounded bg-gray-100 dark:bg-gray-800"
        onClick={() => setZoom(true)}
      >
        <img
          src={images[active]}
          alt=""
          className="mx-auto h-64 object-contain"
        />
      </div>
      <div className="flex gap-2 overflow-x-auto">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-14 w-14 shrink-0 overflow-hidden rounded border ${
              i === active ? "border-brand" : "border-transparent"
            }`}
          >
            <img src={src} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
      {zoom && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          onClick={() => setZoom(false)}
        >
          <img
            src={images[active]}
            alt=""
            className="max-h-full max-w-full object-contain"
          />
        </div>
      )}
    </div>
  );
}
