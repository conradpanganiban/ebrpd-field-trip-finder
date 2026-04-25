import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProgramFooterProps {
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

export const ProgramFooter = ({
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}: ProgramFooterProps) => {
  return (
    <div className="flex justify-between items-center p-4">
      <Button
        variant="ghost"
        onClick={onPrevious}
        disabled={!hasPrevious}
        className="text-[rgb(80,111,51)]"
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Previous
      </Button>

      <Button
        variant="ghost"
        onClick={onNext}
        disabled={!hasNext}
        className="text-[rgb(80,111,51)]"
      >
        Next
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
};
