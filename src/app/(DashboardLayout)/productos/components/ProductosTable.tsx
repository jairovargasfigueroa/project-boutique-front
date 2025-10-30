// src/app/(DashboardLayout)/productos/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { Chip, Avatar, IconButton, Button, Box } from '@mui/material';
import { Edit, Delete, Visibility, Add } from '@mui/icons-material';
import GenericTable from '@/components/common/GenericTable';
import { Producto } from '@/types/productos';

interface Props {
  productos: Producto[];
  loading: boolean;
  onEdit: (producto: Producto) => void;
  onDelete: (producto: Producto) => void;
  onCreate: () => void;
}

const ProductosTable = ({ productos, loading, onEdit, onDelete, onCreate }: Props) => {

  // 3. CONFIGURACIÓN DE COLUMNAS
  const productColumns = [
    {
      key: 'imagen',
      label: 'Imagen',
      align: 'center' as const,
      render: (value: string) => (
        <Avatar src={value} alt="Producto" sx={{ width: 40, height: 40 }} />
      )
    },
    {
      key: 'nombre',
      label: 'Nombre del Producto'
    },
    {
      key: 'categoria',
      label: 'Categoría',
      render: (value: string) => (
        <Chip label={value} size="small" color="primary" />
      )
    },
    {
      key: 'precio_base',
      label: 'Precio',
      align: 'right' as const,
      render: (value: number) => `$${value.toFixed(2)}`
    },
    {
      key: 'stock',
      label: 'Stock',
      align: 'center' as const,
      render: (value: number) => (
        <Chip 
          label={value} 
          color={value > 10 ? 'success' : value > 0 ? 'warning' : 'error'} 
          size="small" 
        />
      )
    }
  ];

  // 4. ACCIONES PARA CADA FILA
  const renderActions = (producto: any) => (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <IconButton size="small" color="secondary" onClick={() => onEdit(producto)}>
        <Edit />
      </IconButton>
      <IconButton size="small" color="error" onClick={() => onDelete(producto)}>
        <Delete />
      </IconButton>
    </Box>
  );


  // 6. BOTÓN PARA EL HEADER
  const headerAction = (
    <Button 
      variant="contained" 
      startIcon={<Add />}
      onClick={() => onCreate()}
    >
      Agregar Producto
    </Button>
  );

  // 7. RENDER DE LA PÁGINA
  return (
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
  );
};

export default ProductosTable;