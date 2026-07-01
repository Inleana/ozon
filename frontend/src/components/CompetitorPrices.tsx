import type { CompetitorPrice } from "../types";

export default function CompetitorPrices({
  prices,
}: {
  prices: CompetitorPrice[];
}) {
  if (!prices.length) {
    return (
      <p className="text-sm text-gray-400">Данные о ценах конкурентов отсутствуют</p>
    );
  }
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-gray-500">
          <th className="py-1">Площадка</th>
          <th className="py-1">Цена</th>
          <th className="py-1">Ссылка</th>
        </tr>
      </thead>
      <tbody>
        {prices.map((p) => (
          <tr key={p.id} className="border-t border-gray-100 dark:border-gray-800">
            <td className="py-1 capitalize">{p.marketplace}</td>
            <td className="py-1">{p.price ? `${p.price} ₽` : "—"}</td>
            <td className="py-1">
              {p.url ? (
                <a href={p.url} target="_blank" rel="noreferrer" className="text-brand">
                  открыть
                </a>
              ) : (
                "—"
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
