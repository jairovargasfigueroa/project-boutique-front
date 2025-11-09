"use client";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useVentaDetalle } from "@/hooks/useVentas";
import { usePagos } from "@/hooks/usePagos";
import FormularioPago from "./components/FormularioPago";
import PageContainer from "../components/container/PageContainer";

export default function PagoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ventaId = searchParams.get("venta");

  const { obtenerVenta, venta, loading: loadingVenta } = useVentaDetalle();
  const {
    registrarPago,
    loading: loadingPago,
    error,
  } = usePagos(ventaId ? Number(ventaId) : undefined);

  const [datosPago, setDatosPago] = useState<any>(null);

  // Cargar venta al montar
  useEffect(() => {
    if (ventaId) {
      obtenerVenta(Number(ventaId));
    }
  }, [ventaId]);

  const handleConfirmarPago = async () => {
    if (!ventaId || !datosPago) {
      alert("Datos incompletos");
      return;
    }

    try {
      const pagoData = {
        venta: Number(ventaId),
        monto_pagado: parseFloat(datosPago.monto_pagado),
        metodo_pago: datosPago.metodo_pago,
        referencia_pago: datosPago.referencia_pago || "Sin referencia",
      };

      console.log("Registrando pago:", pagoData);

      await registrarPago(pagoData);

      console.log("Pago registrado exitosamente");

      // Redirigir a confirmación
      // router.push(`/pedido/${ventaId}/confirmacion`);
      router.push(`/catalogo`);
    } catch (err) {
      console.error("Error:", err);
      alert("Error al procesar el pago. Por favor intenta nuevamente.");
    }
  };

  if (!ventaId) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          No se encontró la venta
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push("/catalogo")}
          sx={{ mt: 2 }}
        >
          Ir al catálogo
        </Button>
      </Box>
    );
  }

  if (loadingVenta) {
    return (
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!venta) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Error al cargar la venta
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push("/catalogo")}
          sx={{ mt: 2 }}
        >
          Ir al catálogo
        </Button>
      </Box>
    );
  }

  return (
    <PageContainer title="Realizar Pago" description="Registrar pago de venta">
      <Box sx={{ p: 4 }}>
        <Typography variant="h3" gutterBottom>
          Realizar Pago
        </Typography>

        <Typography variant="body1" color="text.secondary" gutterBottom>
          Venta #{venta.id}
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 3,
            mt: 3,
          }}
        >
          {/* Columna izquierda: Formulario de pago */}
          <FormularioPago
            totalVenta={parseFloat(venta.total)}
            onDatosChange={setDatosPago}
          />

          {/* Columna derecha: Resumen */}
          <Box>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Resumen de la Venta
                </Typography>

                <Box sx={{ mt: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      ID de Venta:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      #{venta.id}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Estado:
                    </Typography>
                    <Typography variant="body1">{venta.estado}</Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Tipo:
                    </Typography>
                    <Typography variant="body1">
                      {venta.tipo_venta === "contado"
                        ? "Al Contado"
                        : "A Crédito"}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Fecha:
                    </Typography>
                    <Typography variant="body1">
                      {new Date(venta.fecha).toLocaleDateString()}
                    </Typography>
                  </Box>

                  {venta.tipo_venta === "credito" &&
                    venta.total_con_interes && (
                      <>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1,
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Subtotal:
                          </Typography>
                          <Typography variant="body1">
                            Bs {parseFloat(venta.total).toFixed(2)}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1,
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Interés:
                          </Typography>
                          <Typography variant="body1">
                            {venta.interes}%
                          </Typography>
                        </Box>
                      </>
                    )}

                  <Box
                    sx={{
                      mt: 3,
                      pt: 2,
                      borderTop: "2px solid",
                      borderColor: "divider",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="h5" fontWeight="bold">
                      Total a Pagar:
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color="primary">
                      Bs{" "}
                      {parseFloat(
                        venta.tipo_venta === "credito" &&
                          venta.total_con_interes
                          ? venta.total_con_interes
                          : venta.total
                      ).toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            {/* Botones */}
            <Box
              sx={{ mt: 3, display: "flex", gap: 2, flexDirection: "column" }}
            >
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleConfirmarPago}
                disabled={loadingPago || !datosPago}
                startIcon={
                  loadingPago && <CircularProgress size={20} color="inherit" />
                }
              >
                {loadingPago ? "Procesando pago..." : "Confirmar Pago"}
              </Button>

              <Button
                variant="outlined"
                size="large"
                fullWidth
                onClick={() => router.push("/ventas")}
                disabled={loadingPago}
              >
                Cancelar
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </PageContainer>
  );
}
