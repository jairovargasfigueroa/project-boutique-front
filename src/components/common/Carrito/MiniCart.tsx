'use client'

import { 
  Drawer, 
  Box, 
  Typography, 
  Button, 
  Divider, 
  IconButton,
  Stack 
} from '@mui/material'
import { Close } from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import useCartStore, { selectSubtotal, selectIsEmpty } from '@/store/cartStore'
import CarritoProductoCard from '@/app/(DashboardLayout)/carrito/components/CarritoProductoCard'

interface MiniCartProps {
  open: boolean
  onClose: () => void
}

export default function MiniCart({ open, onClose }: MiniCartProps) {
  const router = useRouter()
  const items = useCartStore(state => state.items)
  const modificarCantidad = useCartStore(state => state.modificarCantidad)
  const quitarProducto = useCartStore(state => state.quitarProducto)
  const isEmpty = useCartStore(selectIsEmpty)
  const subtotal = useCartStore(selectSubtotal)

  const handleModificarCantidad = (id: number, cantidad: number) => {
    modificarCantidad(id, cantidad)
  }

  const handleQuitarProducto = (id: number) => {
    quitarProducto(id)
  }

  const handleVerCarrito = () => {
    onClose()
    router.push('/carrito')
  }

  const handleCheckout = () => {
    onClose()
    router.push('/checkout')
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 400 },
          p: 2
        }
      }}
    >
      {/* Header del Drawer */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">
          Carrito ({items.length})
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Contenido */}
      {isEmpty ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            Tu carrito está vacío
          </Typography>
        </Box>
      ) : (
        <>
          {/* Lista de productos */}
          <Box sx={{ flex: 1, overflowY: 'auto', mb: 2 }}>
            <Stack spacing={2}>
              {items.map(item => (
                <CarritoProductoCard
                  key={item.id}
                  item={item}
                  onUpdateQuantity={(qty) => handleModificarCantidad(item.id, qty)}
                  onRemove={() => handleQuitarProducto(item.id)}
                />
              ))}
            </Stack>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Total */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">Subtotal:</Typography>
              <Typography variant="h6" fontWeight="bold" color="primary">
                ${subtotal.toLocaleString()}
              </Typography>
            </Box>
          </Box>

          {/* Botones */}
          <Stack spacing={1}>
            <Button 
              variant="contained" 
              fullWidth 
              onClick={handleCheckout}
              size="large"
            >
              Ir al Checkout
            </Button>
            <Button 
              variant="outlined" 
              fullWidth 
              onClick={handleVerCarrito}
            >
              Ver Carrito Completo
            </Button>
          </Stack>
        </>
      )}
    </Drawer>
  )
}
