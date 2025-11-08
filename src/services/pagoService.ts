import { apiClient } from "./apiBase";
import { CrearPagoData, Pago } from '@/types/pagos';
import type {
  Pago,
  PagarAlContadoRequest,
  PagarAlContadoResponse,
  PagarCuotaRequest,
  PagarCuotaResponse,
  RegistrarPagoRequest,
  RegistrarPagoResponse,
} from "@/types/pago.types";
const ENDPOINT = '/pagos/';

export const pagoService = {
  pagarAlContado: async (
    ventaId: number,
    data: PagarAlContadoRequest
  ): Promise<PagarAlContadoResponse> => {
    const response = await apiClient.post<PagarAlContadoResponse>(
      `/ventas/${ventaId}/pagar_al_contado/`,
      data
    );
    return response.data;
  },
  pagarCuota: async (data: PagarCuotaRequest): Promise<PagarCuotaResponse> => {
    const response = await apiClient.post<PagarCuotaResponse>(
      "/pagos/pagar_cuota/",
      data
    );
    return response.data;
  },

  registrarPago: async (
    data: RegistrarPagoRequest
  ): Promise<RegistrarPagoResponse> => {
    const response = await apiClient.post<RegistrarPagoResponse>(
      "/pagos/",
      data
    );
    return response.data;
  },
  getPagosByVenta: async (ventaId: number): Promise<Pago[]> => {
    const response = await apiClient.get<Pago[]>(
      `/pagos/por_venta/${ventaId}/`
    );
    return response.data;
  },
  getAll: async (): Promise<Pago[]> => {
    const response = await apiClient.get<Pago[]>("/pagos/");
    return response.data;
  },

  getById: async (id: number): Promise<Pago> => {
    const response = await apiClient.get<Pago>(`/pagos/${id}/`);
    return response.data;
  },
  crear: async (data: CrearPagoData) => {
    const response = await apiClient.post<Pago>(ENDPOINT, data);
    return response.data;
  },

  getByVenta: async (ventaId: number) => {
    const response = await apiClient.get<Pago[]>(`${ENDPOINT}?venta=${ventaId}`);
    return response.data;
  }
  calcularTotalPagado: (pagos: Pago[]): number => {
    return pagos.reduce((sum, pago) => sum + parseFloat(pago.monto_pagado), 0);
  },

  calcularSaldoPendiente: (totalVenta: string, pagos: Pago[]): number => {
    const total = parseFloat(totalVenta);
    const pagado = pagoService.calcularTotalPagado(pagos);
    return total - pagado;
  },

  formatearMetodoPago: (metodo: string): string => {
    const metodos: Record<string, string> = {
      efectivo: "Efectivo",
      tarjeta: "Tarjeta",
      qr: "Código QR",
      transferencia: "Transferencia",
    };
    return metodos[metodo] || metodo;
  },
};
