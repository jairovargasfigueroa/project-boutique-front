export interface TableColumn {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  render?: (value: any, row: any) => React.ReactNode;
  width?: string;
}

export interface GenericTableProps {
  title: string;
  subtitle?: string;
  columns: TableColumn[];
  data: any[];
  loading?: boolean;
  emptyMessage?: string;
  actions?: (row: any) => React.ReactNode;
  action?: React.ReactNode; // Para botones en el header (ej: "Agregar nuevo")
}
