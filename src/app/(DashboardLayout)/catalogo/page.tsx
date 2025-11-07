'use client'

import { Box } from '@mui/material'
import { useRouter } from 'next/navigation'
import useCartStore from '@/store/cartStore'
import { useProductos } from '@/hooks/useProductos'
import CatalogoProductoCard from './components/CatalogoProductoCard'
import { Producto } from '@/types/productos'

export default function CatalogoPage() {
  const router = useRouter()
  const { productos, loading } = useProductos()
  
  // HANDLERS (Lógica aquí)
  const handleClickCard = (producto: Producto) => {
    router.push(`/producto/${producto.id}`)
  }
  
  const handleAgregarCarrito = (producto: Producto) => {
    // Redirigir a detalle para seleccionar variante (talla/color)
    router.push(`/producto/${producto.id}`)
  }
  
  if (loading) return <div>Cargando...</div>
  
  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 3,
        }}
      >
        {productos.map(producto => (
          <CatalogoProductoCard
            key={producto.id}
            producto={producto}
            onClickCard={handleClickCard}
            onAgregarCarrito={handleAgregarCarrito}
          />
        ))}
      </Box>
    </Box>
  )
}