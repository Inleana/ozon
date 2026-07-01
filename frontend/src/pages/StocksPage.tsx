import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getStocks } from "../services/endpoints";

export default function StocksPage() {
  const [warehouse, setWarehouse] = useState("");
  const { data: stocks, isLoading } = useQuery({
    queryKey: ["stocks", warehouse],
    queryFn: () => getStocks(warehouse || undefined),
  });

  const warehouses = Array.from(
    new Set((stocks ?? []).map((s) => s.warehouse_name).filter(Boolean)),
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Остатки на складах Ozon</h2>
        <select
          value={warehouse}
          onChange={(e) => setWarehouse(e.target.value)}
          className="rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
        >
          <option value="">Все склады</option>
          {warehouses.map((w) => (
            <option key={w} value={w!}>
              {w}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500 dark:bg-gray-900">
            <tr>
              <th className="p-3">Склад</th>
              <th className="p-3">Товар (ID)</th>
              <th className="p-3">Всего</th>
              <th className="p-3">Резерв</th>
              <th className="p-3">Доступно</th>
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
            {!isLoading && !stocks?.length && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-400">
                  Нет данных об остатках
                </td>
              </tr>
            )}
            {stocks?.map((s) => (
              <tr key={s.id} className="border-t border-gray-100 dark:border-gray-800">
                <td className="p-3">{s.warehouse_name ?? "—"}</td>
                <td className="p-3">{s.product_id}</td>
                <td className="p-3">{s.quantity}</td>
                <td className="p-3">{s.reserved}</td>
                <td className="p-3 font-semibold">{s.available}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
