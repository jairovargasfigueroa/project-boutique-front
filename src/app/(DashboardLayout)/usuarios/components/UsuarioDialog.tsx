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
} from "@mui/material";

interface UsuarioFormData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  telefono: string;
  rol: "admin" | "vendedor" | "cliente";
  password?: string;
}

interface Props {
  open: boolean;
  mode: "create" | "edit";
  initialData?: UsuarioFormData;
  onClose: () => void;
  onSubmit: (data: UsuarioFormData) => void;
}

const UsuarioDialog = ({
  open,
  mode,
  initialData,
  onClose,
  onSubmit,
}: Props) => {
  const [formData, setFormData] = useState<UsuarioFormData>({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    telefono: "",
    rol: "cliente",
    password: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        telefono: "",
        rol: "cliente",
        password: "",
      });
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
          {mode === "create" ? "Agregar Usuario" : "Editar Usuario"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              name="username"
              label="Nombre de Usuario"
              value={formData.username}
              onChange={handleChange}
              required
              fullWidth
              inputProps={{ maxLength: 150 }}
            />
            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              name="first_name"
              label="Nombre"
              value={formData.first_name}
              onChange={handleChange}
              fullWidth
              inputProps={{ maxLength: 150 }}
            />
            <TextField
              name="last_name"
              label="Apellido"
              value={formData.last_name}
              onChange={handleChange}
              fullWidth
              inputProps={{ maxLength: 150 }}
            />
            <TextField
              name="telefono"
              label="Teléfono"
              value={formData.telefono}
              onChange={handleChange}
              fullWidth
              inputProps={{ maxLength: 15 }}
            />
            <TextField
              name="rol"
              label="Rol"
              select
              value={formData.rol}
              onChange={handleChange}
              required
              fullWidth
            >
              <MenuItem value="cliente">Cliente</MenuItem>
              <MenuItem value="vendedor">Vendedor</MenuItem>
              <MenuItem value="admin">Administrador</MenuItem>
            </TextField>
            {mode === "create" && (
              <TextField
                name="password"
                label="Contraseña"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                fullWidth
                inputProps={{ minLength: 8 }}
                helperText="Mínimo 8 caracteres"
              />
            )}
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

export default UsuarioDialog;
