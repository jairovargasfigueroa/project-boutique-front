export interface Producto {

  id: number;
  nombre: string;
  categoria: string;
  precio_base: number;
  genero : string;
  descripcion:string;
  imagen?:string;
}

export interface ProductoVariante {
  id: number;
  talla : string;
  color: string;
  precio_venta?: number;
  precio_costo?: number;
  imagen?: string;
  stock: number;
  stock_minimo?: number;
  genero?: string;
  producto:number;
}


