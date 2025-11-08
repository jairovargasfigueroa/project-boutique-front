"use client";
import { useState } from "react";
import {
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
} from "@mui/material";
import { IconEdit, IconCurrencyDollar } from "@tabler/icons-react";
import GenericTable from "@/components/common/GenericTable";
import type { Cuota } from "@/types/cuota.types";
import type { TableColumn } from "@/components/common/GenericTable/types";
import { usePagarCuota } from "@/hooks/usePagos";

interface Props {
  cuotas: Cuota[];
  loading?: boolean;
  onRefresh?: () => void;
}

const METODOS_PAGO = [
  { value: "efectivo", label: "💵 Efectivo" },
  { value: "tarjeta", label: "💳 Tarjeta" },
  { value: "qr", label: "📱 Código QR" },
  { value: "transferencia", label: "🏦 Transferencia" },
] as const;

const CuotasTable = ({ cuotas, loading, onRefresh }: Props) => {
  const { pagarCuota, procesando } = usePagarCuota();
  const [cuotaSeleccionada, setCuotaSeleccionada] = useState<Cuota | null>(null);
  const [dialogPagoOpen, setDialogPagoOpen] = useState(false);
  const [dialogEditOpen, setDialogEditOpen] = useState(false);
  const [metodoPago, setMetodoPago] = useState<"efectivo" | "tarjeta" | "qr" | "transferencia">("efectivo");
  const [referenciaPago, setReferenciaPago] = useState("");

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "pagada":
        return "success";
      case "vencida":
        return "error";
      default:
        return "warning";
    }
  };

  const handlePagar = (cuota: Cuota) => {
    setCuotaSeleccionada(cuota);
    setDialogPagoOpen(true);
  };

  const handleEditar = (cuota: Cuota) => {
    setCuotaSeleccionada(cuota);
    setDialogEditOpen(true);
  };

  const confirmarPago = async () => {
    if (!cuotaSeleccionada) return;

    try {
      await pagarCuota({
        cuota: cuotaSeleccionada.id,
        metodo_pago: metodoPago,
        referencia_pago: referenciaPago || undefined,
      });

      alert("✅ Cuota pagada exitosamente");
      setDialogPagoOpen(false);
      setMetodoPago("efectivo");
      setReferenciaPago("");

      if (onRefresh) onRefresh();
    } catch (error: any) {
      alert(error.message || "Error al procesar el pago");
    }
  };

  const columns: TableColumn[] = [
    {
      key: "numero_cuota",
      label: "# Cuota",
      width: "80px",
      render: (_val: any, cuota: Cuota) => `${cuota.numero_cuota}`,
    },
    {
      key: "fecha_vencimiento",
      label: "Vencimiento",
      width: "130px",
      render: (_val: any, cuota: Cuota) =>
        new Date(cuota.fecha_vencimiento).toLocaleDateString("es-BO"),
    },
    {
      key: "monto_cuota",
      label: "Monto",
      width: "120px",
      render: (_val: any, cuota: Cuota) =>
        `Bs ${parseFloat(cuota.monto_cuota).toFixed(2)}`,
    },
    {
      key: "estado",
      label: "Estado",
      width: "120px",
      render: (_val: any, cuota: Cuota) => cuota.estado_display,
    },
    {
      key: "fecha_pago",
      label: "Fecha Pago",
      width: "130px",
      render: (_val: any, cuota: Cuota) =>
        cuota.fecha_pago
          ? new Date(cuota.fecha_pago).toLocaleDateString("es-BO")
          : "-",
    },
  ];

  return (
    <>
      <GenericTable
        title="Cuotas"
        subtitle="Gestión de cuotas de la venta"
        columns={columns}
        data={cuotas}
        loading={loading}
        emptyMessage="No hay cuotas registradas"
        actions={(cuota: Cuota) => (
          <Box display="flex" gap={1}>
            {cuota.estado !== "pagada" && (
              <Tooltip title="Pagar Cuota">
                <IconButton
                  color="success"
                  size="small"
                  onClick={() => handlePagar(cuota)}
                >
                  <IconCurrencyDollar size={20} />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Editar Cuota">
              <IconButton
                color="primary"
                size="small"
                onClick={() => handleEditar(cuota)}
              >
                <IconEdit size={20} />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      />

      {/* Dialog de Pago */}
      <Dialog
        open={dialogPagoOpen}
        onClose={() => setDialogPagoOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>💳 Pagar Cuota</DialogTitle>
        <DialogContent>
          {cuotaSeleccionada && (
            <Box display="flex" flexDirection="column" gap={2} mt={1}>
              <Box display="flex" justifyContent="space-between">
                <span>Cuota:</span>
                <strong>#{cuotaSeleccionada.numero_cuota}</strong>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <span>Monto:</span>
                <strong>
                  Bs {parseFloat(cuotaSeleccionada.monto_cuota).toFixed(2)}
                </strong>
              </Box>

              <FormLabel>Método de Pago</FormLabel>
              <RadioGroup
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value as any)}
              >
                {METODOS_PAGO.map((metodo) => (
                  <FormControlLabel
                    key={metodo.value}
                    value={metodo.value}
                    control={<Radio />}
                    label={metodo.label}
                  />
                ))}
              </RadioGroup>

              <TextField
                label="Referencia (opcional)"
                fullWidth
                value={referenciaPago}
                onChange={(e) => setReferenciaPago(e.target.value)}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDialogPagoOpen(false)}
            disabled={procesando}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={confirmarPago}
            disabled={procesando}
          >
            {procesando ? "Procesando..." : "Confirmar Pago"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Editar */}
      <Dialog
        open={dialogEditOpen}
        onClose={() => setDialogEditOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>✏️ Editar Cuota</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Fecha de Vencimiento"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              defaultValue={cuotaSeleccionada?.fecha_vencimiento}
            />
            <TextField
              label="Monto"
              type="number"
              fullWidth
              defaultValue={cuotaSeleccionada?.monto_cuota}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogEditOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={() => setDialogEditOpen(false)}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CuotasTable;
