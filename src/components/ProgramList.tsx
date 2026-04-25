import React from "react";
import { Program } from "@/types/program";
import { ProgramCard } from "./ProgramCard";
import { TableView } from "./TableView";
import { useViewMode } from "@/hooks/useViewMode";

interface ProgramListProps {
  programs: Program[];
  allPrograms?: Program[];
}

export const ProgramList: React.FC<ProgramListProps> = ({ programs, allPrograms = programs }) => {
  const { viewMode } = useViewMode();

  if (programs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No programs found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {viewMode === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {programs.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              allPrograms={allPrograms}
            />
          ))}
        </div>
      ) : (
        <TableView programs={programs} />
      )}
    </div>
  );
}; 