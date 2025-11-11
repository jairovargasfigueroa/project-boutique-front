import { uniqueId } from "lodash";
interface MenuitemsType {
  [x: string]: any;
  id?: string;
  navlabel?: boolean;
  subheader?: string;
  title?: string;
  icon?: any;
  href?: string;
  children?: MenuitemsType[];
  bgcolor?: any;
  chip?: string;
  chipColor?: string;
  variant?: string;
  external?: boolean;
  roles?: ('admin' | 'vendedor' | 'cliente')[];
}

const Menuitems: MenuitemsType[] = [
  {
    navlabel: true,
    subheader: "HOME",
  },

  {
    id: uniqueId(),
    title: "Dashboard",
    icon: "screencast-2-line-duotone",
    href: "/",
    roles: ['admin', 'vendedor', 'cliente'],
  },
  {
    id: uniqueId(),
    title: "Punto de Venta",
    icon: "shopping-cart-line-duotone",
    href: "/pos",
    roles: ['admin', 'vendedor'],
  },

  {
    id: uniqueId(),
    title: "Ventas",
    icon: "bill-list-line-duotone",
    href: "/ventas",
    roles: ['admin', 'vendedor'],
  },

  {
    id: uniqueId(),
    title: "Inventario",
    icon: "box-linear",
    href: "/productos",
    roles: ['admin', 'vendedor'],
  },

  {
    id: uniqueId(),
    title: "Catalogo",
    icon: "box-linear",
    href: "/catalogo",
    roles: ['admin', 'vendedor', 'cliente'],
  },
  {
    id: uniqueId(),
    title: "Categorías",
    icon: "category-2-line-duotone",
    href: "/categorias",
    roles: ['admin', 'vendedor'],
  },

  {
    id: uniqueId(),
    title: "Usuarios",
    icon: "users-group-rounded-line-duotone",
    href: "/usuarios",
    roles: ['admin'],
  },

  {
    navlabel: true,
    subheader: "UTILITIES",
  },

  {
    id: uniqueId(),
    title: "Icons",
    icon: "smile-circle-linear",
    href: "/icons",
    roles: ['admin'],
  },

  {
    id: uniqueId(),
    title: "Table",
    icon: "tablet-line-duotone",
    href: "/table",
    roles: ['admin'],
  },

  {
    id: uniqueId(),
    title: "Form",
    icon: "window-frame-broken",
    href: "/sample-form",
    roles: ['admin'],
  },
  {
    id: uniqueId(),
    title: "Sample Page",
    icon: "window-frame-broken",
    href: "/sample-page",
    roles: ['admin'],
  },
  {
    id: uniqueId(),
    title: "Typography",
    icon: "text-bold-square-line-duotone",
    href: "/utilities/typography",
    roles: ['admin'],
  },
  {
    id: uniqueId(),
    title: "Shadow",
    icon: "box-minimalistic-broken",
    href: "/utilities/shadow",
    roles: ['admin'],
  },

  {
    navlabel: true,
    subheader: "AUTH",
  },
  {
    id: uniqueId(),
    title: "Login",
    icon: "login-2-broken",
    href: "/authentication/login",
    roles: ['admin', 'vendedor', 'cliente'],
  },
  {
    id: uniqueId(),
    title: "Register",
    icon: "shield-user-linear",
    href: "/authentication/register",
    roles: ['admin', 'vendedor', 'cliente'],
  },

  {
    id: uniqueId(),
    title: "Disabled",
    icon: "forbidden-circle-line-duotone",
    href: "",
    disabled: true,
    roles: ['admin'],
  },

  {
    id: uniqueId(),
    title: "External Link",
    external: true,
    icon: "link-bold-duotone",
    href: "https://google.com",
    roles: ['admin'],
  },
];

export default Menuitems;
