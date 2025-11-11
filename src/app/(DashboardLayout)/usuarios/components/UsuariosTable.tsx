"use client";
import { IconButton, Button, Box, Chip } from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import GenericTable from "@/components/common/GenericTable";
import { UsuarioListItem } from "@/services/usuarioService";

interface Props {
  usuarios: UsuarioListItem[];
  loading: boolean;
  onEdit: (usuario: UsuarioListItem) => void;
  onDelete: (usuario: UsuarioListItem) => void;
  onCreate: () => void;
}

const UsuariosTable = ({
  usuarios,
  loading,
  onEdit,
  onDelete,
  onCreate,
}: Props) => {
  // Configuración de columnas
  const usuarioColumns = [
    {
      key: "id",
      label: "ID",
      align: "center" as const,
      render: (value: number) => (
        <Chip label={`#${value}`} size="small" color="default" />
      ),
    },
    {
      key: "username",
      label: "Usuario",
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "first_name",
      label: "Nombre Completo",
      render: (_: any, usuario: UsuarioListItem) => {
        const nombreCompleto = `${usuario.first_name} ${usuario.last_name}`.trim();
        return nombreCompleto || "-";
      },
    },
    {
      key: "rol",
      label: "Rol",
      align: "center" as const,
      render: (value: string) => {
        const colorMap: Record<string, "primary" | "secondary" | "info"> = {
          admin: "primary",
          vendedor: "secondary",
          cliente: "info",
        };
        return (
          <Chip
            label={value.toUpperCase()}
            size="small"
            color={colorMap[value] || "default"}
          />
        );
      },
    },
    {
      key: "telefono",
      label: "Teléfono",
      render: (value: string) => value || "-",
    },
  ];

  // Acciones para cada fila
  const renderActions = (usuario: UsuarioListItem) => (
    <Box sx={{ display: "flex", gap: 1 }}>
      <IconButton
        size="small"
        color="secondary"
        onClick={() => onEdit(usuario)}
        title="Editar"
      >
        <Edit />
      </IconButton>
      <IconButton
        size="small"
        color="error"
        onClick={() => onDelete(usuario)}
        title="Eliminar"
      >
        <Delete />
      </IconButton>
    </Box>
  );

  // Botón para el header
  const headerAction = (
    <Button variant="contained" startIcon={<Add />} onClick={onCreate}>
      Agregar Usuario
    </Button>
  );

  return (
    <GenericTable
      title="Gestión de Usuarios"
      subtitle="Administra todos los usuarios del sistema"
      columns={usuarioColumns}
      data={usuarios}
      loading={loading}
      emptyMessage="No hay usuarios registrados"
      actions={renderActions}
      action={headerAction}
    />
  );
};

export default UsuariosTable;
