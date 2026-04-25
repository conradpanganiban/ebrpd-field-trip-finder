import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Program } from "@/types/program";
import { Circle } from "lucide-react";
import { getApplicationStatus } from "@/utils/applicationStatusUtils";
import { getStatusColor } from "@/utils/statusUtils";
import { statusColors } from "@/styles/colors";
import { SortableTableHeader, TableContainer, TableContent } from "./table/TableComponents";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProgramModal } from "./ProgramModal";
import { getHostDefaultStatuses, shouldUseCustomStatuses } from "@/utils/hostStatusUtils";
import { seasonDateRanges } from "@/utils/seasonDateRanges";
import { FeeModal } from "./FeeModal";
import { getJsonFileFromHostName } from "@/utils/hostUtils";
import { isSpecificCoyoteHillsProgram } from "@/utils/programUtils";

interface TableViewProps {
  programs: Program[];
}

// Map program host names to hostStatusConfig keys
const hostNameMap: Record<string, string> = {
  "Ardenwood Historic Farm": "Ardenwood",
  "Big Break Visitor Center": "BigBreak",
  "Black Diamond Mines Visitor Center": "BlackDiamond",
  "Coyote Hills Visitor Center": "CoyoteHills",
  "Doug Siden Crab Cove Visitor Center": "CrabCove",
  "Del Valle Visitor Center": "DelValle",
  "Mobile Education": "MobileEducation",
  "Radke Martinez Regional Shoreline": "RadkeMartinez",
  "Sunol Visitor Center": "Sunol",
  "Thurgood Marshall Regional Park - Home of the Port Chicago 50": "ThurgoodMarshall",
  "Tilden Environmental Education Center": "TildenNatureArea"
};

