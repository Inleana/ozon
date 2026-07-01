import { useQuery } from "@tanstack/react-query";
import { getProducts, getStocks } from "../services/endpoints";

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });
  const { data: stocks } = useQuery({
    queryKey: ["stocks"],
    queryFn: () => getStocks(),
  });

  const totalAvailable = (stocks ?? []).reduce((s, x) => s + x.available, 0);
  const active = (products ?? []).filter((p) => p.status === "active").length;

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Дашборд</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Всего товаров" value={products?.length ?? 0} />
        <StatCard label="Активных" value={active} />
        <StatCard label="Позиций на складах" value={stocks?.length ?? 0} />
        <StatCard label="Доступно к продаже" value={totalAvailable} />
      </div>
    </div>
  );
}
