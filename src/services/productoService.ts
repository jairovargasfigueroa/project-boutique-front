import { Producto, ProductoVariante } from '@/types/productos';
import { apiClient } from './apiBase';
// asegúrate que esta ruta sea correcta

const ENDPOINT = '/productos/';
const VARIANTE_ENDPOINT = '/variantes/';

export const productoService = {
  getAll: async () => {
    const response = await apiClient.get<Producto[]>(ENDPOINT);
    return response.data;
  },

  getByCategory: async (categoria: string) => {
    const response = await apiClient.get<Producto[]>(ENDPOINT, {
      params: { categoria },
    });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<Producto>(`${ENDPOINT}${id}`);
    return response.data;
  },

  search: async (query: string) => {
    const response = await apiClient.get<Producto[]>(ENDPOINT, {
      params: { search: query },
    });
    return response.data;
  },

  create: async (producto: Producto) => {
    const response = await apiClient.post<Producto>(ENDPOINT, producto);
    return response.data;
  },

  update: async (id: number, producto: Producto) => {
    const response = await apiClient.put<Producto>(`${ENDPOINT}${id}/`, producto);
    return response.data;
  },

  delete: async (id: number) => {
    await apiClient.delete(`${ENDPOINT}${id}/`);
  },

  updateStock: async (id: number, stock: number) => {
    const response = await apiClient.put<Producto>(`${ENDPOINT}${id}/stock`, { stock });
    return response.data;
  },

  toggleActive: async (id: number) => {
    const response = await apiClient.put<Producto>(`${ENDPOINT}${id}/toggle`);
    return response.data;
  },

  getLowStock: async (minStock: number = 10) => {
    const response = await apiClient.get<Producto[]>(ENDPOINT, {
      params: { stockMin: minStock },
    });
    return response.data;
  },

  getFeatured: async () => {
    const response = await apiClient.get<Producto[]>(`${ENDPOINT}destacados`);
    return response.data;
  },

  // Obtener variantes de un producto específico
  getVariantesByProducto: async (productoId: number) => {
    const response = await apiClient.get<ProductoVariante[]>(`${ENDPOINT}${productoId}/variantes`);
    return response.data;
  },
};
