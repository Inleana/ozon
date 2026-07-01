import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getNonLiquid, uploadNonLiquid } from "../services/endpoints";
import FileUploader from "../components/FileUploader";
import { useState } from "react";

export default function NonLiquidPage() {
  const queryClient = useQueryClient();
  const [result, setResult] = useState<string | null>(null);
  const { data: items, isLoading } = useQuery({
    queryKey: ["non-liquid"],
    queryFn: getNonLiquid,
  });

  async function handleUpload(file: File) {
    const res = await uploadNonLiquid(file);
    setResult(
      `Обработано ${res.total_rows}, добавлено ${res.created}, дубликатов ${res.duplicates}`,
    );
    await queryClient.invalidateQueries({ queryKey: ["non-liquid"] });
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Неликвид</h2>
        <FileUploader
          accept=".xlsx,.xlsm"
          onUpload={handleUpload}
          label="Загрузить Excel"
        />
      </div>
      {result && (
        <p className="mb-4 rounded bg-green-50 p-3 text-sm dark:bg-green-950">
          {result}
        </p>
      )}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500 dark:bg-gray-900">
            <tr>
              <th className="p-3">OEM</th>
              <th className="p-3">Артикул</th>
              <th className="p-3">Название</th>
              <th className="p-3">Бренд</th>
              <th className="p-3">Проверен</th>
              <th className="p-3">Загружен</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-400">
                  Загрузка…
                </td>
              </tr>
            )}
            {!isLoading && !items?.length && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-400">
                  Загрузите Excel-файл с номенклатурой
                </td>
              </tr>
            )}
            {items?.map((it) => (
              <tr key={it.id} className="border-t border-gray-100 dark:border-gray-800">
                <td className="p-3">{it.oem_number ?? "—"}</td>
                <td className="p-3">{it.article ?? "—"}</td>
                <td className="p-3">{it.name ?? "—"}</td>
                <td className="p-3">{it.brand ?? "—"}</td>
                <td className="p-3">{it.is_checked ? "✓" : "—"}</td>
                <td className="p-3">{it.is_uploaded ? "✓" : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
