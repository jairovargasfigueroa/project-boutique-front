// ============================================
// TIPOS BASE (Match con backend)
// ============================================

export interface Venta {
  id: number;
  cliente: number | null;
  cliente_nombre?: string;
  vendedor?: number | null;
  vendedor_nombre?: string | null;
  // Información del cliente (snapshot)
  correo_cliente?: string | null;
  direccion_cliente?: string | null;
  nombre_cliente?: string | null;
  telefono_cliente?: string | null;
  numero_cliente?: string | null;
  // Información de la venta
  fecha: string; // DateField
  total: string; // DecimalField
  tipo_venta: "contado" | "credito"; // Renombrado de tipo_pago
  origen?: "tienda" | "ecommerce";
  estado: string; // estado general de la venta
  // Crédito
  interes?: string | null;
  total_con_interes?: string;
  plazo_meses?: number | null;
  cuota_mensual?: string;
  monto_total_pagar?: string;
  // Detalles
  detalles?: DetalleVenta[];
  pagos?: Pago[]; // ✅ Incluir historial de pagos
}

export interface DetalleVenta {
  id: number;
  variante_producto: number; // Renombrado de 'variante'
  cantidad: number;
  precio_unitario: string; // DecimalField
  sub_total: string; // Renombrado de 'subtotal', DecimalField
  nombre_producto: string; // Snapshot del nombre
  talla: string | null; // Snapshot de la talla
}

export interface Pago {
  id: number;
  venta: number;
  cuota?: number | null; // FK opcional a CuotaCredito
  fecha_pago: string; // DateTimeField
  monto_pagado: string; // DecimalField
  metodo_pago: "efectivo" | "tarjeta" | "qr";
  referencia_pago?: string | null;
}

export interface PagarAlContadoRequest {
  metodo_pago: "efectivo" | "tarjeta" | "qr";
  referencia_pago?: string;
}

export interface PagarAlContadoResponse {
  message: string;
  pago: Pago;
  venta: Venta;
}

export interface PagarCuotaRequest {
  cuota: number;
  metodo_pago: "efectivo" | "tarjeta" | "qr";
  referencia_pago?: string;
}

export interface PagarCuotaResponse {
  message: string;
  pago: Pago;
}

export interface RegistrarPagoRequest {
  venta: number;
  monto_pagado: number;
  metodo_pago: "efectivo" | "tarjeta" | "qr";
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
  talla: string | null;
  precio_unitario: number | string; // DecimalField viene como string
  cantidad: number;
  subtotal?: number;
  image?: string | null;
  stock_disponible: number;
}

export interface CrearVentaRequest {
  // Información del cliente
  cliente?: number | null;
  vendedor?: number | null;
  correo_cliente?: string;
  direccion_cliente?: string;
  nombre_cliente?: string;
  telefono_cliente?: string;
  numero_cliente?: string;
  // Información de la venta
  tipo_venta: "contado" | "credito"; // Renombrado de tipo_pago
  origen?: "tienda" | "ecommerce";
  items: ItemVentaCreate[];
  // Para crédito
  interes?: number;
  plazo_meses?: number;
}

export interface AgregarDetalleRequest {
  variante_producto: number; // Renombrado de 'variante'
  cantidad: number;
  precio_unitario?: number;
}

export interface ActualizarDetalleRequest {
  cantidad?: number;
  precio_unitario?: number;
}

// ============================================
// CUOTAS DE CRÉDITO
// ============================================

export interface CuotaCredito {
  id: number;
  venta: number;
  numero_cuota: number;
  fecha_vencimiento: string; // DateField
  monto_cuota: string; // DecimalField
  estado: "pendiente" | "pagada" | "vencida";
  fecha_pago: string | null; // DateField, nullable
  esta_vencida?: boolean; // Property calculada desde el backend
}

// Para listados con información adicional
export interface CuotaCreditoConInfo extends CuotaCredito {
  venta_id: number;
  cliente_nombre: string;
  estado_display: string;
}

export interface CuotasResponse {
  count: number;
  cuotas: CuotaCreditoConInfo[];
  dias?: number;
}

export interface MarcarPagadaRequest {
  fecha_pago?: string;
}

export interface MarcarPagadaResponse {
  message: string;
  cuota: CuotaCredito;
}

// ============================================
// TIPOS PARA CREAR VENTAS
// ============================================

export interface ItemVentaCreate {
  variante_id: number;
  cantidad: number;
  precio_unitario?: number; // Opcional, usa el precio de la variante si no se envía
}
