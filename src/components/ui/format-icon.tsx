import React from "react";
import { Laptop, Milestone, School } from "lucide-react";

interface FormatIconProps {
  format: string;
  className?: string;
}

export const FormatIcon = ({ format, className = "" }: FormatIconProps) => {
  if (!format) return null;
  
  switch (format.toLowerCase()) {
    case "in person":
      return <Milestone className={className} />;
    case "in classroom":
      return <School className={className} />;
    case "virtual":
      return <Laptop className={className} />;
    default:
      return null;
  }
}; 