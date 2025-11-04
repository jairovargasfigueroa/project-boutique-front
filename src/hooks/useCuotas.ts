import { useState, useEffect } from "react";
import type { Cuota } from "@/types/cuota.types";
import { cuotaService } from "@/services/cuotaService";

export const useCuotas = (ventaId?: number) => {
  const [cuotas, setCuotas] = useState<Cuota[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarCuotas = async () => {
    if (!ventaId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await cuotaService.getByVenta(ventaId);
      setCuotas(data);
    } catch (err: any) {
      console.error("Error al cargar cuotas:", err);
      setError(err.response?.data?.error || "Error al cargar cuotas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ventaId) {
      cargarCuotas();
    }
  }, [ventaId]);

  return {
    cuotas,
    loading,
    error,
    refetch: cargarCuotas,
  };
};

export const useCuotasAlertas = () => {
  const [proximasVencer, setProximasVencer] = useState<Cuota[]>([]);
  const [vencidas, setVencidas] = useState<Cuota[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarAlertas = async () => {
    try {
      setLoading(true);
      setError(null);
      const [proximasRes, vencidasRes] = await Promise.all([
        cuotaService.getProximasVencer(7),
        cuotaService.getVencidas(),
      ]);

      setProximasVencer(proximasRes.cuotas || []);
      setVencidas(vencidasRes.cuotas || []);
    } catch (err: any) {
      console.error("Error al cargar alertas de cuotas:", err);
      setError(err.response?.data?.error || "Error al cargar alertas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAlertas();
    const interval = setInterval(cargarAlertas, 300000);
    return () => clearInterval(interval);
  }, []);

  return {
    proximasVencer,
    vencidas,
    loading,
    error,
    refetch: cargarAlertas,
  };
};
