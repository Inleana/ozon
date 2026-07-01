import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../services/endpoints";
import ProductCard from "../components/ProductCard";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const { data: products, isLoading } = useQuery({
    queryKey: ["products", search],
    queryFn: () => getProducts(search || undefined),
  });

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Мои товары</h2>
        <input
          placeholder="Поиск по названию/артикулу"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-72 rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
        />
      </div>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500 dark:bg-gray-900">
            <tr>
              <th className="p-3">Фото</th>
              <th className="p-3">Название</th>
              <th className="p-3">Артикул</th>
              <th className="p-3">Цена</th>
              <th className="p-3">Статус</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-400">
                  Загрузка…
                </td>
              </tr>
            )}
            {!isLoading && !products?.length && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-400">
                  Товары не найдены
                </td>
              </tr>
            )}
            {products?.map((p) => (
              <tr
                key={p.id}
                onClick={() => setSelected(p.id)}
                className="cursor-pointer border-t border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900"
              >
                <td className="p-3">
                  {p.images?.[0] ? (
                    <img
                      src={p.images[0]}
                      alt=""
                      className="h-10 w-10 rounded object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded bg-gray-100 dark:bg-gray-800" />
                  )}
                </td>
                <td className="p-3">{p.name ?? "—"}</td>
                <td className="p-3">{p.article ?? "—"}</td>
                <td className="p-3">{p.price ? `${p.price} ₽` : "—"}</td>
                <td className="p-3">
                  <span className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected !== null && (
        <ProductCard productId={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
