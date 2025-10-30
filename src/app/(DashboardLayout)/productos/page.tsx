'use client';
import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useProductos } from '@/hooks/useProductos';
import { Producto } from '@/types/productos';
import ProductosTable from './components/ProductosTable';
import ProductoDialog from './components/ProductoDialog';

export default function ProductosPage() {
  const {
    productos,
    loading,
    error, 
    createProducto,
    updateProducto,
    deleteProducto,
    refetch
  } = useProductos();

  const [openDialog, setOpenDialog] = useState(false);
  const [modo, setModo] = useState<'create' | 'edit'>('create');
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);

  const handleNew = () => {
    setModo('create');
    setProductoSeleccionado(null);
    setOpenDialog(true);
  };

  const handleEdit = (producto: Producto) => {
    setModo('edit');
    setProductoSeleccionado(producto);
    setOpenDialog(true);
  };

  const handleSubmit = async (data: Partial<Producto>) => {
    if (modo === 'create') {
      await createProducto(data);
    } else if (productoSeleccionado) {
      await updateProducto(productoSeleccionado.id, data);
    }
    setOpenDialog(false);
    refetch();
  };

  const handleDelete = async (producto: Producto) => {
    if (confirm(`¿Eliminar "${producto.nombre}"?`)) {
      console.log('producto',producto)
      setProductoSeleccionado(producto);
      await deleteProducto(producto.id);
    }
    refetch();
  };

  // const handleClearFilters = () => {
  //   setFilterNombre('');
  //   setFilterCategoria('');
  // };

  return (
    <Box>
      {/* <FiltrosProducto
        filterNombre={filterNombre}
        setFilterNombre={setFilterNombre}
        filterCategoria={filterCategoria}
        setFilterCategoria={setFilterCategoria}
        onClear={handleClearFilters}
      /> */}

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

      {error && <Box color="error.main" mt={2}>Error: {error}</Box>}

      <ProductoDialog
        open={openDialog}
        mode={modo}
        initialData={productoSeleccionado || {}}
        onClose={() => setOpenDialog(false)}
        onSubmit={handleSubmit}
      />
    </Box>
  );
}
