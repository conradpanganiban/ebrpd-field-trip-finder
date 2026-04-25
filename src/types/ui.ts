import { Program } from "./program";

// UI-related types
export type ViewMode = "card" | "table";

export type SortDirection = "asc" | "desc";

export type FilterState = {
  grades: string[];
  formats: string[];
  fees: string[];
  programHosts: string[];
  applicationStatuses: string[];
};

export type TableColumn = {
  id: string;
  header: string;
  accessorKey: keyof Program;
  cell?: (value: any) => React.ReactNode;
  sortable?: boolean;
};

export type ColorScheme = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  border: string;
};

export type Theme = "light" | "dark";

// Type guards
export const isViewMode = (value: string): value is ViewMode => {
  return ["card", "table"].includes(value);
};

export const isSortDirection = (value: string): value is SortDirection => {
  return ["asc", "desc"].includes(value);
};

export const isTheme = (value: string): value is Theme => {
  return ["light", "dark"].includes(value);
};

export const isFilterState = (value: unknown): value is FilterState => {
  if (!value || typeof value !== "object") return false;
  const filter = value as FilterState;
  return (
    Array.isArray(filter.grades) &&
    Array.isArray(filter.formats) &&
    Array.isArray(filter.fees) &&
    Array.isArray(filter.programHosts) &&
    Array.isArray(filter.applicationStatuses)
  );
}; 