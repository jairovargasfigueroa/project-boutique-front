import { ProductoVariante } from "@/types/productos";
import { apiClient } from "./apiBase";

const ENDPOINT = "/producto-variante/";

export const varianteService = {
  getAll: async () => {
    const response = await apiClient.get<ProductoVariante[]>(ENDPOINT);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<ProductoVariante>(`${ENDPOINT}${id}`);
    return response.data;
  },

  create: async (productoVariante: ProductoVariante) => {
    console.log("Creating variante:", productoVariante);
    const response = await apiClient.post<ProductoVariante>(
      ENDPOINT,
      productoVariante
    );
    return response.data;
  },

  update: async (id: number, productoVariante: ProductoVariante) => {
    console.log("Updating variante:", id, productoVariante);
    const response = await apiClient.put<ProductoVariante>(
      `${ENDPOINT}${id}/`,
      productoVariante
    );
    return response.data;
  },

  delete: async (id: number) => {
    await apiClient.delete(`${ENDPOINT}${id}/`);
  },

  updateStock: async (id: number, stock: number) => {
    const response = await apiClient.put<ProductoVariante>(
      `${ENDPOINT}${id}/stock`,
      { stock }
    );
    return response.data;
  },
  search: async (query: string) => {
    const response = await apiClient.get<ProductoVariante[]>(ENDPOINT, {
      params: { search: query },
    });
    return response.data;
  },

  toggleActive: async (id: number) => {
    const response = await apiClient.put<ProductoVariante>(
      `${ENDPOINT}${id}/toggle`
    );
    return response.data;
  },

  getLowStock: async (minStock: number = 10) => {
    const response = await apiClient.get<ProductoVariante[]>(ENDPOINT, {
      params: { stockMin: minStock },
    });
    return response.data;
  },

  getFeatured: async () => {
    const response = await apiClient.get<ProductoVariante[]>(
      `${ENDPOINT}destacados`
    );
    return response.data;
  },
};
