// Tipos base para reportes
export interface ReportResponse<T = any> {
  summary: string;
  columns: string[];
  rows: T[];
  meta?: any;
}

// Request para lenguaje natural
export interface NaturalLanguageQueryRequest {
  query: string;
}

export interface NaturalLanguageQueryResponse {
  query_original: string;
  parsed_query: any;
  report: ReportResponse;
}

// Tipos de reportes disponibles
export type ReportType =
  | "ventas"
  | "productos"
  | "stock_bajo"
  | "mas_vendidos"
  | "pagos"
  | "cuotas"
  | "morosidad"
  | "flujo_caja";

export interface ReportByTypeRequest {
  report_type: ReportType;
  filters?: {
    fecha_inicio?: string;
    fecha_fin?: string;
    limite?: number;
    [key: string]: any;
  };
}
