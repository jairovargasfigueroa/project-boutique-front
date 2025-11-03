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
  };
};
