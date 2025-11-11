'use client'

import { Box } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useProductos } from '@/hooks/useProductos'
import { FiltrosProducto } from '@/types/productos'
import { Producto } from '@/types/productos'
import CatalogoProductoCard from './components/CatalogoProductoCard'
import FiltrosSidebar from './components/FiltrosSidebar'
import FiltrosActivos from './components/FiltrosActivos'

export default function CatalogoPage() {
  const router = useRouter()
  const [filtros, setFiltros] = useState<FiltrosProducto>({})
  const { productos, loading } = useProductos(filtros)
  
  // HANDLERS
  const handleClickCard = (producto: Producto) => {
    router.push(`/producto/${producto.id}`)
  }
  
  const handleAgregarCarrito = (producto: Producto) => {
    // Redirigir a detalle para seleccionar variante (talla/color)
    router.push(`/producto/${producto.id}`)
  }

  const handleFiltrosChange = (nuevosFiltros: FiltrosProducto) => {
    setFiltros(nuevosFiltros)
  }

  const handleLimpiarFiltros = () => {
    setFiltros({})
  }

  const handleEliminarFiltro = (key: keyof FiltrosProducto) => {
    const newFiltros = { ...filtros }
    delete newFiltros[key]
    
    // Si es precio_min, también eliminar precio_max
    if (key === 'precio_min' && 'precio_max' in newFiltros) {
      delete newFiltros.precio_max
    }
    
    setFiltros(newFiltros)
  }
  
  if (loading) return <div>Cargando...</div>
  
  return (
    <Box sx={{ display: 'flex', gap: 3, p: 3 }}>
      {/* SIDEBAR - Filtros */}
      <Box sx={{ width: 280, flexShrink: 0 }}>
        <FiltrosSidebar
          filtros={filtros}
          onChange={handleFiltrosChange}
          onLimpiar={handleLimpiarFiltros}
        />
      </Box>

      {/* ÁREA PRINCIPAL - Productos */}
      <Box sx={{ flex: 1 }}>
        {/* Filtros Activos */}
        <FiltrosActivos
          filtros={filtros}
          onEliminar={handleEliminarFiltro}
          onLimpiarTodo={handleLimpiarFiltros}
        />

        {/* Grid de Productos */}
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
    </Box>
  )
}