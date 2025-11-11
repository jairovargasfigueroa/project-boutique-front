import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Producto, ProductoVariante } from "@/types/productos";

export interface CartItem {
  id: number; // id de la variante (verdadero)
  producto: Producto; // info general (nombre, categoría, descripción)
  variante: ProductoVariante; // info específica (talla, color, precio, stock)
  cantidad: number;
  precioUnitario: number; // snapshot del precio al momento de agregar
}

export interface CartStore {
  items: CartItem[];
  agregarProducto: (
    producto: Producto,
    variante: ProductoVariante,
    cantidad?: number
  ) => void;
  quitarProducto: (id: number) => void;
  modificarCantidad: (id: number, cantidad: number) => void;
  vaciarCarrito: () => void;
}

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      agregarProducto: (producto, variante, cantidad = 1) => {
        console.log("🛒 AGREGANDO AL CARRITO:", {
          producto: producto.nombre,
          variante: `${variante.talla}`,
          cantidad,
          precio: variante.precio,
        });

        const { items } = get();
        const existingItem = items.find((item) => item.id === variante.id);

        if (existingItem) {
          console.log(
            "✅ Producto ya existe, aumentando cantidad de",
            existingItem.cantidad,
            "a",
            existingItem.cantidad + cantidad
          );
          set({
            items: items.map((item) =>
              item.id === variante.id
                ? { ...item, cantidad: item.cantidad + cantidad }
                : item
            ),
          });
        } else {
          console.log("✅ Nuevo producto agregado al carrito");
          const newItem: CartItem = {
            id: variante.id,
            producto,
            variante,
            cantidad,
            precioUnitario:
              typeof variante.precio === "string"
                ? parseFloat(variante.precio)
                : variante.precio || 0, // snapshot del precio
          };
          set({ items: [...items, newItem] });
        }

        const updatedItems = get().items;
        console.log("📦 ESTADO ACTUAL DEL CARRITO:", {
          totalItems: updatedItems.length,
          productos: updatedItems.map((item) => ({
            nombre: item.producto.nombre,
            cantidad: item.cantidad,
            talla: item.variante.talla,
            subtotal: item.precioUnitario * item.cantidad,
          })),
          total: updatedItems.reduce(
            (total, item) => total + item.precioUnitario * item.cantidad,
            0
          ),
        });
      },

      quitarProducto: (id) => {
        const itemToRemove = get().items.find((item) => item.id === id);
        if (itemToRemove) {
          console.log("🗑️ QUITANDO DEL CARRITO:", {
            producto: itemToRemove.producto.nombre,
            cantidad: itemToRemove.cantidad,
            talla: itemToRemove.variante.talla,
          });
        }

        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));

        const updatedItems = get().items;
        console.log("📦 CARRITO DESPUÉS DE QUITAR:", {
          totalItems: updatedItems.length,
          productos: updatedItems.map((item) => ({
            nombre: item.producto.nombre,
            cantidad: item.cantidad,
          })),
        });
      },

      modificarCantidad: (id, cantidad) => {
        const item = get().items.find((item) => item.id === id);

        if (item) {
          console.log("🔄 MODIFICANDO CANTIDAD:", {
            producto: item.producto.nombre,
            cantidadAnterior: item.cantidad,
            cantidadNueva: cantidad,
          });
        }

        if (cantidad <= 0) {
          get().quitarProducto(id);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, cantidad } : item
          ),
        }));

        const updatedItems = get().items;
        console.log("📦 CARRITO DESPUÉS DE MODIFICAR:", {
          totalItems: updatedItems.length,
          total: updatedItems.reduce(
            (total, item) => total + item.precioUnitario * item.cantidad,
            0
          ),
        });
      },

      vaciarCarrito: () => {
        const { items } = get();
        console.log("🧹 VACIANDO CARRITO:", {
          itemsEliminados: items.length,
          productos: items.map((item) => item.producto.nombre),
        });
        set({ items: [] });
        console.log("📦 CARRITO VACÍO ✅");
      },
    }),
    {
      name: "boutique-cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCartStore;

export const selectTotalItems = (state: CartStore) =>
  state.items.reduce((total, item) => total + item.cantidad, 0);

export const selectSubtotal = (state: CartStore) =>
  state.items.reduce(
    (total, item) => total + item.precioUnitario * item.cantidad,
    0
  );

export const selectIsEmpty = (state: CartStore) => state.items.length === 0;
