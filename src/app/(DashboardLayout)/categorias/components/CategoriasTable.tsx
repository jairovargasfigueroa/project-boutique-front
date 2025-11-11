"use client";
import { IconButton, Button, Box, Chip } from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import GenericTable from "@/components/common/GenericTable";
import { Categoria } from "@/types/productos";

interface Props {
  categorias: Categoria[];
  loading: boolean;
  onEdit: (categoria: Categoria) => void;
  onDelete: (categoria: Categoria) => void;
  onCreate: () => void;
}

const CategoriasTable = ({
  categorias,
  loading,
  onEdit,
  onDelete,
  onCreate,
}: Props) => {
  // Configuración de columnas
  const categoriaColumns = [
    {
      key: "id",
      label: "ID",
      align: "center" as const,
      render: (value: number) => (
        <Chip label={`#${value}`} size="small" color="default" />
      ),
    },
    {
      key: "nombre",
      label: "Nombre",
    },
    {
      key: "descripcion",
      label: "Descripción",
      render: (value: string) => value || "-",
    },
  ];

  // Acciones para cada fila
  const renderActions = (categoria: Categoria) => (
    <Box sx={{ display: "flex", gap: 1 }}>
      <IconButton
        size="small"
        color="secondary"
        onClick={() => onEdit(categoria)}
        title="Editar"
      >
        <Edit />
      </IconButton>
      <IconButton
        size="small"
        color="error"
        onClick={() => onDelete(categoria)}
        title="Eliminar"
      >
        <Delete />
      </IconButton>
    </Box>
  );

  // Botón para el header
  const headerAction = (
    <Button variant="contained" startIcon={<Add />} onClick={onCreate}>
      Agregar Categoría
    </Button>
  );

  return (
    <GenericTable
      title="Gestión de Categorías"
      subtitle="Administra todas las categorías de productos"
      columns={categoriaColumns}
      data={categorias}
      loading={loading}
      emptyMessage="No hay categorías registradas"
      actions={renderActions}
      action={headerAction}
    />
  );
};

export default CategoriasTable;
