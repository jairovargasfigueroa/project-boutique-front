export interface PrediccionGeneral {
  periodo: string;
  fecha_inicio: string;
  fecha_fin: string;
  ventas_predichas: string;
  cantidad_ventas_predichas: number;
  confianza: number;
  tendencia: "alza" | "baja" | "estable";
}

export interface ResponsePrediccionGeneral {
  success: boolean;
  periodo: "semanal" | "mensual";
  cantidad_periodos: number;
  fecha_prediccion: string;
  predicciones: PrediccionGeneral[];
}

export interface PrediccionProducto {
  producto_id: number;
  producto_nombre: string;
  periodo: string;
  fecha_inicio: string;
  fecha_fin: string;
  ventas_predichas: number;
  confianza: number;
  tendencia: "alza" | "baja" | "estable";
  recomendacion: string;
}

export interface ResponsePrediccionProducto {
  success: boolean;
  producto_id: number;
  periodo: "semanal" | "mensual";
  cantidad_periodos: number;
  fecha_prediccion: string;
  predicciones: PrediccionProducto[];
}

// ========================================
// ALERTAS
// ========================================

export type TipoAlerta =
  | "venta_baja"
  | "venta_alta"
  | "producto_anomalo"
  | "tendencia_negativa";
export type EstadoAlerta = "nueva" | "revisada" | "resuelta" | "ignorada";

export interface AlertaAnomalia {
  id: number;
  tipo: TipoAlerta;
  tipo_display: string;
  fecha_deteccion: string;
  fecha_referencia: string;
  descripcion: string;
  score_anomalia: number;
  producto_id: number | null;
  producto_nombre: string | null;
  valor_real: string;
  valor_esperado: string;
  estado: EstadoAlerta;
  estado_display: string;
  nota_resolucion: string | null;
}

export interface ResponseAlertas {
  success: boolean;
  cantidad: number;
  alertas: AlertaAnomalia[];
}

export interface UpdateAlertaRequest {
  estado?: EstadoAlerta;
  nota_resolucion?: string;
}

// ========================================
// MODELO
// ========================================

export interface MetricasModelo {
  mae: number;
  mse: number;
  r2_score: number;
  registros_entrenamiento: number;
  registros_prueba: number;
  fecha_entrenamiento: string;
  version: string;
}

export interface ResponseModeloInfo {
  success: boolean;
  modelo_activo: boolean;
  metricas?: MetricasModelo;
  mensaje?: string;
}

export interface EntrenamientoHistorial {
  id: number;
  version: string;
  fecha_entrenamiento: string;
  mae: string;
  mse: string;
  r2_score: string;
  registros_entrenamiento: number;
  registros_prueba: number;
  activo: boolean;
  archivo_modelo: string;
  notas: string;
}

export interface ResponseEntrenamientoHistorial {
  success: boolean;
  cantidad: number;
  entrenamientos: EntrenamientoHistorial[];
}

export interface ResponseEntrenarModelo {
  success: boolean;
  mensaje: string;
  modelo_id: number;
  version: string;
  metricas: {
    mae: number;
    mse: number;
    r2_score: number;
    registros_entrenamiento: number;
    registros_prueba: number;
  };
  archivo_modelo: string;
}

// ========================================
// DETECCIÓN DE ANOMALÍAS
// ========================================

export interface DetectarAnomaliasRequest {
  dias_analisis?: number;
}

export interface ResponseDetectarAnomalias {
  success: boolean;
  mensaje: string;
  cantidad_detectadas: number;
  alertas: AlertaAnomalia[];
}

// ========================================
// PARÁMETROS DE CONSULTA
// ========================================

export interface PredictGeneralParams {
  periodo?: "semanal" | "mensual";
  cantidad?: number;
}

export interface PredictProductoParams {
  periodo?: "semanal" | "mensual";
  cantidad?: number;
}

export interface AlertasParams {
  estado?: EstadoAlerta;
  limite?: number;
}

export interface TrainingHistoryParams {
  limite?: number;
}
