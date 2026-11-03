import {
  FileText,
  FolderTree,
  Layers,
  type LucideIcon,
  Settings,
  ShoppingBag,
  TicketPercent,
  Users,
  Warehouse,
} from "lucide-react";

export type NavLink = { title: string; href: string };
export type NavItem = { title: string; href: string; icon: LucideIcon; items?: NavLink[] };
export type NavGroup = { title: string; items: NavItem[] };

export const navGroups: NavGroup[] = [
  {
    title: "Dashboards",
    items: [
      {
        title: "E-commerce",
        href: "/dashboard/ecommerce",
        icon: ShoppingBag,
        items: [
          { title: "Dashboard", href: "/dashboard/ecommerce" },
          { title: "Product List", href: "/dashboard/pages/products" },
          { title: "Product Detail", href: "/dashboard/pages/products/1" },
          { title: "Add Product", href: "/dashboard/pages/products/create" },
          { title: "Order List", href: "/dashboard/pages/orders" },
          { title: "Order Detail", href: "/dashboard/pages/orders/detail" },
        ],
      },
    ],
  },
  {
    title: "Store",
    items: [
      { title: "Categories", href: "/dashboard/pages/categories", icon: FolderTree },
      { title: "Collections", href: "/dashboard/pages/collections", icon: Layers },
      { title: "Inventory", href: "/dashboard/pages/inventory", icon: Warehouse },
      { title: "Customers", href: "/dashboard/pages/customers", icon: Users },
      { title: "Discounts", href: "/dashboard/pages/discounts", icon: TicketPercent },
      { title: "Content", href: "/dashboard/pages/content", icon: FileText },
      { title: "Settings", href: "/dashboard/pages/settings", icon: Settings },
    ],
  },
];
