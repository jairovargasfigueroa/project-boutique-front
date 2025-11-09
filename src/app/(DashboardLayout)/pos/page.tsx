"use client";
import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  InputAdornment,
} from "@mui/material";
import { Search, Visibility } from "@mui/icons-material";
import { useProductos } from "@/hooks/useProductos";
import { Producto } from "@/types/productos";
import SeleccionarVarianteDialog from "./components/SeleccionarVarianteDialog";
import CarritoVenta from "./components/CarritoVenta";
import CobrarVentaDialog from "./components/CobrarVentaDialog";
import PageContainer from "../components/container/PageContainer";

export default function POSPage() {
  const { productos, loading } = useProductos();
  const [busqueda, setBusqueda] = useState("");
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(
    null
  );
  const [variantesDialogOpen, setVariantesDialogOpen] = useState(false);
  const [cobrarDialogOpen, setCobrarDialogOpen] = useState(false);

  // Filtrar productos por búsqueda
  const productosFiltrados = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (p.categoria_nombre?.toLowerCase().includes(busqueda.toLowerCase()) ?? false)
  );

  // Abrir dialog de variantes
  const handleVerVariantes = (producto: Producto) => {
    setSelectedProducto(producto);
    setVariantesDialogOpen(true);
  };

  // Abrir dialog de cobro
  const handleCobrar = () => {
    setCobrarDialogOpen(true);
  };

  // Callback después de venta exitosa
  const handleVentaExitosa = () => {
    setBusqueda("");
  };

  return (
    <PageContainer title="Punto de Venta" description="Sistema de ventas POS">
      <Box display="flex" gap={3}>
        {/* Panel izquierdo - Búsqueda y productos */}
        <Box flex={1}>
          <Box mb={3}>
            {/* Búsqueda */}
            <TextField
              fullWidth
              placeholder="Buscar producto por nombre o categoría..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Resultados de búsqueda */}
          <Box>
            <Typography variant="h6" mb={2}>
              {busqueda
                ? `Resultados (${productosFiltrados.length})`
                : "Productos disponibles"}
            </Typography>

            {loading ? (
              <Typography>Cargando productos...</Typography>
            ) : productosFiltrados.length === 0 ? (
              <Typography color="textSecondary">
                {busqueda
                  ? "No se encontraron productos"
                  : "No hay productos disponibles"}
              </Typography>
            ) : (
              <Box display="flex" flexDirection="column" gap={2}>
                {productosFiltrados.map((producto) => (
                  <Card key={producto.id} elevation={2}>
                    <Box display="flex">
                      <CardMedia
                        component="img"
                        sx={{ width: 120, objectFit: "cover" }}
                        image={
                          producto.image || "/images/products/default.jpg"
                        }
                        alt={producto.nombre}
                      />
                      <CardContent sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          {producto.nombre}
                        </Typography>
                        <Box display="flex" gap={1} mb={1}>
                          <Chip
                            label={producto.categoria_nombre}
                            size="small"
                            color="primary"
                          />
                          {producto.genero && (
                            <Chip label={producto.genero} size="small" />
                          )}
                        </Box>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          mt={1}
                        >
                          <Typography variant="body2" color="textSecondary">
                            Stock: {producto.stock || 0} unidades
                          </Typography>
                          <Button
                            variant="contained"
                            startIcon={<Visibility />}
                            onClick={() => handleVerVariantes(producto)}
                          >
                            Ver variantes
                          </Button>
                        </Box>
                      </CardContent>
                    </Box>
                  </Card>
                ))}
              </Box>
            )}
          </Box>
        </Box>

        {/* Panel derecho - Carrito */}
        <Box width="40%" minWidth="400px">
          <Box height="calc(100vh - 200px)">
            <CarritoVenta onCobrar={handleCobrar} />
          </Box>
        </Box>
      </Box>

      {/* Dialogs */}
      {selectedProducto && (
        <SeleccionarVarianteDialog
          open={variantesDialogOpen}
          onClose={() => setVariantesDialogOpen(false)}
          producto={selectedProducto}
        />
      )}

      <CobrarVentaDialog
        open={cobrarDialogOpen}
        onClose={() => setCobrarDialogOpen(false)}
        onSuccess={handleVentaExitosa}
      />
    </PageContainer>
  );
}
