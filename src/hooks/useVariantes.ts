// src/hooks/useVariantes.ts
"use client";
import { varianteService } from "@/services/varianteService";
import { 
  ProductoVariante, 
  VarianteProductoCreate, 
  VarianteProductoUpdate 
} from "@/types/productos";
import { useState, useEffect, useCallback } from "react";

interface UseVariantesProps {
  productoId?: number;
  autoFetch?: boolean;
}

export const useVariantes = ({
  productoId,
  autoFetch = false,
}: UseVariantesProps = {}) => {
  const [variantes, setVariantes] = useState<ProductoVariante[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVariantes = useCallback(async (prodId?: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await varianteService.getAll();
      const filteredData = prodId
        ? data.filter((v) => v.producto === prodId)
        : productoId
        ? data.filter((v) => v.producto === productoId)
        : data;

      console.log("Variantes cargadas:", filteredData);
      setVariantes(filteredData);
      return filteredData;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar variantes"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, [productoId]);

  const createVariante = async (data: VarianteProductoCreate) => {
    try {
      console.log("🔵 Hook useVariantes - createVariante llamado con:", data);
      setLoading(true);
      setError(null);
      const newVariante = await varianteService.create(data);
      console.log("🟢 Hook useVariantes - Variante creada:", newVariante);
      setVariantes((prev) => [...prev, newVariante]);
      return newVariante;
    } catch (err) {
      console.error("🔴 Hook useVariantes - Error:", err);
      setError(err instanceof Error ? err.message : "Error al crear variante");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateVariante = async (
    id: number,
    data: VarianteProductoUpdate
  ) => {
    try {
      setLoading(true);
      setError(null);
      // Usar PATCH para actualización parcial (más seguro)
      const updatedVariante = await varianteService.patch(id, data);
      setVariantes((prev) =>
        prev.map((v) => (v.id === id ? updatedVariante : v))
      );
      return updatedVariante;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al actualizar variante"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteVariante = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await varianteService.delete(id);
      setVariantes((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al eliminar variante"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (id: number, stock: number) => {
    try {
      setLoading(true);
      setError(null);
      const updatedVariante = await varianteService.updateStock(id, stock);
      setVariantes((prev) =>
        prev.map((v) => (v.id === id ? updatedVariante : v))
      );
      return updatedVariante;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al actualizar stock"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchVariantes();
    }
  }, [productoId, autoFetch, fetchVariantes]);

  return {
    // Estado
    variantes,
    loading,
    error,

    // Acciones
    createVariante,
    updateVariante,
    deleteVariante,
    updateStock,
    refetch: fetchVariantes,
  };
};
