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
  InputAdornment,
} from "@mui/material";
import { VarianteProductoCreate, VarianteProductoUpdate } from "@/types/productos";

interface Props {
  open: boolean;
  mode: "create" | "edit";
  productoId: number;
  initialData?: VarianteProductoCreate | VarianteProductoUpdate;
  onClose: () => void;
  onSubmit: (data: VarianteProductoCreate | VarianteProductoUpdate) => Promise<void>;
}

const VarianteDialog: React.FC<Props> = ({
  open,
  mode,
  productoId,
  initialData,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<VarianteProductoCreate | VarianteProductoUpdate>({
    talla: "",
    precio: 0,
    stock: 0,
    stock_minimo: 0,
    producto: productoId,
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        talla: "",
        precio: 0,
        stock: 0,
        stock_minimo: 0,
        producto: productoId,
      });
    }
  }, [initialData, productoId, open]);

  const handleChange = (field: string, value: any) => {
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
          {/* Talla como campo de texto libre */}
          <TextField
            label="Talla"
            fullWidth
            value={form.talla || ""}
            onChange={(e) => handleChange("talla", e.target.value)}
            placeholder="Ej: XS, S, M, L, XL, 38, 40, 42, etc."
            helperText="Ingresa cualquier talla (letras o números)"
          />

          {/* Precio */}
          <TextField
            label="Precio"
            fullWidth
            type="number"
            value={form.precio || ""}
            onChange={(e) =>
              handleChange("precio", parseFloat(e.target.value))
            }
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">Bs.</InputAdornment>
              ),
            }}
          />

          {/* Stock y Stock Mínimo */}
          <Box display="flex" gap={2}>
            <TextField
              label="Stock"
              fullWidth
              type="number"
              value={form.stock || ""}
              onChange={(e) => handleChange("stock", parseInt(e.target.value))}
              required
            />

            <TextField
              label="Stock Mínimo"
              fullWidth
              type="number"
              value={form.stock_minimo || ""}
              onChange={(e) =>
                handleChange("stock_minimo", parseInt(e.target.value))
              }
              required
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
