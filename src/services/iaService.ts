// src/services/iaService.ts
import { apiClient } from "./apiBase";
import {
  ResponsePrediccionGeneral,
  ResponsePrediccionProducto,
  ResponseAlertas,
  ResponseModeloInfo,
  ResponseEntrenamientoHistorial,
  ResponseEntrenarModelo,
  ResponseDetectarAnomalias,
  PredictGeneralParams,
  PredictProductoParams,
  AlertasParams,
  TrainingHistoryParams,
  UpdateAlertaRequest,
  DetectarAnomaliasRequest,
} from "@/types/ia";

export const iaService = {
  async getPredictGeneral(
    params?: PredictGeneralParams
  ): Promise<ResponsePrediccionGeneral> {
    const response = await apiClient.get("/ia/predict-general/", {
      params,
    });
    return response.data;
  },

  async getPredictProducto(
    productoId: number,
    params?: PredictProductoParams
  ): Promise<ResponsePrediccionProducto> {
    const response = await apiClient.get(`/ia/predict-product/${productoId}/`, {
      params,
    });
    return response.data;
  },

  async getAlertas(params?: AlertasParams): Promise<ResponseAlertas> {
    const response = await apiClient.get("/ia/alerts/", {
      params,
    });
    return response.data;
  },

  async updateAlerta(
    alertaId: number,
    data: UpdateAlertaRequest
  ): Promise<{ success: boolean; mensaje: string; alerta: any }> {
    const response = await apiClient.patch(`/ia/alerts/${alertaId}/`, data);
    return response.data;
  },

  async detectarAnomalias(
    data?: DetectarAnomaliasRequest
  ): Promise<ResponseDetectarAnomalias> {
    const response = await apiClient.post("/ia/detect-anomalies/", data || {});
    return response.data;
  },

  async entrenarModelo(): Promise<ResponseEntrenarModelo> {
    const response = await apiClient.post("/ia/train/");
    return response.data;
  },

  async getModeloInfo(): Promise<ResponseModeloInfo> {
    const response = await apiClient.get("/ia/model-info/");
    return response.data;
  },

  async getTrainingHistory(
    params?: TrainingHistoryParams
  ): Promise<ResponseEntrenamientoHistorial> {
    const response = await apiClient.get("/ia/training-history/", {
      params,
    });
    return response.data;
  },
};
