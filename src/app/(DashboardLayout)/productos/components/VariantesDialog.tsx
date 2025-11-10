"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Chip,
  Button,
} from "@mui/material";
import { Close, Edit, Delete, Add } from "@mui/icons-material";
import GenericTable from "@/components/common/GenericTable";
import { Producto, ProductoVariante, VarianteProductoCreate, VarianteProductoUpdate } from "@/types/productos";
import { useVariantes } from "@/hooks/useVariantes";
import VarianteDialog from "./VarianteDialog";

interface Props {
  open: boolean;
  onClose: () => void;
  producto: Producto;
}

const VariantesDialog = ({ open, onClose, producto }: Props) => {
  const {
    variantes,
    loading,
    createVariante,
    updateVariante,
    deleteVariante,
    refetch,
  } = useVariantes({ productoId: producto.id, autoFetch: false });

  const [varianteDialogOpen, setVarianteDialogOpen] = useState(false);
  const [varianteDialogMode, setVarianteDialogMode] = useState<
    "create" | "edit"
  >("create");
  const [selectedVariante, setSelectedVariante] = useState<
    VarianteProductoCreate | VarianteProductoUpdate | undefined
  >(undefined);

  useEffect(() => {
    if (open) {
      refetch(producto.id);
    }
  }, [open, producto.id]);

  const handleCreate = () => {
    setSelectedVariante(undefined);
    setVarianteDialogMode("create");
    setVarianteDialogOpen(true);
  };

  const [editingVarianteId, setEditingVarianteId] = useState<number | null>(null);

  const handleEdit = (variante: ProductoVariante) => {
    // Convertir ProductoVariante a VarianteProductoUpdate
    const varianteUpdate: VarianteProductoUpdate = {
      talla: variante.talla,
      precio: typeof variante.precio === 'string' ? parseFloat(variante.precio) : variante.precio,
      stock: variante.stock,
      stock_minimo: variante.stock_minimo,
    };
    setSelectedVariante(varianteUpdate);
    setEditingVarianteId(variante.id);
    setVarianteDialogMode("edit");
    setVarianteDialogOpen(true);
  };

  const handleDelete = async (variante: ProductoVariante) => {
    if (window.confirm(`¿Eliminar la variante ${variante.talla}?`)) {
      try {
        await deleteVariante(variante.id);
        refetch(producto.id);
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  const handleSubmit = async (data: VarianteProductoCreate | VarianteProductoUpdate) => {
    try {
      if (varianteDialogMode === "create") {
        await createVariante(data as VarianteProductoCreate);
      } else if (editingVarianteId) {
        await updateVariante(editingVarianteId, data as VarianteProductoUpdate);
      }
      setVarianteDialogOpen(false);
      setEditingVarianteId(null);
      refetch(producto.id);
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  const variantesColumns = [
    {
      key: "talla",
      label: "Talla",
      render: (value: string | null) => (
        <Chip label={value || "Sin talla"} size="small" />
      ),
    },
    {
      key: "precio",
      label: "Precio",
      align: "right" as const,
      render: (value: string | number) => {
        const precio = typeof value === 'string' ? parseFloat(value) : value;
        return precio ? `Bs. ${precio.toFixed(2)}` : "-";
      },
    },
    {
      key: "stock",
      label: "Stock",
      align: "center" as const,
      render: (value: number) => (
        <Chip
          label={value}
          size="small"
          color={value > 10 ? "success" : value > 0 ? "warning" : "error"}
        />
      ),
    },
    {
      key: "stock_minimo",
      label: "Stock Mín.",
      align: "center" as const,
      render: (value: number) => value || "-",
    },
  ];

  // Acciones para cada variante
  const renderActions = (variante: ProductoVariante) => (
    <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
      <IconButton
        size="small"
        color="secondary"
        onClick={() => handleEdit(variante)}
        title="Editar"
      >
        <Edit fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        color="error"
        onClick={() => handleDelete(variante)}
        title="Eliminar"
      >
        <Delete fontSize="small" />
      </IconButton>
    </Box>
  );

  // Botón para agregar variante
  const headerAction = (
    <Button
      variant="contained"
      size="small"
      startIcon={<Add />}
      onClick={handleCreate}
    >
      Agregar Variante
    </Button>
  );

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              Variantes de: <strong>{producto.nombre}</strong>
            </Box>
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <GenericTable
            title="Variantes del Producto"
            subtitle={`Gestiona las variantes de ${producto.nombre}`}
            columns={variantesColumns}
            data={variantes}
            loading={loading}
            emptyMessage="No hay variantes registradas para este producto"
            actions={renderActions}
            action={headerAction}
          />
        </DialogContent>
      </Dialog>

      <VarianteDialog
        open={varianteDialogOpen}
        mode={varianteDialogMode}
        productoId={producto.id}
        initialData={selectedVariante}
        onClose={() => setVarianteDialogOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default VariantesDialog;
