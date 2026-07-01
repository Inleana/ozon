import type { CostBreakdown } from "../types";

const rows: { key: keyof CostBreakdown; label: string }[] = [
  { key: "commission", label: "Комиссия (12%)" },
  { key: "acquiring", label: "Эквайринг (2%)" },
  { key: "logistics", label: "Логистика" },
  { key: "drop_pvz", label: "Дроп/ПВЗ" },
  { key: "fbs", label: "FBS" },
  { key: "fbo", label: "FBO" },
];

export default function PriceCalculator({ cost }: { cost: CostBreakdown }) {
  return (
    <div className="rounded border border-gray-200 p-3 text-sm dark:border-gray-700">
      <h4 className="mb-2 font-semibold">Расчёт стоимости</h4>
      <div className="flex justify-between py-1">
        <span>Цена</span>
        <span>{cost.price.toFixed(2)} ₽</span>
      </div>
      {rows.map((r) => (
        <div key={r.key} className="flex justify-between py-1 text-gray-600 dark:text-gray-400">
          <span>{r.label}</span>
          <span>{Number(cost[r.key]).toFixed(2)} ₽</span>
        </div>
      ))}
      <div className="mt-2 flex justify-between border-t border-gray-200 pt-2 font-semibold dark:border-gray-700">
        <span>Итого расходы</span>
        <span>{cost.total.toFixed(2)} ₽</span>
      </div>
      <div className="flex justify-between py-1 font-semibold text-green-600">
        <span>Чистая прибыль</span>
        <span>{cost.net_profit.toFixed(2)} ₽</span>
      </div>
    </div>
  );
}
