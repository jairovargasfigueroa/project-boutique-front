export interface Pago {
  id: number;
  venta: number;
  cuota?: number | null;
  cuota_numero?: number | null;
  fecha_pago: string;
  monto_pagado: string;
  metodo_pago: "efectivo" | "tarjeta" | "qr" | "transferencia";
  referencia_pago?: string | null;
}

export interface PagarAlContadoRequest {
  metodo_pago: "efectivo" | "tarjeta" | "qr" | "transferencia";
  referencia_pago?: string;
}

export interface PagarAlContadoResponse {
  message: string;
  pago: Pago;
  venta: any;
}

export interface PagarCuotaRequest {
  cuota: number;
  metodo_pago: "efectivo" | "tarjeta" | "qr" | "transferencia";
  referencia_pago?: string;
}

export interface PagarCuotaResponse {
  message: string;
  pago: Pago;
}

export interface RegistrarPagoRequest {
  venta: number;
  monto_pagado: number;
  metodo_pago: "efectivo" | "tarjeta" | "qr" | "transferencia";
  cuota?: number;
  referencia_pago?: string;
}

export interface RegistrarPagoResponse {
  message: string;
  pago: Pago;
  venta: any; // Se importará de venta.types.ts cuando se use
}
