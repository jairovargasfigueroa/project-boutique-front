"use client";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useCartStore, { selectIsEmpty, selectSubtotal } from "@/store/cartStore";
import { useVentaDetalle } from "@/hooks/useVentas";
import FormularioDatos from "./components/FormularioDatos";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const vaciarCarrito = useCartStore((state) => state.vaciarCarrito);
  const carritoVacio = useCartStore(selectIsEmpty);
  const subtotal = useCartStore(selectSubtotal);

  const { crearVenta, loading, error } = useVentaDetalle();
  const [datosCliente, setDatosCliente] = useState<any>(null);

  const handleConfirmarPedido = async () => {
    if (carritoVacio) {
      alert("El carrito está vacío");
      return;
    }

    try {
      // Obtener ID del cliente si existe
      const clienteId = datosCliente?.cliente
        ? parseInt(datosCliente.cliente)
        : null;

      const ventaData = {
        cliente: clienteId,
        items: items.map((item) => ({
          variante_id: item.variante.id,
          cantidad: item.cantidad,
        })),
        tipo_venta: "contado" as const,
        origen: "ecommerce" as const,
      };

      console.log("Creando venta:", ventaData);

      const venta = await crearVenta(ventaData);

      console.log("Venta creada exitosamente:", venta);

      vaciarCarrito();

      router.push(`/pago?venta=${venta.id}`);
    } catch (err) {
      console.error("Error:", err);
      alert("Error al procesar el pedido. Por favor intenta nuevamente.");
    }
  };

  if (carritoVacio) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Tu carrito está vacío
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push("/catalogo")}
          sx={{ mt: 2 }}
        >
          Ir al catálogo
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" gutterBottom>
        Finalizar Compra
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
          mt: 3,
        }}
      >
        {/* Columna izquierda: Formulario */}
        <FormularioDatos disabled={false} onDatosChange={setDatosCliente} />

        {/* Columna derecha: Resumen simple (inline) */}
        <Box>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Resumen del Pedido
              </Typography>

              <Divider sx={{ my: 2 }} />

              {/* Listado simple de productos */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {items.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      pb: 2,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {item.producto.nombre}
                      </Typography>
                      {item.variante.talla && (
                        <Typography variant="body2" color="text.secondary">
                          Talla: {item.variante.talla}
                        </Typography>
                      )}
                      <Typography variant="body2" color="text.secondary">
                        Cantidad: {item.cantidad}
                      </Typography>
                    </Box>

                    <Typography variant="body1" fontWeight="bold">
                      ${(item.precioUnitario * item.cantidad).toLocaleString()}
                    </Typography>
                  </Box>
                ))}

                {/* Total */}
                <Divider sx={{ my: 1 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6">Subtotal:</Typography>
                  <Typography variant="h6" color="primary">
                    ${subtotal.toLocaleString()}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h5" fontWeight="bold">
                    Total:
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="primary">
                    ${subtotal.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {/* Botones */}
          <Box sx={{ mt: 3, display: "flex", gap: 2, flexDirection: "column" }}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleConfirmarPedido}
              disabled={loading}
              startIcon={
                loading && <CircularProgress size={20} color="inherit" />
              }
            >
              {loading ? "Procesando..." : "Confirmar Pedido"}
            </Button>

            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={() => router.push("/carrito")}
              disabled={loading}
            >
              Volver al Carrito
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
