"use client";
import { useState, useEffect, useCallback } from "react";
import type { Venta, CrearVentaRequest } from "@/types/ventas";
import { ventaService } from "@/services/ventaService";

export const useVentas = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarVentas = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    cargarVentas();
  }, [cargarVentas]);

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

  const cargarVenta = useCallback(async () => {
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
  }, [ventaId]);

  const obtenerVenta = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ventaService.getById(id);
      setVenta(data);
      return data;
    } catch (err: any) {
      console.error("Error al obtener venta:", err);
      const errorMsg = err.response?.data?.error || "Error al obtener venta";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const crearVenta = async (data: CrearVentaRequest) => {
    try {
      setLoading(true);
      setError(null);
      const nuevaVenta = await ventaService.crear(data);
      console.log("Venta creada:", nuevaVenta);
      setVenta(nuevaVenta);
      return nuevaVenta;
    } catch (err: any) {
      console.error("Error al crear venta:", err);
      console.error("Respuesta del servidor:", err.response?.data);

      // Obtener mensaje de error detallado
      let errorMsg = "Error al crear venta";
      if (err.response?.data) {
        const data = err.response.data;
        if (typeof data === "string") {
          errorMsg = data;
        } else if (data.error) {
          errorMsg = data.error;
        } else if (data.detail) {
          errorMsg = data.detail;
        } else {
          // Mostrar todos los errores de validación
          const errors = Object.entries(data)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ");
          errorMsg = errors || errorMsg;
        }
      }

      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ventaId) {
      cargarVenta();
    }
  }, [ventaId, cargarVenta]);

  return {
    venta,
    loading,
    error,
    refetch: cargarVenta,
    obtenerVenta,
    crearVenta,
  };
};
