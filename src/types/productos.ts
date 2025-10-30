export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  imagen?: string;
  estado?: string;
  descripcion:string;
}

