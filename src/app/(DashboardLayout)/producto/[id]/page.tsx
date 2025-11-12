// app/(DashboardLayout)/producto/[id]/page.tsx

'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  Box, 
  Typography, 
  Button, 
  CircularProgress, 
  Chip,
  Stack
} from '@mui/material'
import useCartStore from '@/store/cartStore'
import { useProductoDetalle } from '@/hooks/useProductoDetalle'



export default function ProductoDetallePage() {
  const params = useParams()
  const router = useRouter()
  const productoId = Number(params.id)
  
  console.log("📄 ProductoDetallePage - Renderizado con params:", params);
  console.log("📄 ProductoDetallePage - ID extraído:", productoId);
  
  // ✅ Hook optimizado - carga solo este producto + sus variantes
  const { producto, variantes, loading, error } = useProductoDetalle(productoId)
  const agregarProducto = useCartStore(state => state.agregarProducto)
  
  console.log("📄 Estado actual - loading:", loading, "| producto:", producto?.nombre, "| variantes:", variantes.length);
  
  const [tallaSeleccionada, setTallaSeleccionada] = useState<string | null>(null)
  
  // Imagen del producto (o placeholder si no tiene)
  const imagenActual = producto?.image || 'https://placehold.co/600x500'
  
  // Extraer tallas únicas de las variantes
  const tallasDisponibles = Array.from(
    new Set(variantes.map(v => v.talla).filter(t => t))
  )
  
  console.log("👕 Tallas disponibles:", tallasDisponibles);
  console.log("👕 Talla seleccionada:", tallaSeleccionada);
  
  // Obtener variante actual según talla seleccionada o la primera
  const varianteActual = tallaSeleccionada 
    ? variantes.find(v => v.talla === tallaSeleccionada)
    : variantes[0]
  
  console.log("🎯 Variante actual:", varianteActual);
  
  // Convertir precio a número si viene como string
  const precioMostrar = varianteActual?.precio 
    ? Number(varianteActual.precio)
    : 0
  const stockMostrar = varianteActual?.stock || 0
  
  console.log("💰 Precio a mostrar:", precioMostrar, "| Stock:", stockMostrar);
  
  const handleSeleccionarTalla = (talla: string) => {
    console.log("👆 Usuario seleccionó talla:", talla);
    setTallaSeleccionada(talla)
  }
  
  const handleAgregarCarrito = () => {
    console.log("🛒 Intentando agregar al carrito...");
    if (!producto || !varianteActual) return
    if (tallasDisponibles.length > 0 && !tallaSeleccionada) return
    
    console.log("✅ Agregando:", { producto: producto.nombre, variante: varianteActual, cantidad: 1 });
    agregarProducto(producto, varianteActual, 1)
    router.push('/carrito')
  }
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }
  
  if (error || !producto) {
    return (
      <Box p={4}>
        <Typography variant="h5">{error || 'Producto no encontrado'}</Typography>
        <Button onClick={() => router.push('/catalogo')}>
          Volver al catálogo
        </Button>
      </Box>
    )
  }
  
  return (
    <Box sx={{ p: 4 }}>
      <Button 
        variant="outlined" 
        onClick={() => router.push('/catalogo')}
        sx={{ mb: 3 }}
      >
        ← Volver al Catálogo
      </Button>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, 
        gap: 4 
      }}>
        {/* COLUMNA IZQUIERDA - Galería de Imágenes */}
        <Box>
          <Box>
            {/* Imagen Principal */}
            <Box
              component="img"
              src={imagenActual}
              alt={producto.nombre}
              sx={{
                width: '100%',
                height: 500,
                objectFit: 'cover',
                borderRadius: 2,
              }}
            />
          </Box>
        </Box>

        {/* COLUMNA DERECHA - Información y Selector */}
        <Box>
          <Stack spacing={3}>
            {/* Título y Categorías */}
            <Box>
              <Typography variant="h3" gutterBottom>
                {producto.nombre}
              </Typography>
              
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Chip label={producto.categoria} color="primary" size="small" />
                <Chip label={producto.genero} color="secondary" size="small" />
              </Stack>
            </Box>

            {/* Descripción */}
            <Typography variant="body1" color="text.secondary">
              {producto.descripcion || 'Sin descripción disponible'}
            </Typography>

            {/* Selector de Tallas (solo si hay tallas) */}
            {tallasDisponibles.length > 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Selecciona una Talla:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {tallasDisponibles.map((talla) => talla && (
                    <Button
                      key={talla}
                      variant={tallaSeleccionada === talla ? 'contained' : 'outlined'}
                      onClick={() => handleSeleccionarTalla(talla)}
                      sx={{
                        minWidth: 60,
                        height: 50,
                        fontSize: '1rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {talla}
                    </Button>
                  ))}
                </Stack>
              </Box>
            )}

            {/* Precio */}
            <Box>
              <Typography variant="h4" color="primary" fontWeight="bold">
                ${precioMostrar.toLocaleString()}
              </Typography>
              {tallasDisponibles.length > 0 && !tallaSeleccionada && (
                <Typography variant="body2" color="text.secondary">
                  Selecciona una talla para ver el precio
                </Typography>
              )}
            </Box>

            {/* Stock */}
            {varianteActual && (
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body1" fontWeight="bold">
                  Stock:
                </Typography>
                <Chip 
                  label={`${stockMostrar} unidades`}
                  size="small"
                  color={stockMostrar > 0 ? 'success' : 'error'}
                />
              </Stack>
            )}

            {/* Botón Agregar al Carrito */}
            <Button
              variant="contained"
              size="large"
              fullWidth
              disabled={
                !varianteActual || 
                stockMostrar === 0 || 
                (tallasDisponibles.length > 0 && !tallaSeleccionada)
              }
              onClick={handleAgregarCarrito}
              sx={{ py: 2 }}
            >
              {!varianteActual 
                ? 'Cargando...'
                : stockMostrar === 0 
                  ? 'Sin Stock' 
                  : tallasDisponibles.length > 0 && !tallaSeleccionada
                    ? 'Selecciona una Talla'
                    : 'Agregar al Carrito'
              }
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}