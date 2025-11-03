"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Chip,
  Avatar,
  Button,
} from "@mui/material";
import { Close, Edit, Delete, Add } from "@mui/icons-material";
import GenericTable from "@/components/common/GenericTable";
import { Producto, ProductoVariante } from "@/types/productos";
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
    Partial<ProductoVariante>
  >({});

  useEffect(() => {
    if (open) {
      refetch(producto.id);
    }
  }, [open, producto.id]);

  const handleCreate = () => {
    setSelectedVariante({});
    setVarianteDialogMode("create");
    setVarianteDialogOpen(true);
  };

  const handleEdit = (variante: ProductoVariante) => {
    setSelectedVariante(variante);
    setVarianteDialogMode("edit");
    setVarianteDialogOpen(true);
  };

  const handleDelete = async (variante: ProductoVariante) => {
    if (
      window.confirm(
        `¿Eliminar la variante ${variante.talla} - ${variante.color}?`
      )
    ) {
      try {
        await deleteVariante(variante.id);
        refetch(producto.id);
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  const handleSubmit = async (data: Partial<ProductoVariante>) => {
    try {
      if (varianteDialogMode === "create") {
        await createVariante(data as Omit<ProductoVariante, "id">);
      } else if (selectedVariante.id) {
        await updateVariante(selectedVariante.id, data);
      }
      setVarianteDialogOpen(false);
      refetch(producto.id);
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  const variantesColumns = [
    {
      key: "talla",
      label: "Talla",
      render: (value: string) => <Chip label={value} size="small" />,
    },
    {
      key: "color",
      label: "Color",
      render: (value: string) => (
        <Chip
          label={value}
          size="small"
          sx={{
            backgroundColor: value.toLowerCase(),
            color: "#fff",
          }}
        />
      ),
    },
    {
      key: "precio_venta",
      label: "Precio Venta",
      align: "right" as const,
      render: (value: number) => (value ? `$${value.toFixed(2)}` : "-"),
    },
    {
      key: "precio_costo",
      label: "Precio Costo",
      align: "right" as const,
      render: (value: number) => (value ? `$${value.toFixed(2)}` : "-"),
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
