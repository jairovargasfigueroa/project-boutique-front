import { Venta, DetalleVenta, Pago, CrearVentaRequest } from "@/types/ventas";
import { apiClient } from "./apiBase";

const ENDPOINT = "/ventas/";

export const ventaService = {
  getAll: async () => {
    const response = await apiClient.get<Venta[]>(ENDPOINT);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<Venta>(`${ENDPOINT}${id}/`);
    return response.data;
  },

  create: async (venta: CrearVentaRequest) => {
    const response = await apiClient.post<Venta>(ENDPOINT, venta);
    return response.data;
  },

  update: async (id: number, venta: Partial<Venta>) => {
    const response = await apiClient.put<Venta>(`${ENDPOINT}${id}/`, venta);
    return response.data;
  },

  delete: async (id: number) => {
    await apiClient.delete(`${ENDPOINT}${id}/`);
  },

  getDetalles: async (ventaId: number) => {
    const response = await apiClient.get<DetalleVenta[]>(
      `${ENDPOINT}${ventaId}/detalles/`
    );
    return response.data;
  },

  getPagos: async (ventaId: number) => {
    const response = await apiClient.get<Pago[]>(
      `${ENDPOINT}${ventaId}/pagos/`
    );
    return response.data;
  },

  registrarPago: async (ventaId: number, pago: Omit<Pago, "id" | "venta">) => {
    const response = await apiClient.post<Pago>(
      `${ENDPOINT}${ventaId}/pagos/`,
      pago
    );
    return response.data;
  },

  getByEstado: async (estado: string) => {
    const response = await apiClient.get<Venta[]>(ENDPOINT, {
      params: { estado },
    });
    return response.data;
  },

  getByFecha: async (fechaInicio: string, fechaFin: string) => {
    const response = await apiClient.get<Venta[]>(ENDPOINT, {
      params: { fecha_inicio: fechaInicio, fecha_fin: fechaFin },
    });
    return response.data;
  },
};
