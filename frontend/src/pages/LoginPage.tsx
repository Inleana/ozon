import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { register as apiRegister } from "../services/endpoints";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === "register") {
        await apiRegister(username, email, password);
      }
      await login(username, password);
      navigate("/");
    } catch {
      setError("Не удалось войти. Проверьте данные.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg bg-white p-6 shadow dark:bg-gray-800"
      >
        <h1 className="mb-4 text-center text-2xl font-bold text-brand">
          Ozonak.online
        </h1>
        <input
          className="mb-3 w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
          placeholder="Логин"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        {mode === "register" && (
          <input
            className="mb-3 w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        )}
        <input
          className="mb-3 w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded bg-brand py-2 text-white hover:bg-brand-dark disabled:opacity-50"
        >
          {mode === "login" ? "Войти" : "Зарегистрироваться"}
        </button>
        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="mt-3 w-full text-sm text-gray-500 hover:text-brand"
        >
          {mode === "login"
            ? "Нет аккаунта? Регистрация"
            : "Уже есть аккаунт? Войти"}
        </button>
      </form>
    </div>
  );
}
