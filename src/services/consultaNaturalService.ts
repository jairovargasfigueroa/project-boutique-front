import type {
  ConsultaNaturalRequest,
  ConsultaNaturalResponse,
} from "@/types/consultaNatural.types";
import { apiClient } from "./apiBase";

const ENDPOINT = "/reports";

export const consultaNaturalService = {
  /**
   * Genera un reporte usando lenguaje natural y lo envía por email
   * Este endpoint actúa como proxy hacia N8N
   * @param query Consulta en lenguaje natural
   * @param email Email del destinatario (opcional)
   */
  generarReporte: async (
    query: string,
    email?: string
  ): Promise<ConsultaNaturalResponse> => {
    const payload: ConsultaNaturalRequest = {
      query,
      user_email: email || "garcia.brayan3001@gmail.com",
    };

    const response = await apiClient.post<ConsultaNaturalResponse>(
      `${ENDPOINT}/generate/`,
      payload
    );

    return response.data;
  },
};
