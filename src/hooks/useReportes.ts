import { useState } from "react";
import type { ReportResponse } from "@/types/reportes.types";
import { reportesService } from "@/services/reportesService";

export const useReportes = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reporte, setReporte] = useState<ReportResponse | null>(null);

  const generarReporte = async (tipo: string, filtros?: any) => {
    try {
      setLoading(true);
      setError(null);

      let data: ReportResponse;

      switch (tipo) {
        case "ventas":
          data = await reportesService.getVentas(filtros);
          break;
        case "productos":
          data = await reportesService.getProductos(filtros);
          break;
        case "stock_bajo":
          data = await reportesService.getStockBajo();
          break;
        case "mas_vendidos":
          data = await reportesService.getMasVendidos(filtros?.limite);
          break;
        case "pagos":
          data = await reportesService.getPagos(filtros);
          break;
        case "cuotas":
          data = await reportesService.getCuotas(filtros);
          break;
        case "morosidad":
          data = await reportesService.getMorosidad();
          break;
        case "flujo_caja":
          data = await reportesService.getFlujoCaja(filtros);
          break;
        default:
          throw new Error("Tipo de reporte no válido");
      }

      setReporte(data);
      return data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Error al generar reporte";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const consultaNatural = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportesService.queryNatural(query);
      setReporte(data.report);
      return data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Error en la consulta";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return {
    reporte,
    loading,
    error,
    generarReporte,
    consultaNatural,
  };
};
