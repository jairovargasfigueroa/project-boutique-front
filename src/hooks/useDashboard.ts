import { useState, useEffect } from "react";
import { reportesService } from "@/services/reportesService";
import type { DashboardData } from "@/types/dashboard.types";

export const useDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);

    try {
      const dashboardData = await reportesService.getDashboard();
      setData(dashboardData);
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.error ||
        err.message ||
        "Error al cargar los datos del dashboard";
      setError(errorMsg);
      console.error("Error cargando dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return {
    data,
    loading,
    error,
    recargar: cargarDatos,
  };
};
