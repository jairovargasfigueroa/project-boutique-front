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
  InputAdornment,
  Divider,
} from "@mui/material";
import { useCarritoVentaStore } from "@/store/carritoVentaStore";
import { ventaService } from "@/services/ventaService";
import { CrearVentaRequest } from "@/types/ventas";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const METODOS_PAGO = [
  { value: "Efectivo", label: "Efectivo" },
  { value: "Tarjeta", label: "Tarjeta de Crédito/Débito" },
  { value: "QR", label: "Código QR" },
  { value: "Transferencia", label: "Transferencia Bancaria" },
];

const TIPOS_VENTA = [
  { value: "Contado", label: "Contado" },
  { value: "Credito", label: "Crédito" },
];

const CobrarVentaDialog = ({ open, onClose, onSuccess }: Props) => {
  const { items, getTotal, clearCarrito } = useCarritoVentaStore();
  const [descuento, setDescuento] = useState(0);
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [tipoVenta, setTipoVenta] = useState("Contado");
  const [plazoMeses, setPlazoMeses] = useState(1);
  const [interes, setInteres] = useState(0);
  const [loading, setLoading] = useState(false);

  const subtotal = getTotal();
  const totalConDescuento = subtotal - descuento;
  const totalConInteres = tipoVenta === "Credito" 
    ? totalConDescuento * (1 + interes / 100)
    : totalConDescuento;

  const handleConfirmarVenta = async () => {
    try {
      setLoading(true);

      const ventaData: CrearVentaRequest = {
        tipo_venta: tipoVenta,
        estado: "Completada",
        items: items.map((item) => ({
          variante_id: item.variante_id,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
        })),
        pago: {
          metodo: metodoPago,
          monto: totalConInteres,
        },
      };

      if (tipoVenta === "Credito") {
        ventaData.plazo_meses = plazoMeses;
        ventaData.interes = interes;
      }

      await ventaService.create(ventaData);

      // Limpiar carrito y cerrar
      clearCarrito();
      alert("Venta registrada exitosamente");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error al registrar venta:", error);
      alert("Error al registrar la venta. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>💵 Cobrar Venta</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          {/* Subtotal */}
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body1">Subtotal:</Typography>
            <Typography variant="body1" fontWeight={500}>
              Bs {subtotal.toFixed(2)}
            </Typography>
          </Box>

          {/* Descuento */}
          <TextField
            label="Descuento"
            type="number"
            fullWidth
            value={descuento}
            onChange={(e) => setDescuento(Math.max(0, parseFloat(e.target.value) || 0))}
            InputProps={{
              startAdornment: <InputAdornment position="start">Bs</InputAdornment>,
            }}
          />

          <Divider />

          {/* Tipo de Venta */}
          <TextField
            select
            label="Tipo de Venta"
            fullWidth
            value={tipoVenta}
            onChange={(e) => setTipoVenta(e.target.value)}
          >
            {TIPOS_VENTA.map((tipo) => (
              <MenuItem key={tipo.value} value={tipo.value}>
                {tipo.label}
              </MenuItem>
            ))}
          </TextField>

          {/* Campos adicionales para crédito */}
          {tipoVenta === "Credito" && (
            <>
              <Box display="flex" gap={2}>
                <TextField
                  label="Plazo (meses)"
                  type="number"
                  fullWidth
                  value={plazoMeses}
                  onChange={(e) => setPlazoMeses(Math.max(1, parseInt(e.target.value) || 1))}
                />
                <TextField
                  label="Interés (%)"
                  type="number"
                  fullWidth
                  value={interes}
                  onChange={(e) => setInteres(Math.max(0, parseFloat(e.target.value) || 0))}
                />
              </Box>
            </>
          )}

          {/* Método de Pago */}
          <TextField
            select
            label="Método de Pago"
            fullWidth
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
          >
            {METODOS_PAGO.map((metodo) => (
              <MenuItem key={metodo.value} value={metodo.value}>
                {metodo.label}
              </MenuItem>
            ))}
          </TextField>

          <Divider />

          {/* Total */}
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6">TOTAL:</Typography>
            <Typography variant="h6" color="primary">
              Bs {totalConInteres.toFixed(2)}
            </Typography>
          </Box>

          {tipoVenta === "Credito" && (
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="textSecondary">
                Cuota mensual:
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Bs {(totalConInteres / plazoMeses).toFixed(2)}
              </Typography>
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
          disabled={loading}
        >
          {loading ? "Procesando..." : "Confirmar Venta"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CobrarVentaDialog;
