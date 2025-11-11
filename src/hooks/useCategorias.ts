// src/hooks/useCategorias.ts
"use client";
import { categoriaService } from "@/services/categoriaService";
import { Categoria } from "@/types/productos";
import { useState, useEffect } from "react";

export const useCategorias = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar categorías
  const fetchCategorias = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoriaService.getAll();
      console.log("Categorías", data);
      setCategorias(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar categorías"
      );
    } finally {
      setLoading(false);
    }
  };

  // Crear categoría
  const createCategoria = async (data: Omit<Categoria, "id">) => {
    try {
      setLoading(true);
      await categoriaService.create(data);
      await fetchCategorias();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear categoría");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar categoría
  const updateCategoria = async (id: number, data: Partial<Categoria>) => {
    try {
      setLoading(true);
      await categoriaService.update(id, data);
      await fetchCategorias();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al actualizar categoría"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar categoría
  const deleteCategoria = async (id: number) => {
    try {
      setLoading(true);
      await categoriaService.delete(id);
      await fetchCategorias();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al eliminar categoría"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cargar categorías al montar el componente
  useEffect(() => {
    fetchCategorias();
  }, []);

  return {
    // Estado
    categorias,
    loading,
    error,

    // Acciones
    refetch: fetchCategorias,
    createCategoria,
    updateCategoria,
    deleteCategoria,
  };
};
