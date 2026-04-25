
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Eye } from "lucide-react";
import { Program, ApplicationStatus } from "@/types/program";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProgramTableProps {
  programs: Program[];
  onEditProgram: (program: Program) => void;
  onDeleteProgram: (id: string) => void;
  onPreviewProgram: (index: number) => void;
  isLoading: boolean;
  modifiedPrograms: Set<string>;
}

export const ProgramTable = ({ 
  programs, 
  onEditProgram, 
  onDeleteProgram, 
  onPreviewProgram,
  isLoading,
  modifiedPrograms 
}: ProgramTableProps) => {
  // Helper to format array data for display
  const formatArrayField = (field: string[] | null | undefined): string => {
    if (!field || field.length === 0) return "None";
    return field.join(", ");
  };

  const formatFormat = (format: string | string[]): string => {
    if (Array.isArray(format)) {
      return format.join(", ");
    }
    return format;
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" => {
    if (status === "open") return "default";
    if (status === "waitlist") return "secondary";
    return "destructive";
  };

  const formatApplicationStatus = (statuses: ApplicationStatus[]) => {
    return (
      <div className="space-y-1">
        {["Spring", "Summer", "Fall"].map(season => {
          const seasonStatus = statuses.find(status => status.season.includes(season));
          if (!seasonStatus) return null;
          
          return (
            <div key={season} className="flex items-center gap-2">
              <Badge variant={getStatusBadgeVariant(seasonStatus.status)} className="text-xs">
                {season}: {seasonStatus.status}
              </Badge>
            </div>
          );
        })}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-2 my-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (programs.length === 0) {
    return <div className="text-center py-4">No programs found.</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Program Name</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead>Max Participants</TableHead>
            <TableHead>Format</TableHead>
            <TableHead>Learning Standards</TableHead>
            <TableHead>Application Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {programs.map((program, index) => (
            <TableRow key={program.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {program.program_name}
                  {modifiedPrograms.has(program.id) && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      Modified
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>{program.grade}</TableCell>
              <TableCell>{program.max_participants || "N/A"}</TableCell>
              <TableCell>{formatFormat(program.format)}</TableCell>
              <TableCell>{program.learning_standards || "N/A"}</TableCell>
              <TableCell>
                {program.application_status && formatApplicationStatus(program.application_status)}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onPreviewProgram(index)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Preview Program</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onEditProgram(program)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit Program</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onDeleteProgram(program.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete Program</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
