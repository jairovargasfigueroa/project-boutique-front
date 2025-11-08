"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { ProductoVariante } from "@/types/productos";

interface Props {
  open: boolean;
  mode: "create" | "edit";
  productoId: number;
  initialData: Partial<ProductoVariante>;
  onClose: () => void;
  onSubmit: (data: Partial<ProductoVariante>) => Promise<void>;
}

const TALLAS = [
  { value: "XS", label: "Extra Small" },
  { value: "S", label: "Small" },
  { value: "M", label: "Medium" },
  { value: "L", label: "Large" },
  { value: "XL", label: "Extra Large" },
  { value: "XXL", label: "Double Extra Large" },
];

const VarianteDialog: React.FC<Props> = ({
  open,
  mode,
  productoId,
  initialData,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<Partial<ProductoVariante>>({
    ...initialData,
    producto: productoId,
  });

  useEffect(() => {
    setForm({
      ...initialData,
      producto: productoId,
    });
  }, [initialData, productoId]);

  const handleChange = (field: keyof ProductoVariante, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    await onSubmit(form);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {mode === "create" ? "Crear nueva variante" : "Editar variante"}
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <Box display="flex" gap={2}>
            <TextField
              select
              label="Talla"
              fullWidth
              value={form.talla || ""}
              onChange={(e) => handleChange("talla", e.target.value)}
            >
              {TALLAS.map((talla) => (
                <MenuItem key={talla.value} value={talla.value}>
                  {talla.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Color"
              fullWidth
              value={form.color || ""}
              onChange={(e) => handleChange("color", e.target.value)}
            />
          </Box>

          <Box display="flex" gap={2}>
            <TextField
              label="Precio de Venta"
              fullWidth
              type="number"
              value={form.precio_venta || ""}
              onChange={(e) =>
                handleChange("precio_venta", parseFloat(e.target.value))
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
            />

            <TextField
              label="Precio de Costo"
              fullWidth
              type="number"
              value={form.precio_costo || ""}
              onChange={(e) =>
                handleChange("precio_costo", parseFloat(e.target.value))
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
            />
          </Box>

          <Box display="flex" gap={2}>
            <TextField
              label="Stock"
              fullWidth
              type="number"
              value={form.stock || ""}
              onChange={(e) => handleChange("stock", parseInt(e.target.value))}
            />

            <TextField
              label="Stock Mínimo"
              fullWidth
              type="number"
              value={form.stock_minimo || ""}
              onChange={(e) =>
                handleChange("stock_minimo", parseInt(e.target.value))
              }
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSave}>
          {mode === "create" ? "Crear" : "Actualizar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VarianteDialog;
