"use client";
import { useState, useEffect, useCallback } from "react";
import { iaService } from "@/services/iaService";
import {
  PrediccionGeneral,
  PrediccionProducto,
  AlertaAnomalia,
  MetricasModelo,
  EntrenamientoHistorial,
  PredictGeneralParams,
  PredictProductoParams,
  AlertasParams,
  UpdateAlertaRequest,
  DetectarAnomaliasRequest,
} from "@/types/ia";

export const usePredictGeneral = (params?: PredictGeneralParams) => {
  const [predicciones, setPredicciones] = useState<PrediccionGeneral[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Serializar params para comparar por valor
  const paramsString = JSON.stringify(params);

  const fetchPredicciones = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await iaService.getPredictGeneral(params);
      setPredicciones(data.predicciones);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar predicciones"
      );
    } finally {
      setLoading(false);
    }
  }, [paramsString]); // ← Depende del string, no del objeto

  useEffect(() => {
    fetchPredicciones();
  }, [fetchPredicciones]);

  return { predicciones, loading, error, refetch: fetchPredicciones };
};

export const usePredictProducto = (
  productoId: number | null,
  params?: PredictProductoParams
) => {
  const [predicciones, setPredicciones] = useState<PrediccionProducto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Serializar params para comparar por valor
  const paramsString = JSON.stringify(params);

  const fetchPredicciones = useCallback(async () => {
    if (!productoId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await iaService.getPredictProducto(productoId, params);
      setPredicciones(data.predicciones);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar predicciones del producto"
      );
    } finally {
      setLoading(false);
    }
  }, [productoId, paramsString]); // ← Depende del string, no del objeto

  useEffect(() => {
    if (productoId) {
      fetchPredicciones();
    }
  }, [fetchPredicciones, productoId]);

  return { predicciones, loading, error, refetch: fetchPredicciones };
};

export const useAlertas = (params?: AlertasParams) => {
  const [alertas, setAlertas] = useState<AlertaAnomalia[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Serializar params para comparar por valor
  const paramsString = JSON.stringify(params);

  const fetchAlertas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await iaService.getAlertas(params);
      setAlertas(data.alertas);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar alertas");
    } finally {
      setLoading(false);
    }
  }, [paramsString]); // ← Depende del string, no del objeto

  const updateAlerta = useCallback(async (
    alertaId: number,
    updateData: UpdateAlertaRequest
  ) => {
    try {
      setLoading(true);
      setError(null);
      const response = await iaService.updateAlerta(alertaId, updateData);
      // Actualizar la lista local
      setAlertas((prev) =>
        prev.map((alerta) =>
          alerta.id === alertaId ? response.alerta : alerta
        )
      );
      return response;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al actualizar alerta"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlertas();
  }, [fetchAlertas]);

  return { alertas, loading, error, refetch: fetchAlertas, updateAlerta };
};

export const useModeloInfo = () => {
  const [modeloActivo, setModeloActivo] = useState(false);
  const [metricas, setMetricas] = useState<MetricasModelo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchModeloInfo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await iaService.getModeloInfo();
      setModeloActivo(data.modelo_activo);
      setMetricas(data.metricas || null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar información del modelo"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const entrenarModelo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await iaService.entrenarModelo();
      // Recargar información del modelo
      await fetchModeloInfo();
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al entrenar modelo");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchModeloInfo]);

  useEffect(() => {
    fetchModeloInfo();
  }, [fetchModeloInfo]);

  return {
    modeloActivo,
    metricas,
    loading,
    error,
    refetch: fetchModeloInfo,
    entrenarModelo,
  };
};

export const useTrainingHistory = (limite?: number) => {
  const [entrenamientos, setEntrenamientos] = useState<
    EntrenamientoHistorial[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await iaService.getTrainingHistory({ limite });
      setEntrenamientos(data.entrenamientos);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar historial"
      );
    } finally {
      setLoading(false);
    }
  }, [limite]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { entrenamientos, loading, error, refetch: fetchHistory };
};

export const useDetectarAnomalias = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detectar = useCallback(async (data?: DetectarAnomaliasRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await iaService.detectarAnomalias(data);
      return response;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al detectar anomalías"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { detectar, loading, error };
};
