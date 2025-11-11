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
} from "@mui/material";

interface CategoriaFormData {
  nombre: string;
  descripcion: string;
}

interface Props {
  open: boolean;
  mode: "create" | "edit";
  initialData?: CategoriaFormData;
  onClose: () => void;
  onSubmit: (data: CategoriaFormData) => void;
}

const CategoriaDialog = ({
  open,
  mode,
  initialData,
  onClose,
  onSubmit,
}: Props) => {
  const [formData, setFormData] = useState<CategoriaFormData>({
    nombre: "",
    descripcion: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ nombre: "", descripcion: "" });
    }
  }, [initialData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {mode === "create" ? "Agregar Categoría" : "Editar Categoría"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              name="nombre"
              label="Nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              fullWidth
              inputProps={{ maxLength: 30 }}
              helperText="Máximo 30 caracteres"
            />
            <TextField
              name="descripcion"
              label="Descripción"
              value={formData.descripcion}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              inputProps={{ maxLength: 120 }}
              helperText="Máximo 120 caracteres"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" color="primary">
            {mode === "create" ? "Crear" : "Guardar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CategoriaDialog;
