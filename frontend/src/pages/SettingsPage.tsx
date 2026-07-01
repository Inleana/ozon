import { useAuth } from "../hooks/useAuth";

export default function SettingsPage() {
  const { user } = useAuth();
  return (
    <div className="max-w-xl">
      <h2 className="mb-4 text-2xl font-bold">Настройки</h2>
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4 text-sm dark:border-gray-800 dark:bg-gray-950">
        <Row label="Логин" value={user?.username ?? "—"} />
        <Row label="Email" value={user?.email ?? "—"} />
        <Row label="Роль" value={user?.role ?? "—"} />
        <Row
          label="Ozon Client ID"
          value={user?.ozon_client_id ?? "не задан"}
        />
        <p className="pt-2 text-gray-500">
          Ключи Ozon и DeepSeek настраиваются через переменные окружения (.env)
          на сервере.
        </p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-gray-100 pb-2 dark:border-gray-800">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
