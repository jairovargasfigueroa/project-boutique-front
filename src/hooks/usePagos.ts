import { useState, useEffect, useCallback } from "react";
import type {
  Pago,
  PagarCuotaRequest,
  RegistrarPagoRequest,
  PagarAlContadoRequest,
} from "@/types/ventas";
import { pagoService } from "@/services/pagoService";

export const usePagos = (ventaId?: number) => {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarPagos = useCallback(async () => {
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
  }, [ventaId]);

  const registrarPago = useCallback(async (request: RegistrarPagoRequest) => {
    try {
      setLoading(true);
      setError(null);
      const result = await pagoService.registrarPago(request);
      // No recargar automáticamente, dejar que el componente decida
      return result;
    } catch (err: any) {
      console.error("Error al registrar pago:", err);
      console.error("Respuesta del servidor:", err.response?.data);

      // Obtener mensaje de error detallado
      let errorMsg = "Error al registrar el pago";
      if (err.response?.data) {
        const data = err.response.data;
        if (typeof data === "string") {
          errorMsg = data;
        } else if (data.error) {
          errorMsg = data.error;
        } else if (data.detail) {
          errorMsg = data.detail;
        } else {
          // Mostrar todos los errores
          const errors = Object.entries(data)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ");
          errorMsg = errors || errorMsg;
        }
      }

      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (ventaId) {
      cargarPagos();
    }
  }, [ventaId, cargarPagos]);

  return {
    pagos,
    loading,
    error,
    refetch: cargarPagos,
    registrarPago,
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

export const usePagarAlContado = () => {
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pagarAlContado = async (
    ventaId: number,
    request: PagarAlContadoRequest
  ) => {
    try {
      setProcesando(true);
      setError(null);
      const result = await pagoService.pagarAlContado(ventaId, request);
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
    pagarAlContado,
    procesando,
    error,
  };
};
