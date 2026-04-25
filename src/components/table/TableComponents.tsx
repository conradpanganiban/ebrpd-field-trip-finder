import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Program } from "@/types/program";
import { getProgramHostColor } from "@/styles/colors";
import { flexRender } from "@tanstack/react-table";

interface TableHeaderProps {
  column: any;
  children: React.ReactNode;
}

export const SortableTableHeader = ({ column, children }: TableHeaderProps) => (
  <Button
    variant="ghost"
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    className="p-0 hover:bg-transparent"
  >
    {children}
    <ArrowUpDown className="ml-2 h-4 w-4" />
  </Button>
);

interface TableRowProps {
  program: Program;
  children: React.ReactNode;
  onClick?: () => void;
}

export const ProgramTableRow = ({ program, children, onClick }: TableRowProps) => {
  const borderColor = getProgramHostColor(program.program_host);
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
  };
  
  return (
    <TableRow
      style={{ borderLeft: `8px solid ${borderColor}` }}
      onClick={handleClick}
      className="cursor-pointer hover:bg-muted transition-colors md:py-1"
    >
      {children}
    </TableRow>
  );
};

interface TableContainerProps {
  children: React.ReactNode;
}

export const TableContainer = ({ children }: TableContainerProps) => (
  <div className="rounded-md border">
    <Table>
      {children}
    </Table>
  </div>
);

interface TableContentProps {
  headerGroups: any[];
  rowModel: any;
  columns: any[];
  onRowClick?: (program: Program) => void;
  className?: string;
}

export const TableContent = ({ headerGroups, rowModel, columns, onRowClick, className }: TableContentProps) => (
  <>
    <TableHeader>
      {headerGroups.map((headerGroup) => (
        <TableRow key={headerGroup.id} className="md:py-2">
          {headerGroup.headers.map((header: any) => (
            <TableHead key={header.id} className="md:py-2">
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableHeader>
    <TableBody className={className}>
      {rowModel.rows?.length ? (
        rowModel.rows.map((row: any) => (
          <ProgramTableRow
            key={row.id}
            program={row.original}
            onClick={() => onRowClick?.(row.original)}
          >
            {row.getVisibleCells().map((cell: any) => (
              <TableCell 
                key={cell.id}
                className="align-top"
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </ProgramTableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            No results.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </>
); 