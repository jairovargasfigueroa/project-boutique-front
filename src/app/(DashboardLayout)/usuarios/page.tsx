"use client";
import React, { useState } from "react";
import { Box } from "@mui/material";
import { useUsuarios } from "@/hooks/useUsuarios";
import { UsuarioListItem } from "@/services/usuarioService";
import UsuariosTable from "./components/UsuariosTable";
import UsuarioDialog from "./components/UsuarioDialog";
import FiltroRoles from "./components/FiltroRoles";

interface UsuarioFormData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  telefono: string;
  rol: "admin" | "vendedor" | "cliente";
  password?: string;
}

export default function UsuariosPage() {
  const [filtroRol, setFiltroRol] = useState<string | undefined>(undefined);
  const { 
    usuarios, 
    loading, 
    error, 
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
  } = useUsuarios(filtroRol);

  const [openDialog, setOpenDialog] = useState(false);
  const [modo, setModo] = useState<"create" | "edit">("create");
  const [usuarioSeleccionado, setUsuarioSeleccionado] =
    useState<UsuarioListItem | null>(null);

  const handleNew = () => {
    setModo("create");
    setUsuarioSeleccionado(null);
    setOpenDialog(true);
  };

  const handleEdit = (usuario: UsuarioListItem) => {
    setModo("edit");
    setUsuarioSeleccionado(usuario);
    setOpenDialog(true);
  };

  const handleSubmit = async (data: UsuarioFormData) => {
    try {
      if (modo === "create") {
        await crearUsuario(data);
      } else if (usuarioSeleccionado) {
        // En modo edición, removemos el password del objeto
        const { password, ...updateData } = data;
        await actualizarUsuario(usuarioSeleccionado.id, updateData);
      }
      setOpenDialog(false);
    } catch (error) {
      console.error("Error al guardar usuario:", error);
    }
  };

  const handleDelete = async (usuario: UsuarioListItem) => {
    if (
      confirm(
        `¿Eliminar el usuario "${usuario.username}"? Esta acción no se puede deshacer.`
      )
    ) {
      try {
        await eliminarUsuario(usuario.id);
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
      }
    }
  };

  return (
    <Box>
      <FiltroRoles rolActivo={filtroRol} onChange={setFiltroRol} />

      <UsuariosTable
        usuarios={usuarios}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleNew}
      />

      {error && (
        <Box color="error.main" mt={2}>
          Error: {error}
        </Box>
      )}

      <UsuarioDialog
        open={openDialog}
        mode={modo}
        initialData={
          usuarioSeleccionado
            ? {
                username: usuarioSeleccionado.username,
                email: usuarioSeleccionado.email,
                first_name: usuarioSeleccionado.first_name,
                last_name: usuarioSeleccionado.last_name,
                telefono: usuarioSeleccionado.telefono || "",
                rol: usuarioSeleccionado.rol,
              }
            : undefined
        }
        onClose={() => setOpenDialog(false)}
        onSubmit={handleSubmit}
      />
    </Box>
  );
}
