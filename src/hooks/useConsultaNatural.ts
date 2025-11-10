import { useState } from "react";
import { consultaNaturalService } from "@/services/consultaNaturalService";
import type { ConsultaNaturalResponse } from "@/types/consultaNatural.types";

export const useConsultaNatural = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ConsultaNaturalResponse | null>(
    null
  );

  /**
   * Genera un reporte usando lenguaje natural vía N8N
   * @param query Consulta en lenguaje natural
   * @param email Email del destinatario (opcional)
   */
  const generarReporte = async (query: string, email?: string) => {
    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      const data = await consultaNaturalService.generarReporte(query, email);
      setResultado(data);
      return data;
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.error ||
        err?.response?.data?.details ||
        err.message ||
        "Error al generar el reporte";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Limpia el estado
   */
  const limpiar = () => {
    setResultado(null);
    setError(null);
  };

  return {
    loading,
    error,
    resultado,
    generarReporte,
    limpiar,
  };
};
