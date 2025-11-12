// app/(DashboardLayout)/producto/[id]/page.tsx

'use client'

import { useState, useEffect } from 'react'
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
import { useProductos } from '@/hooks/useProductos'



export default function ProductoDetallePage() {
  const params = useParams()
  const router = useRouter()
  const productoId = params.id as string
  
  const { productos, variantes, loadingVariantes, fetchVariantes } = useProductos()
  const agregarProducto = useCartStore(state => state.agregarProducto)
  
  const producto = productos.find(p => p.id.toString() === productoId)
  
  const [tallaSeleccionada, setTallaSeleccionada] = useState<string | null>(null)
  const [imagenActual, setImagenActual] = useState<string>('')
  
  // Cargar variantes cuando se monta el componente
  useEffect(() => {
    if (productoId) {
      fetchVariantes(Number(productoId))
    }
  }, [productoId, fetchVariantes])
  
  // Establecer imagen inicial
  useEffect(() => {
    if (producto?.image) {
      setImagenActual(producto.image)
    } else {
      setImagenActual('https://placehold.co/600x500')
    }
  }, [producto, variantes])
  
  // Extraer tallas únicas de las variantes
  const tallasDisponibles = Array.from(
    new Set(variantes.map(v => v.talla).filter(t => t))
  )
  
  // Obtener variante actual según talla seleccionada o la primera
  const varianteActual = tallaSeleccionada 
    ? variantes.find(v => v.talla === tallaSeleccionada)
    : variantes[0]
  
  // Convertir precio a número si viene como string
  const precioMostrar = varianteActual?.precio 
    ? (typeof varianteActual.precio === 'string' ? parseFloat(varianteActual.precio) : varianteActual.precio)
    : 0
  const stockMostrar = varianteActual?.stock || 0
  
  const handleSeleccionarTalla = (talla: string) => {
    setTallaSeleccionada(talla)
  }
  
  const handleAgregarCarrito = () => {
    if (!varianteActual) return
    if (tallasDisponibles.length > 0 && !tallaSeleccionada) return
    
    agregarProducto(producto!, varianteActual, 1)
    router.push('/carrito')
  }
  
  // Obtener imágenes para la galería (ahora solo la imagen del producto)
  const imagenesGaleria = [
    producto?.image,
  ].filter(Boolean) as string[]
  
  if (loadingVariantes) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }
  
  if (!producto) {
    return (
      <Box p={4}>
        <Typography variant="h5">Producto no encontrado</Typography>
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
              src={imagenActual || 'https://placehold.co/600x500'}
              alt={producto.nombre}
              sx={{
                width: '100%',
                height: 500,
                objectFit: 'cover',
                borderRadius: 2,
                mb: 2
              }}
            />
            
            {/* Miniaturas */}
            {imagenesGaleria.length > 1 && (
              <Stack direction="row" spacing={1} sx={{ overflowX: 'auto' }}>
                {imagenesGaleria.map((img, index) => (
                  <Box
                    key={index}
                    component="img"
                    src={img}
                    alt={`${producto.nombre} ${index + 1}`}
                    onClick={() => setImagenActual(img)}
                    sx={{
                      width: 80,
                      height: 80,
                      objectFit: 'cover',
                      borderRadius: 1,
                      cursor: 'pointer',
                      border: imagenActual === img ? '3px solid' : '1px solid',
                      borderColor: imagenActual === img ? 'primary.main' : 'grey.300',
                      '&:hover': {
                        opacity: 0.8
                      }
                    }}
                  />
                ))}
              </Stack>
            )}
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