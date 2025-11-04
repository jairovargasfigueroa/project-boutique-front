import { useState, useEffect } from "react";
import type { Venta } from "@/types/venta.types";
import { ventaService } from "@/services/ventaService";

export const useVentas = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarVentas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ventaService.getAll();
      setVentas(data);
    } catch (err: any) {
      console.error("Error al cargar ventas:", err);
      setError(err.response?.data?.error || "Error al cargar ventas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarVentas();
  }, []);

  return {
    ventas,
    loading,
    error,
    refetch: cargarVentas,
  };
};

export const useVentaDetalle = (ventaId?: number) => {
  const [venta, setVenta] = useState<Venta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarVenta = async () => {
    if (!ventaId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await ventaService.getById(ventaId);
      setVenta(data);
    } catch (err: any) {
      console.error("Error al cargar venta:", err);
      setError(err.response?.data?.error || "Error al cargar venta");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ventaId) {
      cargarVenta();
    }
  }, [ventaId]);

  return {
    venta,
    loading,
    error,
    refetch: cargarVenta,
  };
};
