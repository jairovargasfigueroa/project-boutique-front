// Tipos para el Dashboard basados en la API de reportes

// Resumen general
export interface VentasMes {
  total: number;
  cantidad: number;
  promedio: number;
}

export interface Morosidad {
  cuotas_vencidas: number;
  monto_vencido: number;
  cuotas_pendientes: number;
  monto_pendiente: number;
}

export interface ResumenDashboard {
  ventas_mes: VentasMes;
  morosidad: Morosidad;
  productos_sin_movimiento: number;
  productos_stock_critico: number;
}

// Ventas de la última semana
export interface VentaSemana {
  fecha: string; // YYYY-MM-DD
  total: number;
}

// Ingresos diarios
export interface IngresoDiario {
  fecha: string; // YYYY-MM-DD
  total: number;
}

// Top productos
export interface TopProducto {
  nombre: string;
  cantidad_vendida: number;
  ingresos: number;
  imagen: string | null;
}

// Top clientes
export interface TopCliente {
  nombre: string;
  correo: string;
  telefono: string;
  total_compras: number;
  cantidad_compras: number;
}

// Stock crítico
export interface StockCritico {
  producto: string;
  talla: string;
  stock_actual: number;
  stock_minimo: number;
  estado: "AGOTADO" | "BAJO";
}

// Ingresos por método de pago
export interface IngresoMetodo {
  metodo: "efectivo" | "tarjeta" | "qr";
  total: number;
  cantidad_transacciones: number;
}

// Ventas por tipo
export interface VentaTipo {
  tipo: "contado" | "credito";
  total: number;
  cantidad: number;
}

// Response completo del dashboard
export interface DashboardData {
  resumen: ResumenDashboard;
  ventas_semana: VentaSemana[];
  ingresos_diarios: IngresoDiario[];
  top_productos: TopProducto[];
  top_clientes: TopCliente[];
  stock_critico: StockCritico[];
  ingresos_metodo: IngresoMetodo[];
  ventas_tipo: VentaTipo[];
}
