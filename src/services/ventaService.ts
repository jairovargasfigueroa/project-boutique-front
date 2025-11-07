import { apiClient } from './apiBase';
import { CrearVentaData, Venta } from '@/types/ventas';

const ENDPOINT = '/ventas/';

export const ventaService = {
  crear: async (data: CrearVentaData) => {
    const response = await apiClient.post<Venta>(`${ENDPOINT}crear/`, data);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<Venta>(`${ENDPOINT}${id}/`);
    return response.data;
  },

  getAll: async () => {
    const response = await apiClient.get<Venta[]>(ENDPOINT);
    return response.data;
  }
};
