import { api } from "./api";
import type {
  CostBreakdown,
  NonLiquid,
  Product,
  ProductDetail,
  Token,
  User,
  WarehouseStock,
} from "../types";

export async function login(username: string, password: string): Promise<Token> {
  const form = new URLSearchParams();
  form.append("username", username);
  form.append("password", password);
  const { data } = await api.post<Token>("/auth/login", form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return data;
}

export async function register(
  username: string,
  email: string,
  password: string,
): Promise<User> {
  const { data } = await api.post<User>("/auth/register", {
    username,
    email,
    password,
  });
  return data;
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>("/auth/me");
  return data;
}

export async function getProducts(search?: string): Promise<Product[]> {
  const { data } = await api.get<Product[]>("/products", {
    params: search ? { search } : undefined,
  });
  return data;
}

export async function getProduct(id: number): Promise<ProductDetail> {
  const { data } = await api.get<ProductDetail>(`/products/${id}`);
  return data;
}

export async function getProductCost(id: number): Promise<CostBreakdown> {
  const { data } = await api.get<CostBreakdown>(`/products/${id}/cost`);
  return data;
}

export async function createProduct(
  payload: Partial<Product>,
): Promise<Product> {
  const { data } = await api.post<Product>("/products", payload);
  return data;
}

export async function getStocks(warehouseId?: string): Promise<WarehouseStock[]> {
  const { data } = await api.get<WarehouseStock[]>("/stocks", {
    params: warehouseId ? { warehouse_id: warehouseId } : undefined,
  });
  return data;
}

export async function getNonLiquid(): Promise<NonLiquid[]> {
  const { data } = await api.get<NonLiquid[]>("/non-liquid");
  return data;
}

export async function uploadNonLiquid(file: File): Promise<{
  total_rows: number;
  created: number;
  duplicates: number;
}> {
  const form = new FormData();
  form.append("file", file);
  const { data } = await api.post("/non-liquid/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function aiFindProduct(query: string): Promise<{ result: unknown }> {
  const { data } = await api.post("/ai/find-product", { query });
  return data;
}

export async function aiRecommendPrice(
  competitorPrices: number[],
  discountPercent = 7,
): Promise<{ result: { recommended_price: number } }> {
  const { data } = await api.post("/ai/recommend-price", {
    competitor_prices: competitorPrices,
    discount_percent: discountPercent,
  });
  return data;
}
