'use client';
import { Card, CardMedia, CardContent, Typography, Button } from '@mui/material'
import { Producto } from '@/types/productos'

interface ProductoCatalogoCardProps {
  producto: Producto
  onClickCard: (producto: Producto) => void
  onAgregarCarrito: (producto: Producto) => void
}

export default function CatalogoProductoCard({ 
  producto, 
  onClickCard,
  onAgregarCarrito 
}: ProductoCatalogoCardProps) {
  
  const handleAgregarClick = (e: React.MouseEvent) => {
    e.stopPropagation()  // No activar click del card
    onAgregarCarrito(producto)
  }
  
  return (
    <Card 
      onClick={() => onClickCard(producto)} 
      sx={{ 
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <CardMedia
        component="img"
        height="250"
        image={producto.imagen || 'https://placehold.co/300x250'}
        alt={producto.nombre}
        sx={{ objectFit: 'cover' }}
      />
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" noWrap>
          {producto.nombre}
        </Typography>
        
        <Typography variant="h5" color="primary" sx={{ my: 1 }}>
          ${producto.precio_base}
        </Typography>
        
        <Button
          fullWidth
          variant="contained"
          onClick={handleAgregarClick}
        >
          Agregar al carrito
        </Button>
      </CardContent>
    </Card>
  )
}