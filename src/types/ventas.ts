export interface Venta {
  id: number;
  cuota_mensual: number;
  estado: string;
  fecha: string;
  interes: number;
  plazo_meses: number;
  tipo_venta: string;
  total: number;
  total_con_interes: number;
}

export interface DetalleVenta {
  id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  venta: number;
  variante: number;
  variante_detalle?: {
    id: number;
    talla: string;
    color: string;
    producto_nombre: string;
    imagen_url?: string;
  };
}

export interface Pago {
  id: number;
  estado: string;
  fecha: string;
  metodo: string;
  monto: number;
  venta: number;
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
  tipo_venta: string;
  estado: string;
  items: {
    variante_id: number;
    cantidad: number;
    precio_unitario: number;
  }[];
  pago?: {
    metodo: string;
    monto: number;
  };
  plazo_meses?: number;
  interes?: number;
}
