// Este archivo está deprecado. Usar ventas.ts en su lugar para mantener todos los tipos relacionados
export type {
  CuotaCredito as Cuota,
  CuotaCreditoConInfo,
  CuotasResponse,
  MarcarPagadaRequest,
  MarcarPagadaResponse,
} from "./ventas";

export interface ActualizarCuotaRequest {
  fecha_vencimiento?: string;
  monto_cuota?: number;
}
