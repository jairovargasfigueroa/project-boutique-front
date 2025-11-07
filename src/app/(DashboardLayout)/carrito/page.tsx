// app/(DashboardLayout)/carrito/page.tsx

'use client'

import { Box, Typography, Button } from '@mui/material'
import { useRouter } from 'next/navigation'
import useCartStore, { selectSubtotal, selectIsEmpty } from '@/store/cartStore'
import CarritoProductoCard from './components/CarritoProductoCard'
import ResumenCarrito from './components/ResumenCarrito'

export default function CarritoPage() {
  const router = useRouter()
  
  const items = useCartStore(state => state.items)
  const modificarCantidad = useCartStore(state => state.modificarCantidad)
  const quitarProducto = useCartStore(state => state.quitarProducto)
  const vaciarCarrito = useCartStore(state => state.vaciarCarrito)
  const isEmpty = useCartStore(selectIsEmpty)
  const subtotal = useCartStore(selectSubtotal)
  
  const handleModificarCantidad = (id: number, cantidad: number) => {
    modificarCantidad(id, cantidad)
  }
  
  const handleQuitarProducto = (id: number) => {
    if (confirm('¿Eliminar este producto del carrito?')) {
      quitarProducto(id)
    }
  }
  
  const handleVaciarCarrito = () => {
    if (confirm('¿Vaciar todo el carrito?')) {
      vaciarCarrito()
    }
  }
  
  const handleProcederCheckout = () => {
    router.push('/checkout')
  }
  
  if (isEmpty) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Tu carrito está vacío
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Agrega productos para continuar con tu compra
        </Typography>
        <Button 
          variant="contained" 
          size="large"
          onClick={() => router.push('/catalogo')}
        >
          Ir al Catálogo
        </Button>
      </Box>
    )
  }
  
  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Carrito de Compras</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined"
            onClick={() => router.push('/catalogo')}
          >
            Seguir Comprando
          </Button>
          <Button 
            variant="outlined" 
            color="error"
            onClick={handleVaciarCarrito}
          >
            Vaciar Carrito
          </Button>
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        
        {/* Columna izquierda: Lista de productos */}
        <Box sx={{ flex: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {items.map(item => (
              <CarritoProductoCard
                key={item.id}
                item={item}
                onUpdateQuantity={(qty) => handleModificarCantidad(item.id, qty)}
                onRemove={() => handleQuitarProducto(item.id)}
              />
            ))}
          </Box>
        </Box>
        
        {/* Columna derecha: Resumen */}
        <Box sx={{ flex: 1 }}>
          <ResumenCarrito
            subtotal={subtotal}
            onProcederCheckout={handleProcederCheckout}
          />
        </Box>
      </Box>
    </Box>
  )
}