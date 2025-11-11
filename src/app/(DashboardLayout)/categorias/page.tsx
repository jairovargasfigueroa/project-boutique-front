"use client";
import React, { useState } from "react";
import { Box } from "@mui/material";
import { useCategorias } from "@/hooks/useCategorias";
import { Categoria } from "@/types/productos";
import CategoriasTable from "./components/CategoriasTable";
import CategoriaDialog from "./components/CategoriaDialog";

interface CategoriaFormData {
  nombre: string;
  descripcion: string;
}

export default function CategoriasPage() {
  const {
    categorias,
    loading,
    error,
    createCategoria,
    updateCategoria,
    deleteCategoria,
    refetch,
  } = useCategorias();

  const [openDialog, setOpenDialog] = useState(false);
  const [modo, setModo] = useState<"create" | "edit">("create");
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState<Categoria | null>(null);

  const handleNew = () => {
    setModo("create");
    setCategoriaSeleccionada(null);
    setOpenDialog(true);
  };

  const handleEdit = (categoria: Categoria) => {
    setModo("edit");
    setCategoriaSeleccionada(categoria);
    setOpenDialog(true);
  };

  const handleSubmit = async (data: CategoriaFormData) => {
    if (modo === "create") {
      await createCategoria(data);
    } else if (categoriaSeleccionada) {
      await updateCategoria(categoriaSeleccionada.id, data);
    }
    setOpenDialog(false);
    refetch();
  };

  const handleDelete = async (categoria: Categoria) => {
    if (confirm(`¿Eliminar la categoría "${categoria.nombre}"?`)) {
      await deleteCategoria(categoria.id);
      refetch();
    }
  };

  return (
    <Box>
      <CategoriasTable
        categorias={categorias}
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

      <CategoriaDialog
        open={openDialog}
        mode={modo}
        initialData={
          categoriaSeleccionada
            ? {
                nombre: categoriaSeleccionada.nombre,
                descripcion: categoriaSeleccionada.descripcion || "",
              }
            : undefined
        }
        onClose={() => setOpenDialog(false)}
        onSubmit={handleSubmit}
      />
    </Box>
  );
}
