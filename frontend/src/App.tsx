import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { useAuth } from "./hooks/useAuth";
import type { ReactNode } from "react";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import ProductsPage from "./pages/ProductsPage";
import StocksPage from "./pages/StocksPage";
import NonLiquidPage from "./pages/NonLiquidPage";
import CreateProductPage from "./pages/CreateProductPage";
import SettingsPage from "./pages/SettingsPage";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="p-8 text-center text-gray-500">Загрузка…</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="stocks" element={<StocksPage />} />
        <Route path="non-liquid" element={<NonLiquidPage />} />
        <Route path="create" element={<CreateProductPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
