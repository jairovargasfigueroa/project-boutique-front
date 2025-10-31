// app/(DashboardLayout)/catalogo/page.tsx
'use client';
import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { useProductos } from '@/hooks/useProductos';

import { Producto } from '@/types/productos';
import PageContainer from '../components/container/PageContainer';
import ProductoCard from '@/components/common/ProductoCards/CatalogoProductoCard';

export default function CatalogoPage() {
  const { productos, loading, error } = useProductos();

  const handleAddToCart = (producto: Producto) => {
    console.log('Añadir al carrito:', producto);
    // Aquí irá tu lógica del carrito
  };

  if (loading) {
    return <Typography>Cargando productos...</Typography>;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <PageContainer title="Catálogo" description="Catálogo de productos">
      <Box>
        <Typography variant="h4" mb={3}>
          Catálogo de Boutique
        </Typography>
        
        <Grid container spacing={3}>
          {productos.map((producto) => (
            <Grid
              key={producto.id}
              size={{ xs: 12, md: 4, lg: 3 }}
            >
              <ProductoCard
                producto={producto}
                onAddToCart={handleAddToCart}
                linkUrl={`/catalogo/${producto.id}`}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </PageContainer>
  );
}