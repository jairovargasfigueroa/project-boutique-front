"use client";
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  MenuItem,
  Divider,
  Alert,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
} from "@mui/material";
import { useCarritoVentaStore } from "@/store/carritoVentaStore";
import { ventaService } from "@/services/ventaService";
import { pagoService } from "@/services/pagoService";
import type { CrearVentaRequest } from "@/types/venta.types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const TIPOS_PAGO = [
  { value: "contado", label: "Contado" },
  { value: "credito", label: "Crédito" },
];

const METODOS_PAGO = [
  { value: "efectivo", label: "💵 Efectivo" },
  { value: "tarjeta", label: "💳 Tarjeta" },
  { value: "qr", label: "📱 Código QR" },
  { value: "transferencia", label: "🏦 Transferencia" },
];

const CobrarVentaDialog = ({ open, onClose, onSuccess }: Props) => {
  const { items, getTotal, clearCarrito } = useCarritoVentaStore();
  const [tipoPago, setTipoPago] = useState<"contado" | "credito">("contado");
  const [metodoPago, setMetodoPago] = useState<
    "efectivo" | "tarjeta" | "qr" | "transferencia"
  >("efectivo");
  const [referenciaPago, setReferenciaPago] = useState("");
  const [plazoMeses, setPlazoMeses] = useState(1);
  const [interes, setInteres] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = getTotal();

  // Calcular total con interés si es crédito
  const totalConInteres =
    tipoPago === "credito" ? subtotal * (1 + interes / 100) : subtotal;

  const cuotaMensual =
    tipoPago === "credito" ? totalConInteres / plazoMeses : 0;

  const handleConfirmarVenta = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validar que haya items
      if (items.length === 0) {
        setError("El carrito está vacío");
        return;
      }

      // Preparar datos según el nuevo formato del backend
      const ventaData: CrearVentaRequest = {
        tipo_pago: tipoPago,
        items: items.map((item) => ({
          variante_id: item.variante_id,
          cantidad: item.cantidad,
        })),
      };

      // Si es crédito, agregar campos adicionales
      if (tipoPago === "credito") {
        if (interes <= 0 || plazoMeses <= 0) {
          setError(
            "Para ventas a crédito, debes especificar interés y plazo válidos"
          );
          return;
        }
        ventaData.interes = interes;
        ventaData.plazo_meses = plazoMeses;
      }

      // Cliente null para venta anónima
      ventaData.cliente = null;

      // Paso 1: Crear venta
      const venta = await ventaService.crear(ventaData);
      console.log("✅ Venta creada:", venta);

      // Paso 2: Si es al contado, registrar pago inmediato
      if (tipoPago === "contado") {
        const pagoResult = await pagoService.pagarAlContado(venta.id, {
          metodo_pago: metodoPago,
          referencia_pago: referenciaPago || undefined,
        });

        console.log("✅ Pago registrado:", pagoResult);

        alert(
          `✅ Venta completada y pagada\n\n` +
            `Total: Bs ${parseFloat(venta.total).toFixed(2)}\n` +
            `Método: ${pagoService.formatearMetodoPago(metodoPago)}\n` +
            `${referenciaPago ? `Ref: ${referenciaPago}` : ""}`
        );
      } else {
        // Venta a crédito: solo confirmar creación
        alert(
          `✅ Venta a crédito registrada\n\n` +
            `Total con interés: Bs ${parseFloat(
              venta.total_con_interes || venta.total
            ).toFixed(2)}\n` +
            `${plazoMeses} cuotas de Bs ${parseFloat(
              venta.cuota_mensual || "0"
            ).toFixed(2)}`
        );
      }

      // Limpiar carrito y cerrar
      clearCarrito();
      onSuccess();
      onClose();

      // Reset form
      setTipoPago("contado");
      setMetodoPago("efectivo");
      setReferenciaPago("");
      setInteres(0);
      setPlazoMeses(1);
    } catch (err: any) {
      console.error("Error al procesar venta:", err);

      // Manejar errores específicos del backend
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Error al procesar la venta. Por favor, intenta nuevamente.";

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>💵 Cobrar Venta</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          {/* Mostrar error si existe */}
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Subtotal */}
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body1">Subtotal:</Typography>
            <Typography variant="body1" fontWeight={500}>
              Bs {subtotal.toFixed(2)}
            </Typography>
          </Box>

          <Divider />

          {/* Tipo de Pago */}
          <TextField
            select
            label="Tipo de Pago"
            fullWidth
            value={tipoPago}
            onChange={(e) =>
              setTipoPago(e.target.value as "contado" | "credito")
            }
          >
            {TIPOS_PAGO.map((tipo) => (
              <MenuItem key={tipo.value} value={tipo.value}>
                {tipo.label}
              </MenuItem>
            ))}
          </TextField>

          {/* Método de Pago (solo para contado) */}
          {tipoPago === "contado" && (
            <Box>
              <FormLabel component="legend">Método de Pago</FormLabel>
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
                label="Referencia de Pago (opcional)"
                fullWidth
                value={referenciaPago}
                onChange={(e) => setReferenciaPago(e.target.value)}
                helperText="Ej: Número de ticket, voucher, transacción"
                margin="normal"
              />
            </Box>
          )}

          {/* Campos adicionales para crédito */}
          {tipoPago === "credito" && (
            <>
              <Alert severity="info">
                Las ventas a crédito requieren especificar el interés y plazo en
                meses. Los pagos se realizarán posteriormente.
              </Alert>

              <Box display="flex" gap={2}>
                <TextField
                  label="Interés (%)"
                  type="number"
                  fullWidth
                  required
                  value={interes}
                  onChange={(e) =>
                    setInteres(Math.max(0, parseFloat(e.target.value) || 0))
                  }
                  helperText="Ej: 15 para 15%"
                />
                <TextField
                  label="Plazo (meses)"
                  type="number"
                  fullWidth
                  required
                  value={plazoMeses}
                  onChange={(e) =>
                    setPlazoMeses(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  helperText="Número de cuotas"
                />
              </Box>
            </>
          )}

          <Divider />

          {/* Total */}
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6">TOTAL:</Typography>
            <Typography variant="h6" color="primary">
              Bs {totalConInteres.toFixed(2)}
            </Typography>
          </Box>

          {/* Información de crédito */}
          {tipoPago === "credito" && interes > 0 && plazoMeses > 0 && (
            <Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="textSecondary">
                  Interés ({interes}%):
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Bs {(totalConInteres - subtotal).toFixed(2)}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" fontWeight={500}>
                  Cuota mensual:
                </Typography>
                <Typography variant="body2" fontWeight={500} color="primary">
                  Bs {cuotaMensual.toFixed(2)} × {plazoMeses} meses
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirmarVenta}
          disabled={loading || items.length === 0}
        >
          {loading
            ? "Procesando..."
            : tipoPago === "contado"
            ? "Confirmar y Pagar"
            : "Confirmar Venta"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CobrarVentaDialog;
