import { useState, useEffect } from "react";
import type { Pago, PagarCuotaRequest } from "@/types/pago.types";
import { pagoService } from "@/services/pagoService";

export const usePagos = (ventaId?: number) => {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarPagos = async () => {
    if (!ventaId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await pagoService.getPagosByVenta(ventaId);
      setPagos(data);
    } catch (err: any) {
      console.error("Error al cargar pagos:", err);
      setError(err.response?.data?.error || "Error al cargar pagos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ventaId) {
      cargarPagos();
    }
  }, [ventaId]);

  return {
    pagos,
    loading,
    error,
    refetch: cargarPagos,
  };
};

export const usePagarCuota = () => {
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pagarCuota = async (request: PagarCuotaRequest) => {
    try {
      setProcesando(true);
      setError(null);
      const result = await pagoService.pagarCuota(request);
      return result;
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Error al procesar el pago";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setProcesando(false);
    }
  };

  return {
    pagarCuota,
    procesando,
    error,
  };
};
