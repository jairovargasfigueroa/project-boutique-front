import { apiClient } from './apiBase';
import { CrearPagoData, Pago } from '@/types/pagos';

const ENDPOINT = '/pagos/';

export const pagoService = {
  crear: async (data: CrearPagoData) => {
    const response = await apiClient.post<Pago>(ENDPOINT, data);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<Pago>(`${ENDPOINT}${id}/`);
    return response.data;
  },

  getByVenta: async (ventaId: number) => {
    const response = await apiClient.get<Pago[]>(`${ENDPOINT}?venta=${ventaId}`);
    return response.data;
  }
};
