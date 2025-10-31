import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Producto } from '@/types/productos'

export interface CartItem {
  id: string
  producto: Producto
  cantidad: number
  talla?: string
  color?: string
  precioUnitario: number
}

export interface CartStore {
  items: CartItem[]
  agregarProducto: (producto: Producto, cantidad?: number, talla?: string, color?: string) => void
  quitarProducto: (id: string) => void
  modificarCantidad: (id: string, cantidad: number) => void
  vaciarCarrito: () => void
}

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      agregarProducto: (producto, cantidad = 1, talla, color) => {
        const { items } = get()
        const itemId = `${producto.id}-${talla || 'notalla'}-${color || 'nocolor'}`
        const existingItem = items.find(item => item.id === itemId)

        if (existingItem) {
          set({
            items: items.map(item =>
              item.id === itemId
                ? { ...item, cantidad: item.cantidad + cantidad }
                : item
            )
          })
        } else {
          const newItem: CartItem = {
            id: itemId,
            producto,
            cantidad,
            talla,
            color,
            precioUnitario: producto.precio_base
          }
          set({ items: [...items, newItem] })
        }
      },

      quitarProducto: (id) => {
        set(state => ({
          items: state.items.filter(item => item.id !== id)
        }))
      },

      modificarCantidad: (id, cantidad) => {
        if (cantidad <= 0) {
          get().quitarProducto(id)
          return
        }

        set(state => ({
          items: state.items.map(item =>
            item.id === id ? { ...item, cantidad } : item
          )
        }))
      },

      vaciarCarrito: () => {
        set({ items: [] })
      }
    }),
    {
      name: 'boutique-cart-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
)

export default useCartStore

export const selectTotalItems = (state: CartStore) =>
  state.items.reduce((total, item) => total + item.cantidad, 0)

export const selectSubtotal = (state: CartStore) =>
  state.items.reduce((total, item) => total + item.precioUnitario * item.cantidad, 0)

export const selectIsEmpty = (state: CartStore) =>
  state.items.length === 0