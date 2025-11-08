import type {
  NaturalLanguageQueryRequest,
  NaturalLanguageQueryResponse,
  ReportByTypeRequest,
  ReportResponse,
} from "@/types/reportes.types";
import { apiClient } from "./apiBase";

const ENDPOINT = "/reports/";

export const reportesService = {
  // Reporte con lenguaje natural
  queryNatural: async (query: string) => {
    const response = await apiClient.post<NaturalLanguageQueryResponse>(
      `${ENDPOINT}query/`,
      { query }
    );
    return response.data;
  },

  // Reporte por tipo
  generate: async (data: ReportByTypeRequest) => {
    const response = await apiClient.post<{ report: ReportResponse }>(
      `${ENDPOINT}generate/`,
      data
    );
    return response.data.report;
  },

  // Reportes específicos
  getVentas: async (filters?: any) => {
    return reportesService.generate({ report_type: "ventas", filters });
  },

  getProductos: async (filters?: any) => {
    return reportesService.generate({ report_type: "productos", filters });
  },

  getStockBajo: async () => {
    return reportesService.generate({ report_type: "stock_bajo" });
  },

  getMasVendidos: async (limite: number = 10) => {
    return reportesService.generate({
      report_type: "mas_vendidos",
      filters: { limite },
    });
  },

  getPagos: async (filters?: any) => {
    return reportesService.generate({ report_type: "pagos", filters });
  },

  getCuotas: async (filters?: any) => {
    return reportesService.generate({ report_type: "cuotas", filters });
  },

  getMorosidad: async () => {
    return reportesService.generate({ report_type: "morosidad" });
  },

  getFlujoCaja: async (filters?: any) => {
    return reportesService.generate({ report_type: "flujo_caja", filters });
  },

  // Dashboard
  getDashboard: async () => {
    const response = await apiClient.get(`${ENDPOINT}dashboard/`);
    return response.data;
  },

  // Cierre de día
  getCierreDia: async () => {
    const response = await apiClient.get(`${ENDPOINT}cierre-dia/`);
    return response.data;
  },

  // Alertas de inventario
  getAlertasInventario: async () => {
    const response = await apiClient.get(`${ENDPOINT}alertas-inventario/`);
    return response.data;
  },
};
