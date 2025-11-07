export interface ItemVenta {
  variante_id: number;
  cantidad: number;
}

export interface CrearVentaData {
  cliente: number | null;
  items: ItemVenta[];
  tipo_pago: 'contado';
}

export interface Venta {
  id: number;
  numero_pedido: string;
  total: number;
  estado: 'pendiente' | 'pagado' | 'en_preparacion' | 'enviado' | 'entregado' | 'expirado';
  fecha_creacion: string;
  items: ItemVenta[];
}
