// src/app/(DashboardLayout)/productos/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { Chip, Avatar, IconButton, Button, Box } from '@mui/material';
import { Edit, Delete, Visibility, Add } from '@mui/icons-material';
import GenericTable from '@/components/common/GenericTable';

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  imagen: string;
  estado: string;
}

const ProductosPage = () => {
  // 1. ESTADO para los datos
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. LLAMADA A TU API (cuando la tengas)
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        // const response = await fetch('/api/productos');
        // const data = await response.json();
        
        // Por ahora datos de ejemplo:s
        const data = [
          {
            id: 1,
            nombre: "Vestido Floral",
            categoria: "Vestidos",
            precio: 89.99,
            stock: 15,
            imagen: "/images/products/vestido1.jpg",
            estado: "Activo"
          },
          {
            id: 2,
            nombre: "Blusa Elegante",
            categoria: "Blusas", 
            precio: 45.50,
            stock: 8,
            imagen: "/images/products/blusa1.jpg",
            estado: "Activo"
          }
        ];
        
        setProductos(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductos();
  }, []);

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
      key: 'precio',
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
      <IconButton size="small" color="primary" onClick={() => handleView(producto.id)}>
        <Visibility />
      </IconButton>
      <IconButton size="small" color="secondary" onClick={() => handleEdit(producto.id)}>
        <Edit />
      </IconButton>
      <IconButton size="small" color="error" onClick={() => handleDelete(producto.id)}>
        <Delete />
      </IconButton>
    </Box>
  );

  // 5. FUNCIONES DE ACCIONES
  const handleView = (id: number) => {
    console.log('Ver producto:', id);
  };

  const handleEdit = (id: number) => {
    console.log('Editar producto:', id);
  };

  const handleDelete = (id: number) => {
    console.log('Eliminar producto:', id);
  };

  // 6. BOTÓN PARA EL HEADER
  const headerAction = (
    <Button 
      variant="contained" 
      startIcon={<Add />}
      onClick={() => console.log('Agregar producto')}
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

export default ProductosPage;