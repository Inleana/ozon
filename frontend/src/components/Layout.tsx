import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const nav = [
  { to: "/", label: "Дашборд", end: true },
  { to: "/products", label: "Мои товары" },
  { to: "/stocks", label: "Остатки на складах" },
  { to: "/non-liquid", label: "Неликвид" },
  { to: "/create", label: "Создание карточки" },
  { to: "/settings", label: "Настройки" },
];

export default function Layout() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 dark:border-gray-800 dark:bg-gray-950">
        <h1 className="text-lg font-bold text-brand">Ozonak.online</h1>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-500">{user?.username}</span>
          <button
            onClick={logout}
            className="rounded bg-gray-100 px-3 py-1 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            Выйти
          </button>
        </div>
      </header>
      <div className="flex">
        <aside className="min-h-[calc(100vh-52px)] w-56 border-r border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-950">
          <nav className="flex flex-col gap-1">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded px-3 py-2 text-sm ${
                    isActive
                      ? "bg-brand text-white"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
