import { ProgramStatus } from "@/types/program";

export const getStatusColor = (status: ProgramStatus | undefined | null): string => {
  if (!status) {
    return "#ea384c"; // Default to closed/red for undefined/null
  }
  
  if (status === "open") {
    return "#a3c197";
  }
  if (status === "waitlist") {
    return "#f3d28b";
  }
  return "#ea384c";
}; 