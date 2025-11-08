export interface CrearPagoData {
  venta: number;
  monto_pagado: number;
  metodo_pago: 'efectivo' | 'tarjeta' | 'transferencia' | 'qr';
  referencia_pago: string;
}

export interface Pago {
  id: number;
  venta: number;
  monto_pagado: number;
  metodo_pago: string;
  referencia_pago: string;
  fecha_pago: string;
}
