import { Categoria } from "@/types/productos";
import { apiClient } from "./apiBase";

const ENDPOINT = "/categorias/";

export const categoriaService = {
  getAll: async () => {
    const response = await apiClient.get<Categoria[]>(ENDPOINT);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<Categoria>(`${ENDPOINT}${id}`);
    return response.data;
  },

  create: async (categoria: Omit<Categoria, 'id'>) => {
    const response = await apiClient.post<Categoria>(ENDPOINT, categoria);
    return response.data;
  },

  update: async (id: number, categoria: Partial<Categoria>) => {
    const response = await apiClient.put<Categoria>(
      `${ENDPOINT}${id}/`,
      categoria
    );
    return response.data;
  },

  delete: async (id: number) => {
    await apiClient.delete(`${ENDPOINT}${id}/`);
  },
};
