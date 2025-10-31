// src/components/common/ProductCard/ProductCard.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import {
  CardContent,
  Typography,
  Rating,
  Tooltip,
  Fab,
} from '@mui/material';
import { Stack } from '@mui/system';
import { IconBasket } from '@tabler/icons-react';
import BlankCard from '@/app/(DashboardLayout)/components/shared/BlankCard';
import { Producto } from '@/types/productos';

interface ProductCardProps {
  producto: Producto;
  onAddToCart?: (producto: Producto) => void;
  linkUrl?: string;
}

export default function ProductCard({ 
  producto, 
  onAddToCart,
  linkUrl = '/'
}: ProductCardProps) {
  const imageSrc = producto.imagen || 'https://placehold.co/300x250/e3e3e3/999999?text=Producto';
  
  return (
    <BlankCard>
      <Typography component={Link} href={linkUrl}>
        <img
          src={imageSrc}
          alt={producto.nombre}
          onError={(e) => {
            e.currentTarget.src = 'https://placehold.co/300x250/e3e3e3/999999?text=Producto';
          }}
          style={{ width: '100%', height: '250px', objectFit: 'cover' }}
        />
      </Typography>
      

      <CardContent sx={{ p: 3, pt: 2 }}>
        <Typography variant="h6">{producto.nombre}</Typography>
        
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: 1,
          }}
        >
          <Stack direction="row" sx={{ alignItems: 'center' }}>
            <Typography variant="h6">${producto.precio_base}</Typography>
          </Stack>
         
        </Stack>
      </CardContent>
    </BlankCard>
  );
}