export const TableView = React.memo<TableViewProps>(({ programs }) => {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    description: false
  });
  const [columnFilters, setColumnFilters] = useState<any[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [selectedFeeProgram, setSelectedFeeProgram] = useState<Program | null>(null);
  const [randomFirstCenter, setRandomFirstCenter] = useState<string | null>(null);

  // Initialize random center when component mounts
  useEffect(() => {
    if (programs.length > 0) {
      const uniqueCenters = [...new Set(programs.map(p => p.visitor_center))];
      const randomCenter = uniqueCenters[Math.floor(Math.random() * uniqueCenters.length)];
      setRandomFirstCenter(randomCenter);
      // Force a resort when random center changes
      setSorting([{ id: "visitor_center", desc: false }]);
    }
  }, [programs]);

  // Add useEffect to handle window resize
  useEffect(() => {
    const handleResize = () => {
      setColumnVisibility(prev => ({
        ...prev,
        description: window.innerWidth >= 1024
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter out any null or undefined programs
  const validPrograms = useMemo(() => 
    programs.filter(program => 
      program && 
      program.id && 
      program.program_name && 
      program.format &&
      program.visitor_center && 
      program.visitor_center !== "Unknown" && // Filter out programs with "Unknown" visitor centers
      program.program_host // Ensure program_host is defined
    ),
    [programs]
  );

  // Find the current program's index in the filtered programs array
  const selectedProgramIndex = selectedProgramId
    ? validPrograms.findIndex(p => p.id === selectedProgramId)
    : null;

  const handleRowClick = (program: Program) => {
    setSelectedProgramId(program.id);
    setIsModalOpen(true);
  };

  const columns = useMemo<ColumnDef<Program>[]>(() => [
    {
      accessorKey: "visitor_center",
      header: ({ column }) => (
        <SortableTableHeader column={column}>
          Visitor Center
        </SortableTableHeader>
      ),
      cell: ({ row }) => {
        const program = row.original;
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              const jsonFileName = getJsonFileFromHostName(program.program_host);
              if (jsonFileName) {
                navigate(`/programs/${jsonFileName}`);
              }
            }}
            className="hover:underline text-left"
          >
            {program.visitor_center}
          </button>
        );
      },
      sortingFn: (rowA, rowB) => {
        const a = rowA.original.visitor_center || '';
        const b = rowB.original.visitor_center || '';
        
        // If one of the centers is the random first center, it should come first
        if (a === randomFirstCenter) return -1;
        if (b === randomFirstCenter) return 1;
        
        // Otherwise, sort alphabetically
        return a.localeCompare(b);
      }
    },
    {
      accessorKey: "program_name",
      header: ({ column }) => (
        <SortableTableHeader column={column}>
          Program Name
        </SortableTableHeader>
      ),
      cell: ({ row }) => {
        const program = row.original;
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium">{program.program_name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "city",
      header: ({ column }) => (
        <SortableTableHeader column={column}>
          City
        </SortableTableHeader>
      ),
    },
    {
      accessorKey: "grade",
      header: ({ column }) => (
        <SortableTableHeader column={column}>
          Grade
        </SortableTableHeader>
      ),
    },
    {
      accessorKey: "learning_standards",
      header: ({ column }) => (
        <SortableTableHeader column={column}>
          Learning Standards
        </SortableTableHeader>
      ),
    },
    {
      accessorKey: "duration",
      header: ({ column }) => (
        <SortableTableHeader column={column}>
          Duration
        </SortableTableHeader>
      ),
    },
    {
      accessorKey: "format",
      header: ({ column }) => (
        <SortableTableHeader column={column}>
          Format
        </SortableTableHeader>
      ),
      cell: ({ row }) => {
        return (
          <div className="whitespace-nowrap" style={{ minWidth: "100px" }}>
            {row.getValue("format")}
          </div>
        );
      },
    },
    {
      accessorKey: "fee",
      header: ({ column }) => (
        <SortableTableHeader column={column}>
          Fee
        </SortableTableHeader>
      ),
      cell: ({ row }) => {
        const program = row.original;
        const fee = program.fee;
        
        return (
          <div className="flex items-center gap-1 whitespace-nowrap">
            <span>{fee === "yes" ? "Yes" : "No"}</span>
            <div 
              className="cursor-pointer text-[rgb(80,111,51)]"
              onClick={(e) => {
                e.stopPropagation(); // Prevent row click
                setSelectedFeeProgram(program);
                setIsFeeModalOpen(true);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
              </svg>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "application_status",
      header: ({ column }) => (
        <SortableTableHeader column={column}>Currently Scheduling</SortableTableHeader>
      ),
      cell: ({ row }) => {
        const program = row.original;
        const hostName = program.program_host;
        
        // Map the host name to the hostStatusConfig key
        const configKey = hostNameMap[hostName] || hostName;
        
        // Get the default statuses for the host
        const defaultStatuses = getHostDefaultStatuses(configKey);
        
        // Check if the program should use custom statuses
        const useCustomStatuses = shouldUseCustomStatuses(program, configKey);
        
        // Derive statuses used for list display
        let statuses = defaultStatuses;
        
        // For the two specific Coyote Hills Ohlone programs, mirror the Ardenwood pattern:
        // Spring is marked as FULLY BOOKED (closed) and Summer remains open.
        if (isSpecificCoyoteHillsProgram(program)) {
          statuses = [
            {
              id: program.id,
              season: "FULLY BOOKED Spring 2026",
              status: "closed",
              isOverride: true,
            },
            {
              id: program.id,
              season: "Summer 2026",
              status: "open",
              isOverride: true,
            },
          ];
        } else if (useCustomStatuses && program.application_status && program.application_status.length > 0) {
          // Check if any status has a valid value (not "-")
          const hasValidStatus = program.application_status.some(
            status => status.status !== "-" as any && 
            (status.status === "open" || status.status === "closed" || status.status === "waitlist")
          );
          
          if (hasValidStatus) {
            statuses = program.application_status;
          }
        }
        
        // Find all open seasons
        const openSeasons = statuses.filter(status => status.status === "open");
        
        if (openSeasons.length > 0) {
          return (
            <div className="flex flex-col gap-2">
              {openSeasons.map((season, index) => {
                // Get the date range for the open season
                const dateRange = seasonDateRanges[season.season];
                
                // Format the date range
                const formatDate = (date: Date) => {
                  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                };
                
                const dateRangeText = dateRange 
                  ? `${formatDate(dateRange.start)} - ${formatDate(dateRange.end)}` 
                  : '';
                
                return (
                  <div key={index} className="flex items-center gap-2 whitespace-nowrap">
                    <Circle
                      className="h-3 w-3 flex-shrink-0"
                      style={{
                        fill: statusColors.open.fill,
                        color: statusColors.open.text
                      }}
                    />
                    <span className="text-sm">{season.season}</span>
                    <span className="text-sm text-gray-500">
                      ({dateRangeText})
                    </span>
                  </div>
                );
              })}
            </div>
          );
        } else {
          return (
            <div className="flex items-center gap-2 whitespace-nowrap">
              <Circle
                className="h-3 w-3 flex-shrink-0"
                style={{
                  fill: statusColors.closed.fill,
                  color: statusColors.closed.text
                }}
              />
              <span className="text-sm">Closed</span>
            </div>
          );
        }
      },
    },
    {
      accessorKey: "max_students",
      header: ({ column }) => (
        <SortableTableHeader column={column}>
          # of Students
        </SortableTableHeader>
      ),
      cell: ({ row }) => {
        const maxStudents = row.getValue("max_students");
        if (typeof maxStudents === 'number') {
          return `${maxStudents} students per visit`;
        }
        return maxStudents || '';
      },
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <SortableTableHeader column={column}>
          Description
        </SortableTableHeader>
      ),
      cell: ({ row }) => {
        return (
          <div>
            {row.getValue("description")}
          </div>
        );
      },
    },
  ], [randomFirstCenter, setSelectedFeeProgram, setIsFeeModalOpen]);

  const table = useReactTable({
    data: validPrograms,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleCloseModal = () => {
    // Close the modal first
    setIsModalOpen(false);
    // Then clear the selected program ID
    setTimeout(() => {
      setSelectedProgramId(null);
    }, 100);
  };

  const handlePreviousProgram = () => {
    if (selectedProgramIndex !== null && selectedProgramIndex > 0) {
      setSelectedProgramId(validPrograms[selectedProgramIndex - 1].id);
    }
  };

  const handleNextProgram = () => {
    if (selectedProgramIndex !== null && selectedProgramIndex < validPrograms.length - 1) {
      setSelectedProgramId(validPrograms[selectedProgramIndex + 1].id);
    }
  };

  const handleColumnVisibilityChange = React.useCallback((columnId: string, value: boolean) => {
    setColumnVisibility(prev => ({
      ...prev,
      [columnId]: value
    }));
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Columns (show/hide)
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-white">
              {table.getAllColumns()
                .filter(column => {
                  return column.getCanHide() && 
                         column.id !== '' && 
                         column.id !== 'program_host';
                })
                .map(column => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => {
                        handleColumnVisibilityChange(column.id, !!value);
                        column.toggleVisibility(!!value);
                      }}
                    >
                      {column.id.replace(/_/g, ' ')}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <span className="text-sm text-gray-500">
            {validPrograms.length} programs found
          </span>
        </div>
        <div className="text-sm text-muted-foreground">
          Click a row for more details
        </div>
      </div>
      <TableContainer>
        <TableContent
          headerGroups={table.getHeaderGroups()}
          rowModel={table.getRowModel()}
          columns={columns}
          onRowClick={handleRowClick}
          className="align-top"
        />
      </TableContainer>

      {selectedProgramId !== null && selectedProgramIndex !== null && (
        <ProgramModal
          program={validPrograms[selectedProgramIndex]}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onPrevious={handlePreviousProgram}
          onNext={handleNextProgram}
          hasPrevious={selectedProgramIndex > 0}
          hasNext={selectedProgramIndex < validPrograms.length - 1}
        />
      )}
      
      {selectedFeeProgram && (
        <FeeModal
          program={selectedFeeProgram}
          isOpen={isFeeModalOpen}
          onClose={() => {
            setIsFeeModalOpen(false);
            setSelectedFeeProgram(null);
          }}
        />
      )}
    </div>
  );
});