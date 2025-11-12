import { 
  ProductoVariante, 
  VarianteProductoCreate, 
  VarianteProductoUpdate 
} from "@/types/productos";
import { apiClient } from "./apiBase";

const ENDPOINT = "/producto-variante/";

export const varianteService = {
  getAll: async () => {
    const response = await apiClient.get<ProductoVariante[]>(ENDPOINT);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<ProductoVariante>(`${ENDPOINT}${id}/`);
    return response.data;
  },

  create: async (data: VarianteProductoCreate) => {
    console.log("Creando variante:", data);
    const response = await apiClient.post<ProductoVariante>(ENDPOINT, data);
    console.log("✅ Respuesta API crear variante:", response.data);
    return response.data;
  },

  update: async (id: number, data: VarianteProductoUpdate) => {
    console.log("Actualizando variante:", id, data);
    const response = await apiClient.put<ProductoVariante>(
      `${ENDPOINT}${id}/`,
      data
    );
    return response.data;
  },

  patch: async (id: number, data: Partial<VarianteProductoUpdate>) => {
    console.log("Actualizando parcialmente variante:", id, data);
    const response = await apiClient.patch<ProductoVariante>(
      `${ENDPOINT}${id}/`,
      data
    );
    return response.data;
  },

  delete: async (id: number) => {
    await apiClient.delete(`${ENDPOINT}${id}/`);
  },

  // Actualizar solo el stock
  updateStock: async (id: number, stock: number) => {
    const response = await apiClient.patch<ProductoVariante>(
      `${ENDPOINT}${id}/`,
      { stock }
    );
    return response.data;
  },

  // Filtrar variantes con stock bajo
  getLowStock: async () => {
    const response = await apiClient.get<ProductoVariante[]>(ENDPOINT);
    // Filtrar en el cliente las que tienen stock bajo
    return response.data.filter(v => v.stock_bajo);
  },

  // Filtrar variantes sin stock
  getOutOfStock: async () => {
    const response = await apiClient.get<ProductoVariante[]>(ENDPOINT);
    return response.data.filter(v => v.stock === 0);
  },
};
