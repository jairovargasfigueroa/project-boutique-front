"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Button,
  Typography,
  Chip,
  Avatar,
} from "@mui/material";
import { Close, Add } from "@mui/icons-material";
import GenericTable from "@/components/common/GenericTable";
import { Producto, ProductoVariante } from "@/types/productos";
import { useVariantes } from "@/hooks/useVariantes";
import { useCarritoVentaStore } from "@/store/carritoVentaStore";

interface Props {
  open: boolean;
  onClose: () => void;
  producto: Producto;
}

const SeleccionarVarianteDialog = ({ open, onClose, producto }: Props) => {
  const { variantes, loading, refetch } = useVariantes({
    productoId: producto.id,
    autoFetch: false,
  });
  const addItem = useCarritoVentaStore((state) => state.addItem);

  useEffect(() => {
    if (open) {
      refetch(producto.id);
    }
  }, [open, producto.id]);

  const handleAgregarVariante = (variante: ProductoVariante) => {
    if (variante.stock <= 0) {
      alert("Esta variante no tiene stock disponible");
      return;
    }

    addItem({
      variante_id: variante.id,
      producto_nombre: producto.nombre,
      talla: variante.talla,
      precio_unitario:
        typeof variante.precio === "string"
          ? parseFloat(variante.precio)
          : variante.precio,
      cantidad: 1,
      image: producto.image,
      stock_disponible: variante.stock,
    });

    alert(
      `${producto.nombre} ${variante.talla || "Sin talla"} agregado al carrito`
    );
  };

  const variantesColumns = [
    {
      key: "talla",
      label: "Talla",
      render: (value: string | null) => (
        <Chip label={value || "Única"} size="small" color="primary" />
      ),
    },
    {
      key: "precio",
      label: "Precio",
      align: "right" as const,
      render: (value: string | number, row: ProductoVariante) => {
        const precio = typeof value === "string" ? parseFloat(value) : value;
        return `Bs ${precio.toFixed(2)}`;
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
          color={value > 5 ? "success" : value > 0 ? "warning" : "error"}
        />
      ),
    },
  ];

  // Acciones para cada variante
  const renderActions = (variante: ProductoVariante) => (
    <Button
      variant="contained"
      size="small"
      startIcon={<Add />}
      onClick={() => handleAgregarVariante(variante)}
      disabled={variante.stock <= 0}
    >
      Agregar
    </Button>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6">{producto.nombre}</Typography>
            <Typography variant="body2" color="textSecondary">
              {producto.descripcion}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <GenericTable
          title="Variantes disponibles"
          subtitle="Selecciona la variante que deseas agregar a la venta"
          columns={variantesColumns}
          data={variantes}
          loading={loading}
          emptyMessage="No hay variantes disponibles para este producto"
          actions={renderActions}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SeleccionarVarianteDialog;
