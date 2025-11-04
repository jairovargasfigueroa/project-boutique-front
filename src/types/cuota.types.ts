export interface Cuota {
  id: number;
  venta: number;
  venta_id: number;
  cliente_nombre: string;
  numero_cuota: number;
  fecha_vencimiento: string;
  monto_cuota: string;
  estado: "pendiente" | "pagada" | "vencida";
  estado_display: string;
  fecha_pago: string | null;
  esta_vencida: boolean;
}

export interface CuotasResponse {
  count: number;
  cuotas: Cuota[];
  dias?: number;
}

export interface MarcarPagadaRequest {
  fecha_pago?: string;
}

export interface MarcarPagadaResponse {
  message: string;
  cuota: Cuota;
}

export interface ActualizarCuotaRequest {
  fecha_vencimiento?: string;
  monto_cuota?: number;
}
