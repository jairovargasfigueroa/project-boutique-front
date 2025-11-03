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
  CircularProgress,
} from "@mui/material";
import { Producto } from "@/types/productos";
import { useCategorias } from "@/hooks/useCategorias";

interface Props {
  open: boolean;
  mode: "create" | "edit";
  initialData: Partial<Producto>;
  onClose: () => void;
  onSubmit: (data: Partial<Producto>) => Promise<void>;
}

const GENEROS = [
  { value: "Hombre", label: "Hombre" },
  { value: "Mujer", label: "Mujer" },
  { value: "Unisex", label: "Unisex" },
];

const ProductoDialog: React.FC<Props> = ({
  open,
  mode,
  initialData,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<Partial<Producto>>(initialData);
  const { categorias, loading: loadingCategorias } = useCategorias();

  useEffect(() => {
    setForm(initialData);
  }, [initialData]);

  const handleChange = (field: keyof Producto, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    await onSubmit(form);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {mode === "create" ? "Crear nuevo producto" : "Editar producto"}
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Nombre"
            fullWidth
            value={form.nombre || ""}
            onChange={(e) => handleChange("nombre", e.target.value)}
            required
          />

          <TextField
            label="Descripción"
            fullWidth
            multiline
            rows={3}
            value={form.descripcion || ""}
            onChange={(e) => handleChange("descripcion", e.target.value)}
          />

          <Box display="flex" gap={2}>
            <TextField
              select
              label="Categoría"
              fullWidth
              value={form.categoria || ""}
              onChange={(e) => handleChange("categoria", parseInt(e.target.value))}
              disabled={loadingCategorias}
              required
            >
              {loadingCategorias ? (
                <MenuItem disabled>
                  <CircularProgress size={20} />
                </MenuItem>
              ) : (
                categorias.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </MenuItem>
                ))
              )}
            </TextField>

            <TextField
              select
              label="Género"
              fullWidth
              value={form.genero || ""}
              onChange={(e) => handleChange("genero", e.target.value)}
              required
            >
              {GENEROS.map((genero) => (
                <MenuItem key={genero.value} value={genero.value}>
                  {genero.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box display="flex" gap={2}>
            <TextField
              label="Precio Base"
              fullWidth
              type="number"
              value={form.precio_base || ""}
              onChange={(e) =>
                handleChange("precio_base", parseFloat(e.target.value))
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
              required
            />

            <TextField
              label="Stock"
              fullWidth
              type="number"
              value={form.stock || 0}
              onChange={(e) => handleChange("stock", parseInt(e.target.value))}
              required
            />
          </Box>

          <TextField
            label="URL de Imagen"
            fullWidth
            value={form.imagen_url || ""}
            onChange={(e) => handleChange("imagen_url", e.target.value)}
            placeholder="https://ejemplo.com/imagen.jpg"
          />
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

export default ProductoDialog;
