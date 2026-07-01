import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  aiFindProduct,
  aiRecommendPrice,
  createProduct,
} from "../services/endpoints";

export default function CreateProductPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [name, setName] = useState("");
  const [article, setArticle] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [recommended, setRecommended] = useState<number | null>(null);
  const [aiBusy, setAiBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAiSearch() {
    if (!query) return;
    setAiBusy(true);
    setError(null);
    try {
      const { result } = await aiFindProduct(query);
      const r = result as Record<string, unknown>;
      if (typeof r.name === "string") setName(r.name);
      if (typeof r.brand === "string") setBrand(r.brand);
      if (typeof r.description === "string") setDescription(r.description);
      if (!article) setArticle(query);
    } catch {
      setError("AI-поиск недоступен (проверьте DEEPSEEK_API_KEY)");
    } finally {
      setAiBusy(false);
    }
  }

  async function handleRecommend() {
    try {
      const { result } = await aiRecommendPrice([1000, 1200, 1100], 7);
      setRecommended(result.recommended_price);
    } catch {
      setError("Не удалось рассчитать рекомендованную цену");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await createProduct({
        name,
        article,
        brand,
        description,
        price: price ? Number(price) : null,
      });
      navigate("/products");
    } catch {
      setError("Не удалось сохранить карточку");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h2 className="mb-4 text-2xl font-bold">Создание карточки</h2>

      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
        <label className="mb-1 block text-sm font-medium">
          AI-поиск (название / артикул)
        </label>
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Например: 04152-YZZA6"
            className="flex-1 rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
          />
          <button
            onClick={handleAiSearch}
            disabled={aiBusy}
            className="rounded bg-brand px-4 py-2 text-white hover:bg-brand-dark disabled:opacity-50"
          >
            {aiBusy ? "Поиск…" : "Найти через AI"}
          </button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950"
      >
        <Field label="Название" value={name} onChange={setName} />
        <Field label="Артикул" value={article} onChange={setArticle} />
        <Field label="Бренд" value={brand} onChange={setBrand} />
        <div>
          <label className="mb-1 block text-sm font-medium">Описание</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
          />
        </div>
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Field label="Цена, ₽" value={price} onChange={setPrice} type="number" />
          </div>
          <button
            type="button"
            onClick={handleRecommend}
            className="rounded bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200 dark:bg-gray-800"
          >
            Рекомендовать цену
          </button>
        </div>
        {recommended !== null && (
          <p className="text-sm text-green-600">
            Рекомендуемая цена: <b>{recommended} ₽</b>
          </p>
        )}
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded bg-brand py-2 text-white hover:bg-brand-dark disabled:opacity-50"
        >
          {saving ? "Сохранение…" : "Опубликовать"}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
      />
    </div>
  );
}
