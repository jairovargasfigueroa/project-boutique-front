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
    },
    {
        id: uniqueId(),
        title: "Dashboard 2",
        icon: "chart-line-duotone",
        href: "https://spike-nextjs-pro-main.vercel.app/dashboards/dashboard2",

        chip: "Pro",
    },

    {
        id: uniqueId(),
        title: "Productos",
        icon: "box-linear",
        href: "/productos",
    },

    {
        id: uniqueId(),
        title: "Catalogo",
        icon: "box-linear",
        href: "/catalogo",
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
    },

    {
        id: uniqueId(),
        title: "Table",
        icon: "tablet-line-duotone",
        href: "/table",
    },

    {
        id: uniqueId(),
        title: "Form",
        icon: "window-frame-broken",
        href: "/sample-form",
    },
    {
        id: uniqueId(),
        title: "Sample Page",
        icon: "window-frame-broken",
        href: "/sample-page",
    },
    {
        id: uniqueId(),
        title: "Typography",
        icon: "text-bold-square-line-duotone",
        href: "/utilities/typography",
    },
    {
        id: uniqueId(),
        title: "Shadow",
        icon: "box-minimalistic-broken",
        href: "/utilities/shadow",
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
    },
    {
        id: uniqueId(),
        title: "Register",
        icon: "shield-user-linear",
        href: "/authentication/register",
    },

    {
        id: uniqueId(),
        title: "Disabled",
        icon: "forbidden-circle-line-duotone",
        href: "",
        disabled: true,
    },

    {
        id: uniqueId(),
        title: "External Link",
        external: true,
        icon: "link-bold-duotone",
        href: "https://google.com",
    },
];

export default Menuitems;
