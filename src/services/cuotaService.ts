import { apiClient } from "./apiBase";
import type {
  Cuota,
  CuotasResponse,
  MarcarPagadaRequest,
  MarcarPagadaResponse,
} from "@/types/cuota.types";

/**
 * Servicio para gestión de cuotas de ventas a crédito
 */
export const cuotaService = {
  /**
   * Obtener todas las cuotas
   * - Admin: ve todas las cuotas
   * - Usuario: solo sus cuotas
   */
  getAll: async (): Promise<Cuota[]> => {
    const response = await apiClient.get<Cuota[]>("/cuotas/");
    return response.data;
  },

  /**
   * Obtener una cuota específica por ID
   */
  getById: async (id: number): Promise<Cuota> => {
    const response = await apiClient.get<Cuota>(`/cuotas/${id}/`);
    return response.data;
  },

  /**
   * Obtener cuotas pendientes
   */
  getPendientes: async (): Promise<CuotasResponse> => {
    const response = await apiClient.get<CuotasResponse>("/cuotas/pendientes/");
    return response.data;
  },

  /**
   * Obtener cuotas vencidas
   */
  getVencidas: async (): Promise<CuotasResponse> => {
    const response = await apiClient.get<CuotasResponse>("/cuotas/vencidas/");
    return response.data;
  },

  /**
   * Obtener cuotas próximas a vencer
   * @param dias - Número de días adelante para buscar (default: 7)
   */
  getProximasVencer: async (dias: number = 7): Promise<CuotasResponse> => {
    const response = await apiClient.get<CuotasResponse>(
      `/cuotas/proximas_vencer/?dias=${dias}`
    );
    return response.data;
  },

  /**
   * Marcar una cuota como pagada
   * @param id - ID de la cuota
   * @param data - Fecha de pago (opcional, usa fecha actual si no se envía)
   */
  marcarPagada: async (
    id: number,
    data?: MarcarPagadaRequest
  ): Promise<MarcarPagadaResponse> => {
    const response = await apiClient.post<MarcarPagadaResponse>(
      `/cuotas/${id}/marcar_pagada/`,
      data || {}
    );
    return response.data;
  },

  /**
   * Obtener cuotas de una venta específica
   * @param ventaId - ID de la venta
   */
  getByVenta: async (ventaId: number): Promise<Cuota[]> => {
    const todasLasCuotas = await cuotaService.getAll();
    return todasLasCuotas.filter((cuota) => cuota.venta_id === ventaId);
  },

  /**
   * Calcular métricas de cuotas
   */
  calcularMetricas: (cuotas: Cuota[]) => {
    const total = cuotas.length;
    const pagadas = cuotas.filter((c) => c.estado === "pagada").length;
    const vencidas = cuotas.filter((c) => c.estado === "vencida").length;
    const pendientes = cuotas.filter((c) => c.estado === "pendiente").length;

    const montoPagado = cuotas
      .filter((c) => c.estado === "pagada")
      .reduce((sum, c) => sum + parseFloat(c.monto_cuota), 0);

    const montoPendiente = cuotas
      .filter((c) => c.estado !== "pagada")
      .reduce((sum, c) => sum + parseFloat(c.monto_cuota), 0);

    const progreso = total > 0 ? (pagadas / total) * 100 : 0;

    return {
      total,
      pagadas,
      vencidas,
      pendientes,
      montoPagado,
      montoPendiente,
      progreso: progreso.toFixed(1),
    };
  },

  /**
   * Calcular días para vencimiento
   */
  diasParaVencer: (fechaVencimiento: string): number => {
    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diff = Math.ceil(
      (vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff;
  },
};
