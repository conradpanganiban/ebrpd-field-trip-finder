import React from "react";
import { X } from "lucide-react";
import {
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Program } from "@/types/program";
import { Badge } from "@/components/ui/badge";

interface ProgramHeaderProps {
  programName: string;
  location: string;
  city: string;
  onClose: () => void;
  // Add the new prop
  compact?: boolean;
  program?: Program;
}

export const ProgramHeader = ({
  programName,
  location,
  city,
  onClose,
  program,
}: ProgramHeaderProps) => {
  // Extract season from the first application status if available
  const season = program?.application_status?.[0]?.season || '';
  
  // Convert format to array if it's a string
  const formats = program?.format 
    ? (Array.isArray(program.format) 
        ? program.format 
        : [program.format])
    : [];

  return (
    <CardHeader>
      <div className="flex justify-between items-start">
        <div>
          <CardTitle className="text-2xl">{programName}</CardTitle>
          <CardDescription>
            {location} {city && `- ${city}`}
            {/* {season && dateRange && (
              <span className="block mt-1">
                {season}
              </span>
            )} */}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          {formats.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-end">
              {formats.map((format, index) => (
                <Badge key={index} variant="outline" className="bg-white">
                  {format}
                </Badge>
              ))}
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </CardHeader>
  );
};
