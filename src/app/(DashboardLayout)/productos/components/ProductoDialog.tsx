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
  CircularProgress,
  Typography,
  Avatar,
} from "@mui/material";
import { ProductoCreate, ProductoUpdate } from "@/types/productos";
import { useCategorias } from "@/hooks/useCategorias";
import ImageIcon from "@mui/icons-material/Image";

interface Props {
  open: boolean;
  mode: "create" | "edit";
  initialData?: ProductoCreate | ProductoUpdate;
  onClose: () => void;
  onSubmit: (data: ProductoCreate | ProductoUpdate) => Promise<void>;
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
  const [form, setForm] = useState<ProductoCreate | ProductoUpdate>({
    nombre: "",
    descripcion: "",
    genero: "",
    marca: "",
    categoria: 0,
    image: undefined,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { categorias, loading: loadingCategorias } = useCategorias();

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        image: undefined, // No enviar imagen si no se selecciona nueva
      });
      setImagePreview(null);
    } else {
      setForm({
        nombre: "",
        descripcion: "",
        genero: "",
        marca: "",
        categoria: 0,
        image: undefined,
      });
      setImagePreview(null);
    }
  }, [initialData, open]);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));

      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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

          <TextField
            label="Marca"
            fullWidth
            value={form.marca || ""}
            onChange={(e) => handleChange("marca", e.target.value)}
            required
          />

          <Box display="flex" gap={2}>
            <TextField
              select
              label="Categoría"
              fullWidth
              value={form.categoria || ""}
              onChange={(e) =>
                handleChange("categoria", parseInt(e.target.value))
              }
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

          {/* Upload de imagen */}
          <Box>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<ImageIcon />}
            >
              {form.image ? "Cambiar imagen" : "Seleccionar imagen"}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </Button>

            {imagePreview && (
              <Box mt={2} display="flex" justifyContent="center">
                <Avatar
                  src={imagePreview}
                  variant="rounded"
                  sx={{ width: 120, height: 120 }}
                />
              </Box>
            )}

            {form.image && (
              <Typography variant="caption" display="block" mt={1}>
                Archivo seleccionado: {form.image.name}
              </Typography>
            )}
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

export default ProductoDialog;
