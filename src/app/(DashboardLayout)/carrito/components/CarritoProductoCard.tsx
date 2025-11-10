// app/(DashboardLayout)/carrito/components/CarritoProductoCard.tsx

import { Box, Typography, IconButton, Button } from '@mui/material'
import { Add, Remove, Delete } from '@mui/icons-material'
import { CartItem } from '@/store/cartStore'

interface Props {
  item: CartItem
  onUpdateQuantity: (cantidad: number) => void
  onRemove: () => void
}

export default function CarritoProductoCard({ item, onUpdateQuantity, onRemove }: Props) {
  const subtotal = item.precioUnitario * item.cantidad
  
  const handleDecrementar = () => {
    if (item.cantidad > 1) {
      onUpdateQuantity(item.cantidad - 1)
    }
  }
  
  const handleIncrementar = () => {
    onUpdateQuantity(item.cantidad + 1)
  }
  
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        p: 2,
        border: '1px solid #ddd',
        borderRadius: 2,
        backgroundColor: '#fff',
        alignItems: 'center'
      }}
    >
      {/* Imagen */}
      <Box
        component="img"
        src={item.producto.image || 'https://placehold.co/150x150'}
        alt={item.producto.nombre}
        sx={{
          width: 120,
          height: 120,
          objectFit: 'cover',
          borderRadius: 1
        }}
      />
      
      {/* Info del producto */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" gutterBottom>
          {item.producto.nombre}
        </Typography>
        
        {item.variante.talla && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Talla: <strong>{item.variante.talla}</strong>
          </Typography>
        )}
        
        <Typography variant="body2" color="text.secondary">
          Precio unitario: ${item.precioUnitario}
        </Typography>
        
        {/* Controles de cantidad */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
          <Typography variant="body2" sx={{ mr: 1 }}>Cantidad:</Typography>
          <IconButton 
            size="small" 
            onClick={handleDecrementar}
            disabled={item.cantidad <= 1}
            sx={{ border: '1px solid #ddd' }}
          >
            <Remove fontSize="small" />
          </IconButton>
          
          <Typography variant="body1" sx={{ minWidth: 30, textAlign: 'center' }}>
            {item.cantidad}
          </Typography>
          
          <IconButton 
            size="small" 
            onClick={handleIncrementar}
            sx={{ border: '1px solid #ddd' }}
          >
            <Add fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      
      {/* Subtotal y eliminar */}
      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="h6" color="primary" gutterBottom>
          ${subtotal.toFixed(2)}
        </Typography>
        
        <Button
          variant="outlined"
          color="error"
          size="small"
          startIcon={<Delete />}
          onClick={onRemove}
        >
          Eliminar
        </Button>
      </Box>
    </Box>
  )
}