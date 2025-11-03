"use client";
import { useState } from "react";
import { Chip, Avatar, IconButton, Button, Box } from "@mui/material";
import { Edit, Delete, Add, Visibility } from "@mui/icons-material";
import GenericTable from "@/components/common/GenericTable";
import { Producto } from "@/types/productos";
import VariantesDialog from "./VariantesDialog";

interface Props {
  productos: Producto[];
  loading: boolean;
  onEdit: (producto: Producto) => void;
  onDelete: (producto: Producto) => void;
  onCreate: () => void;
}

const ProductosTable = ({
  productos,
  loading,
  onEdit,
  onDelete,
  onCreate,
}: Props) => {
  const [variantesDialogOpen, setVariantesDialogOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(
    null
  );

  // Abrir dialog de variantes
  const handleOpenVariantes = (producto: Producto) => {
    setSelectedProducto(producto);
    setVariantesDialogOpen(true);
  };

  // Cerrar dialog de variantes
  const handleCloseVariantes = () => {
    setVariantesDialogOpen(false);
    setSelectedProducto(null);
  };

  // Configuración de columnas
  const productColumns = [
    {
      key: "imagen_url",
      label: "Imagen",
      align: "center" as const,
      render: (value: string) => (
        <Avatar src={value} alt="Producto" sx={{ width: 40, height: 40 }} />
      ),
    },
    {
      key: "nombre",
      label: "Nombre del Producto",
    },
    {
      key: "categoria_nombre",
      label: "Categoría",
      render: (value: string) => (
        <Chip label={value} size="small" color="primary" />
      ),
    },
    {
      key: "genero",
      label: "Género",
      render: (value: string) => value || "-",
    },
    {
      key: "precio_base",
      label: "Precio",
      align: "right" as const,
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      key: "stock",
      label: "Stock",
      align: "center" as const,
      render: (value: number) => (
        <Chip
          label={value}
          color={value > 10 ? "success" : value > 0 ? "warning" : "error"}
          size="small"
        />
      ),
    },
  ];

  // Acciones para cada fila
  const renderActions = (producto: Producto) => (
    <Box sx={{ display: "flex", gap: 1 }}>
      <IconButton
        size="small"
        color="info"
        onClick={() => handleOpenVariantes(producto)}
        title="Ver variantes"
      >
        <Visibility />
      </IconButton>
      <IconButton
        size="small"
        color="secondary"
        onClick={() => onEdit(producto)}
        title="Editar"
      >
        <Edit />
      </IconButton>
      <IconButton
        size="small"
        color="error"
        onClick={() => onDelete(producto)}
        title="Eliminar"
      >
        <Delete />
      </IconButton>
    </Box>
  );

  // Botón para el header
  const headerAction = (
    <Button variant="contained" startIcon={<Add />} onClick={onCreate}>
      Agregar Producto
    </Button>
  );

  return (
    <>
      <GenericTable
        title="Gestión de Productos"
        subtitle="Administra todos los productos de tu boutique"
        columns={productColumns}
        data={productos}
        loading={loading}
        emptyMessage="No hay productos registrados"
        actions={renderActions}
        action={headerAction}
      />

      {selectedProducto && (
        <VariantesDialog
          open={variantesDialogOpen}
          onClose={handleCloseVariantes}
          producto={selectedProducto}
        />
      )}
    </>
  );
};

export default ProductosTable;
