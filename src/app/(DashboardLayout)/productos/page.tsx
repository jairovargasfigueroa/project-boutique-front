"use client";
import React, { useState } from "react";
import { Box } from "@mui/material";
import { useProductos } from "@/hooks/useProductos";
import {
  Producto,
  ProductoCreate,
  ProductoUpdate,
  FiltrosProducto,
} from "@/types/productos";
import ProductosTable from "./components/ProductosTable";
import ProductoDialog from "./components/ProductoDialog";
import FiltrosSidebar from "./components/FiltrosSidebar";
import FiltrosActivos from "./components/FiltrosActivos";

export default function ProductosPage() {
  const [filtros, setFiltros] = useState<FiltrosProducto>({});
  const {
    productos,
    loading,
    error,
    createProducto,
    updateProducto,
    deleteProducto,
    refetch,
  } = useProductos(filtros);

  const [openDialog, setOpenDialog] = useState(false);
  const [modo, setModo] = useState<"create" | "edit">("create");
  const [productoSeleccionado, setProductoSeleccionado] =
    useState<Producto | null>(null);

  const handleNew = () => {
    setModo("create");
    setProductoSeleccionado(null);
    setOpenDialog(true);
  };

  const handleEdit = (producto: Producto) => {
    setModo("edit");
    setProductoSeleccionado(producto);
    setOpenDialog(true);
  };

  const handleSubmit = async (data: ProductoCreate | ProductoUpdate) => {
    if (modo === "create") {
      await createProducto(data as ProductoCreate);
    } else if (productoSeleccionado) {
      await updateProducto(productoSeleccionado.id, data as ProductoUpdate);
    }
    setOpenDialog(false);
    refetch();
  };

  const handleDelete = async (producto: Producto) => {
    if (confirm(`¿Eliminar "${producto.nombre}"?`)) {
      console.log("producto", producto);
      setProductoSeleccionado(producto);
      await deleteProducto(producto.id);
    }
    refetch();
  };

  const handleFiltrosChange = (nuevosFiltros: FiltrosProducto) => {
    setFiltros(nuevosFiltros);
  };

  const handleLimpiarFiltros = () => {
    setFiltros({});
  };

  const handleEliminarFiltro = (key: keyof FiltrosProducto) => {
    const newFiltros = { ...filtros };
    delete newFiltros[key];

    // Si es precio_min, también eliminar precio_max
    if (key === "precio_min" && "precio_max" in newFiltros) {
      delete newFiltros.precio_max;
    }

    setFiltros(newFiltros);
  };

  return (
    <Box sx={{ display: "flex", gap: 3, p: 3 }}>
      {/* SIDEBAR - Filtros */}
      <Box sx={{ width: 280, flexShrink: 0 }}>
        <FiltrosSidebar
          filtros={filtros}
          onChange={handleFiltrosChange}
          onLimpiar={handleLimpiarFiltros}
        />
      </Box>

      {/* ÁREA PRINCIPAL - Productos */}
      <Box sx={{ flex: 1 }}>
        {/* Filtros Activos */}
        <FiltrosActivos
          filtros={filtros}
          onEliminar={handleEliminarFiltro}
          onLimpiarTodo={handleLimpiarFiltros}
        />

        <ProductosTable
          productos={productos}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreate={handleNew}
        />

        {/* <PaginadorTabla
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
        /> */}

        {error && (
          <Box color="error.main" mt={2}>
            Error: {error}
          </Box>
        )}

        <ProductoDialog
          open={openDialog}
          mode={modo}
          initialData={
            productoSeleccionado
              ? {
                  nombre: productoSeleccionado.nombre,
                  descripcion: productoSeleccionado.descripcion,
                  genero: productoSeleccionado.genero,
                  marca: productoSeleccionado.marca,
                  categoria: productoSeleccionado.categoria,
                }
              : undefined
          }
          onClose={() => setOpenDialog(false)}
          onSubmit={handleSubmit}
        />
      </Box>
    </Box>
  );
}
