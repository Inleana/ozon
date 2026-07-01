import { useQuery } from "@tanstack/react-query";
import { getProduct, getProductCost } from "../services/endpoints";
import ImageGallery from "./ImageGallery";
import PriceCalculator from "./PriceCalculator";
import CompetitorPrices from "./CompetitorPrices";

export default function ProductCard({
  productId,
  onClose,
}: {
  productId: number;
  onClose: () => void;
}) {
  const { data: product } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProduct(productId),
  });
  const { data: cost } = useQuery({
    queryKey: ["product-cost", productId],
    queryFn: () => getProductCost(productId),
    enabled: !!product?.price,
  });

  return (
    <div
      className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black/50 p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        {!product ? (
          <p className="text-gray-500">Загрузка…</p>
        ) : (
          <>
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold">{product.name ?? "Без названия"}</h2>
                <p className="text-sm text-gray-500">
                  Артикул: {product.article ?? "—"} · OEM: {product.oem_number ?? "—"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded px-2 text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <ImageGallery images={product.images ?? []} />
              <div className="space-y-4">
                <div>
                  <h4 className="mb-1 font-semibold">Описание</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {product.description ?? "—"}
                  </p>
                </div>
                <div>
                  <h4 className="mb-1 font-semibold">Цены конкурентов</h4>
                  <CompetitorPrices prices={product.competitor_prices} />
                </div>
                {cost && <PriceCalculator cost={cost} />}
                {product.recommended_price && (
                  <div className="rounded bg-green-50 p-3 text-sm dark:bg-green-950">
                    Рекомендуемая цена (AI):{" "}
                    <b>{product.recommended_price} ₽</b>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
