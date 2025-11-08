"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Avatar,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { ProductoVariante } from "@/types/productos";
import { useVariantes } from "@/hooks/useVariantes";
import VarianteDialog from "./VarianteDialog";

interface Props {
  productoId: number;
}

const VariantesTable = ({ productoId }: Props) => {
  const {
    variantes,
    loading,
    createVariante,
    updateVariante,
    deleteVariante,
    refetch,
  } = useVariantes({ productoId, autoFetch: false });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedVariante, setSelectedVariante] = useState<
    Partial<ProductoVariante>
  >({});

  useEffect(() => {
    refetch(productoId);
  }, [productoId]);

  const handleCreate = () => {
    setSelectedVariante({});
    setDialogMode("create");
    setDialogOpen(true);
  };

  const handleEdit = (variante: ProductoVariante) => {
    setSelectedVariante(variante);
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const handleDelete = async (variante: ProductoVariante) => {
    if (
      window.confirm(
        `¿Eliminar la variante ${variante.talla} - ${variante.color}?`
      )
    ) {
      try {
        await deleteVariante(variante.id);
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  const handleSubmit = async (data: Partial<ProductoVariante>) => {
    try {
      if (dialogMode === "create") {
        await createVariante(data as Omit<ProductoVariante, "id">);
      } else if (selectedVariante.id) {
        await updateVariante(selectedVariante.id, data);
      }
      setDialogOpen(false);
      refetch(productoId);
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, backgroundColor: "#f5f5f5" }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">Variantes del Producto</Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<Add />}
          onClick={handleCreate}
        >
          Agregar Variante
        </Button>
      </Box>

      {variantes.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography color="textSecondary">
            No hay variantes registradas para este producto
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Talla</TableCell>
                <TableCell>Color</TableCell>
                <TableCell align="right">Precio Venta</TableCell>
                <TableCell align="right">Precio Costo</TableCell>
                <TableCell align="center">Stock</TableCell>
                <TableCell align="center">Stock Mín.</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {variantes.map((variante) => (
                <TableRow key={variante.id}>
                  <TableCell>
                    <Chip label={variante.talla} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={variante.color}
                      size="small"
                      sx={{
                        backgroundColor: variante.color.toLowerCase(),
                        color: "#fff",
                      }}
                    />
                  </TableCell>

                  <TableCell align="right">
                    ${variante.precio_venta?.toFixed(2) || "-"}
                  </TableCell>
                  <TableCell align="right">
                    ${variante.precio_costo?.toFixed(2) || "-"}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={variante.stock}
                      size="small"
                      color={
                        variante.stock > 10
                          ? "success"
                          : variante.stock > 0
                          ? "warning"
                          : "error"
                      }
                    />
                  </TableCell>
                  <TableCell align="center">
                    {variante.stock_minimo || "-"}
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" gap={0.5} justifyContent="center">
                      <IconButton
                        size="small"
                        color="secondary"
                        onClick={() => handleEdit(variante)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(variante)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <VarianteDialog
        open={dialogOpen}
        mode={dialogMode}
        productoId={productoId}
        initialData={selectedVariante}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
      />
    </Box>
  );
};

export default VariantesTable;
