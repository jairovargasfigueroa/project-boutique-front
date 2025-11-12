"use client";
import { useState, useMemo } from "react";
import {
  Box,
  Chip,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import { IconEye, IconX } from "@tabler/icons-react";
import GenericTable from "@/components/common/GenericTable";
import type { Venta } from "@/types/ventas";
import type { TableColumn } from "@/components/common/GenericTable/types";
import { useVentas } from "@/hooks/useVentas";
import { ventaService } from "@/services/ventaService";

interface Props {
  onVerDetalle: (venta: Venta) => void;
}

type FiltroTab = "todos" | "contado" | "credito" | "no_pagado";

const VentasTable = ({ onVerDetalle }: Props) => {
  const { ventas, loading, refetch } = useVentas();
  const [filtroActivo, setFiltroActivo] = useState<FiltroTab>("todos");
  const [cancelarDialogOpen, setCancelarDialogOpen] = useState(false);
  const [ventaACancelar, setVentaACancelar] = useState<Venta | null>(null);
  const [cancelando, setCancelando] = useState(false);

  // Filtrar ventas según el tab activo
  const ventasFiltradas = useMemo(() => {
    let filtradas = ventas;

    switch (filtroActivo) {
      case "contado":
        filtradas = ventas.filter((v) => v.tipo_venta === "contado");
        break;
      case "credito":
        filtradas = ventas.filter((v) => v.tipo_venta === "credito");
        break;
      case "no_pagado":
        filtradas = ventas.filter(
          (v) => v.estado === "pendiente" || v.estado === "parcial"
        );
        break;
      default:
        filtradas = ventas;
    }

    return filtradas;
  }, [ventas, filtroActivo]);

  const handleCancelarVenta = (venta: Venta) => {
    setVentaACancelar(venta);
    setCancelarDialogOpen(true);
  };

  const confirmarCancelacion = async () => {
    if (!ventaACancelar) return;

    try {
      setCancelando(true);
      await ventaService.cancelar(ventaACancelar.id);
      setCancelarDialogOpen(false);
      setVentaACancelar(null);
      refetch(); // Recargar la lista
    } catch (error: any) {
      console.error("Error al cancelar venta:", error);
      alert(
        error.response?.data?.error ||
          "Error al cancelar la venta. Intenta nuevamente."
      );
    } finally {
      setCancelando(false);
    }
  };

  const getEstadoPagoColor = (estado: string) => {
    switch (estado) {
      case "pagado":
        return "success";
      case "parcial":
        return "warning";
      case "pendiente":
        return "error";
      case "cancelada":
        return "default";
      default:
        return "default";
    }
  };

  const getTipoPagoColor = (tipo: string) => {
    return tipo === "contado" ? "primary" : "secondary";
  };

  const columns: TableColumn[] = [
    {
      key: "id",
      label: "# Venta",
      width: "80px",
      render: (_value: any, venta: Venta) => `#${venta.id}`,
    },
    {
      key: "fecha",
      label: "Fecha",
      width: "130px",
      render: (_value: any, venta: Venta) =>
        new Date(venta.fecha).toLocaleDateString("es-BO"),
    },
    {
      key: "cliente",
      label: "Cliente",
      width: "200px",
      render: (_value: any, venta: Venta) =>
        venta.cliente_nombre || "Cliente Anónimo",
    },
    {
      key: "tipo_venta",
      label: "Tipo",
      width: "120px",
      render: (_value: any, venta: Venta) => (
        <Chip
          label={venta.tipo_venta === "contado" ? "Contado" : "Crédito"}
          color={getTipoPagoColor(venta.tipo_venta) as any}
          size="small"
        />
      ),
    },
    {
      key: "total",
      label: "Total",
      width: "120px",
      render: (_value: any, venta: Venta) => {
        const total =
          venta.tipo_venta === "credito" && venta.total_con_interes
            ? parseFloat(venta.total_con_interes)
            : parseFloat(venta.total);
        return `Bs ${total.toFixed(2)}`;
      },
    },
    {
      key: "estado",
      label: "Estado",
      width: "120px",
      render: (_value: any, venta: Venta) => (
        <Chip
          label={venta.estado.charAt(0).toUpperCase() + venta.estado.slice(1)}
          color={getEstadoPagoColor(venta.estado) as any}
          size="small"
        />
      ),
    },
    {
      key: "cuotas",
      label: "Info Crédito",
      width: "180px",
      render: (_value: any, venta: Venta) =>
        venta.tipo_venta === "credito" ? (
          <Box>
            <Box fontSize="0.875rem">
              {venta.plazo_meses} cuotas × Bs{" "}
              {parseFloat(venta.cuota_mensual || "0").toFixed(2)}
            </Box>
            <Box fontSize="0.75rem" color="text.secondary">
              Interés: {venta.interes}%
            </Box>
          </Box>
        ) : (
          <Box fontSize="0.875rem" color="text.secondary">
            Pago único
          </Box>
        ),
    },
  ];

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Tabs
          value={filtroActivo}
          onChange={(_, newValue) => setFiltroActivo(newValue)}
          indicatorColor="primary"
          textColor="primary"
          sx={{
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Tab label="Todos" value="todos" />
          <Tab label="Contado" value="contado" />
          <Tab label="Crédito" value="credito" />
          <Tab label="No Pagado" value="no_pagado" />
        </Tabs>
      </Box>

      <GenericTable
        title="Ventas Registradas"
        subtitle={`${
          filtroActivo === "todos"
            ? "Historial de todas las ventas realizadas"
            : filtroActivo === "contado"
            ? "Ventas al contado"
            : filtroActivo === "credito"
            ? "Ventas a crédito"
            : "Ventas pendientes de pago"
        }`}
        columns={columns}
        data={ventasFiltradas}
        loading={loading}
        emptyMessage={`No hay ventas ${
          filtroActivo === "todos"
            ? "registradas"
            : filtroActivo === "contado"
            ? "al contado"
            : filtroActivo === "credito"
            ? "a crédito"
            : "sin pagar"
        }`}
        actions={(row: Venta) => (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Ver Detalle">
              <IconButton
                color="primary"
                size="small"
                onClick={() => onVerDetalle(row)}
              >
                <IconEye size={20} />
              </IconButton>
            </Tooltip>
            {row.estado !== "cancelada" && (
              <Tooltip title="Cancelar Venta">
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => handleCancelarVenta(row)}
                >
                  <IconX size={20} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )}
      />

      {/* Diálogo de Confirmación para Cancelar */}
      <Dialog
        open={cancelarDialogOpen}
        onClose={() => !cancelando && setCancelarDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cancelar Venta</DialogTitle>
        <DialogContent>
          {ventaACancelar && (
            <>
              <Alert severity="warning" sx={{ mb: 2 }}>
                ⚠️ Esta acción no se puede deshacer
              </Alert>
              <Typography variant="body1" gutterBottom>
                ¿Estás seguro de que deseas cancelar la siguiente venta?
              </Typography>
              <Box sx={{ mt: 2, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
                <Typography variant="body2">
                  <strong>Venta #:</strong> {ventaACancelar.id}
                </Typography>
                <Typography variant="body2">
                  <strong>Cliente:</strong>{" "}
                  {ventaACancelar.cliente_nombre || "Cliente Anónimo"}
                </Typography>
                <Typography variant="body2">
                  <strong>Total:</strong> Bs{" "}
                  {parseFloat(ventaACancelar.total).toFixed(2)}
                </Typography>
                <Typography variant="body2">
                  <strong>Tipo:</strong>{" "}
                  {ventaACancelar.tipo_venta === "contado"
                    ? "Contado"
                    : "Crédito"}
                </Typography>
                <Typography variant="body2">
                  <strong>Estado Actual:</strong>{" "}
                  {ventaACancelar.estado.charAt(0).toUpperCase() +
                    ventaACancelar.estado.slice(1)}
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setCancelarDialogOpen(false)}
            disabled={cancelando}
          >
            No, mantener venta
          </Button>
          <Button
            onClick={confirmarCancelacion}
            variant="contained"
            color="error"
            disabled={cancelando}
          >
            {cancelando ? "Cancelando..." : "Sí, cancelar venta"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VentasTable;
