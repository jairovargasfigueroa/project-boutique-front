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
