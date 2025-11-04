export interface Venta {
  id: number;
  cliente: number | null;
  cliente_nombre?: string;
  fecha: string;
  total: string;
  tipo_pago: "contado" | "credito";
  estado_pago: "pendiente" | "parcial" | "pagado";
  interes?: string | null;
  total_con_interes?: string | null;
  plazo_meses?: number | null;
  cuota_mensual?: string | null;
  detalles?: DetalleVenta[];
}

export interface DetalleVenta {
  id: number;
  variante: number;
  cantidad: number;
  precio_unitario: string;
  subtotal: string;
  producto_nombre: string;
  talla: string;
  color: string;
}

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
  venta: Venta;
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
  venta: Venta;
}

export interface ItemCarritoVenta {
  variante_id: number;
  producto_nombre: string;
  talla: string;
  color: string;
  precio_unitario: number;
  cantidad: number;
  subtotal: number;
  imagen_url?: string;
  stock_disponible: number;
}

export interface CrearVentaRequest {
  cliente?: number | null;
  tipo_pago: "contado" | "credito";
  items: {
    variante_id: number;
    cantidad: number;
  }[];
  interes?: number;
  plazo_meses?: number;
}

export interface AgregarDetalleRequest {
  variante: number;
  cantidad: number;
  precio_unitario?: number;
}

export interface ActualizarDetalleRequest {
  cantidad?: number;
  precio_unitario?: number;
}

// ============ CUOTAS ============

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
