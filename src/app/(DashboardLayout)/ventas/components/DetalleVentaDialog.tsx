"use client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Chip,
  Alert,
  IconButton,
  Collapse,
  CircularProgress,
} from "@mui/material";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import type { Venta } from "@/types/venta.types";
import { useVentaDetalle } from "@/hooks/useVentas";
import { useCuotas } from "@/hooks/useCuotas";
import { usePagos } from "@/hooks/usePagos";
import { pagoService } from "@/services/pagoService";
import CuotasTable from "./CuotasTable";

interface Props {
  open: boolean;
  venta: Venta | null;
  onClose: () => void;
  onRefresh?: () => void;
}

const DetalleVentaDialog = ({ open, venta: ventaInicial, onClose, onRefresh }: Props) => {
  const { venta: ventaCompleta, loading: loadingVenta, refetch: refetchVenta } = useVentaDetalle(ventaInicial?.id);
  const { cuotas, loading: loadingCuotas, refetch: refetchCuotas } = useCuotas(ventaInicial?.id);
  const { pagos, loading: loadingPagos, refetch: refetchPagos } = usePagos(ventaInicial?.id);
  const [showItems, setShowItems] = useState(true);
  const [showPagos, setShowPagos] = useState(true);

  // Usar la venta completa si está disponible, sino usar la inicial
  const venta = ventaCompleta || ventaInicial;

  useEffect(() => {
    if (open && ventaInicial) {
      refetchVenta();
      if (ventaInicial.tipo_pago === "credito") {
        refetchCuotas();
      }
      refetchPagos();
    }
  }, [open, ventaInicial?.id]);

  const handleRefreshAll = async () => {
    await Promise.all([refetchVenta(), refetchCuotas(), refetchPagos()]);
    if (onRefresh) onRefresh();
  };

  if (!venta) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">📄 Detalle de Venta #{venta.id}</Typography>
          <Chip
            label={venta.tipo_pago === "contado" ? "Contado" : "Crédito"}
            color={venta.tipo_pago === "contado" ? "primary" : "secondary"}
          />
        </Box>
      </DialogTitle>

      <DialogContent>
        {loadingVenta ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" gap={3}>
          {/* Información General */}
          <Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2" color="text.secondary">
                Cliente:
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {venta.cliente_nombre || "Cliente Anónimo"}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2" color="text.secondary">
                Fecha:
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {new Date(venta.fecha).toLocaleDateString("es-BO", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2" color="text.secondary">
                Estado de Pago:
              </Typography>
              <Chip
                label={
                  venta.estado_pago === "pagado"
                    ? "Pagado"
                    : venta.estado_pago === "parcial"
                    ? "Parcial"
                    : "Pendiente"
                }
                color={
                  venta.estado_pago === "pagado"
                    ? "success"
                    : venta.estado_pago === "parcial"
                    ? "warning"
                    : "error"
                }
                size="small"
              />
            </Box>
            {/* Información de Crédito */}
            {venta.tipo_pago === "credito" && (
              <>
                <Divider sx={{ my: 1 }} />
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="body2" color="text.secondary">
                    Subtotal:
                  </Typography>
                  <Typography variant="body2">
                    Bs {parseFloat(venta.total).toFixed(2)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="body2" color="text.secondary">
                    Interés ({venta.interes || 0}%):
                  </Typography>
                  <Typography variant="body2" color="warning.main">
                    + Bs {(parseFloat(venta.total_con_interes || venta.total) - parseFloat(venta.total)).toFixed(2)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="body2" color="text.secondary">
                    Plazo:
                  </Typography>
                  <Typography variant="body2">
                    {venta.plazo_meses} meses × Bs {parseFloat(venta.cuota_mensual || "0").toFixed(2)}
                  </Typography>
                </Box>
              </>
            )}
            
            <Box display="flex" justifyContent="space-between" mt={1}>
              <Typography variant="h6">
                {venta.tipo_pago === "credito" ? "Total con Interés:" : "Total:"}
              </Typography>
              <Typography variant="h6" color="primary">
                Bs {parseFloat(venta.tipo_pago === "credito" && venta.total_con_interes ? venta.total_con_interes : venta.total).toFixed(2)}
              </Typography>
            </Box>
          </Box>

          <Divider />

          {/* Items de la Venta */}
          <Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ cursor: "pointer" }}
              onClick={() => setShowItems(!showItems)}
            >
              <Typography variant="h6">
                📦 Items ({venta.detalles?.length || 0})
              </Typography>
              <IconButton size="small">
                {showItems ? <IconChevronUp /> : <IconChevronDown />}
              </IconButton>
            </Box>
            <Collapse in={showItems}>
              <Box mt={2}>
                {venta.detalles && venta.detalles.length > 0 ? (
                  venta.detalles.map((detalle) => (
                    <Box
                      key={detalle.id}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      p={1.5}
                      mb={1}
                      sx={{
                        backgroundColor: "grey.100",
                        borderRadius: 1,
                      }}
                    >
                      <Box flex={1}>
                        <Typography variant="body2" fontWeight={500}>
                          {detalle.producto_nombre}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Talla: {detalle.talla} | Color: {detalle.color}
                        </Typography>
                      </Box>
                      <Box textAlign="right">
                        <Typography variant="body2">
                          {detalle.cantidad} × Bs{" "}
                          {parseFloat(detalle.precio_unitario).toFixed(2)}
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          Bs {parseFloat(detalle.subtotal).toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Alert severity="info">No hay detalles disponibles</Alert>
                )}
              </Box>
            </Collapse>
          </Box>

          {/* Cuotas (solo para ventas a crédito) - Usando CuotasTable */}
          {venta.tipo_pago === "credito" && (
            <>
              <Divider />
              <CuotasTable
                cuotas={cuotas}
                loading={loadingCuotas}
                onRefresh={handleRefreshAll}
              />
            </>
          )}

          {/* Historial de Pagos */}
          <Divider />
          <Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ cursor: "pointer" }}
              onClick={() => setShowPagos(!showPagos)}
            >
              <Typography variant="h6">
                💰 Historial de Pagos ({pagos.length})
              </Typography>
              <IconButton size="small">
                {showPagos ? <IconChevronUp /> : <IconChevronDown />}
              </IconButton>
            </Box>

            <Collapse in={showPagos}>
              <Box mt={2}>
                {/* Resumen de Pagos */}
                {pagos.length > 0 && (
                  <Box mb={2}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" color="text.secondary">
                        Total Pagado:
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="success.main"
                      >
                        Bs {pagoService.calcularTotalPagado(pagos).toFixed(2)}
                      </Typography>
                    </Box>
                    {venta.tipo_pago === "credito" && (
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          Saldo Pendiente:
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color="error.main"
                        >
                          Bs{" "}
                          {pagoService
                            .calcularSaldoPendiente(
                              venta.total_con_interes || venta.total,
                              pagos
                            )
                            .toFixed(2)}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}

                {/* Lista de Pagos */}
                {loadingPagos ? (
                  <Box textAlign="center" py={2}>
                    <Typography variant="body2" color="text.secondary">
                      Cargando pagos...
                    </Typography>
                  </Box>
                ) : pagos.length > 0 ? (
                  <Box maxHeight="300px" overflow="auto">
                    {pagos.map((pago) => (
                      <Box
                        key={pago.id}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        p={1.5}
                        mb={1}
                        sx={{
                          backgroundColor: "success.light",
                          borderRadius: 1,
                        }}
                      >
                        <Box flex={1}>
                          <Typography variant="body2" fontWeight={500}>
                            {pagoService.formatearMetodoPago(pago.metodo_pago)}
                            {pago.cuota_numero &&
                              ` - Cuota ${pago.cuota_numero}`}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(pago.fecha_pago).toLocaleDateString(
                              "es-BO",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </Typography>
                          {pago.referencia_pago && (
                            <Typography
                              variant="caption"
                              display="block"
                              color="text.secondary"
                            >
                              Ref: {pago.referencia_pago}
                            </Typography>
                          )}
                        </Box>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color="success.dark"
                        >
                          Bs {parseFloat(pago.monto_pagado).toFixed(2)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Alert severity="info">
                    No hay pagos registrados{" "}
                    {venta.tipo_pago === "credito" && "aún"}
                  </Alert>
                )}
              </Box>
            </Collapse>
          </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetalleVentaDialog;
