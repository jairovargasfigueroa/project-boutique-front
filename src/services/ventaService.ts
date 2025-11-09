import type {
  Venta,
  DetalleVenta,
  CrearVentaRequest,
  AgregarDetalleRequest,
  ActualizarDetalleRequest,
} from "@/types/ventas";
import { apiClient } from "./apiBase";

const ENDPOINT = "/ventas/";

export const ventaService = {
  // Listar todas las ventas
  getAll: async () => {
    const response = await apiClient.get<Venta[]>(ENDPOINT);
    return response.data;
  },

  // Ver detalle completo de una venta
  getById: async (id: number) => {
    const response = await apiClient.get<Venta>(`${ENDPOINT}${id}/`);
    return response.data;
  },

  // Crear venta completa (RECOMENDADO)
  crear: async (venta: CrearVentaRequest) => {
    const response = await apiClient.post<Venta>(`${ENDPOINT}crear/`, venta);
    return response.data;
  },

  // Ver solo detalles de una venta
  getDetalles: async (ventaId: number) => {
    const response = await apiClient.get<DetalleVenta[]>(
      `${ENDPOINT}${ventaId}/detalles/`
    );
    return response.data;
  },

  // Agregar detalle a venta existente
  agregarDetalle: async (ventaId: number, detalle: AgregarDetalleRequest) => {
    const response = await apiClient.post<DetalleVenta>(
      `${ENDPOINT}${ventaId}/agregar_detalle/`,
      detalle
    );
    return response.data;
  },

  // Actualizar detalle existente
  actualizarDetalle: async (
    ventaId: number,
    detalleId: number,
    data: ActualizarDetalleRequest
  ) => {
    const response = await apiClient.patch<DetalleVenta>(
      `${ENDPOINT}${ventaId}/actualizar_detalle/?detalle_id=${detalleId}`,
      data
    );
    return response.data;
  },

  // Eliminar detalle
  eliminarDetalle: async (ventaId: number, detalleId: number) => {
    const response = await apiClient.delete<{ message: string }>(
      `${ENDPOINT}${ventaId}/eliminar_detalle/?detalle_id=${detalleId}`
    );
    return response.data;
  },

  // Métodos auxiliares (mantener compatibilidad)
  update: async (id: number, venta: Partial<Venta>) => {
    const response = await apiClient.put<Venta>(`${ENDPOINT}${id}/`, venta);
    return response.data;
  },

  delete: async (id: number) => {
    await apiClient.delete(`${ENDPOINT}${id}/`);
  },
};
