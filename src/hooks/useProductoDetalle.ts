// src/hooks/useProductoDetalle.ts
"use client";
import { useState, useEffect } from "react";
import { productoService } from "@/services/productoService";
import { Producto, ProductoVariante } from "@/types/productos";

export const useProductoDetalle = (productoId: number) => {
  const [producto, setProducto] = useState<Producto | null>(null);
  const [variantes, setVariantes] = useState<ProductoVariante[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log("🎣 useProductoDetalle - Hook inicializado con ID:", productoId);

  useEffect(() => {
    const cargarProductoYVariantes = async () => {
      console.log("🔍 useProductoDetalle - Iniciando carga para producto ID:", productoId);
      setLoading(true);
      setError(null);

      try {
        console.log("📡 Llamando API en paralelo...");
        // 🚀 Carga en PARALELO producto + variantes
        const [productoData, variantesData] = await Promise.all([
          productoService.getById(productoId),
          productoService.getVariantesByProducto(productoId),
        ]);

        console.log("✅ Producto cargado:", productoData);
        console.log("✅ Variantes cargadas:", variantesData);
        console.log("📊 Total de variantes:", variantesData.length);

        setProducto(productoData);
        setVariantes(variantesData);
      } catch (err) {
        console.error("❌ Error cargando producto:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Error al cargar producto o variantes"
        );
      } finally {
        setLoading(false);
        console.log("🏁 useProductoDetalle - Carga finalizada");
      }
    };

    if (productoId) {
      console.log("🚀 useProductoDetalle - useEffect ejecutado con productoId:", productoId);
      cargarProductoYVariantes();
    } else {
      console.warn("⚠️ useProductoDetalle - productoId no válido:", productoId);
    }
  }, [productoId]);

  return {
    producto,
    variantes,
    loading,
    error,
  };
};
