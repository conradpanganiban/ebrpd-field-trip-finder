import { Program, ApplicationStatus } from "@/types/program";
import { hostStatusConfig, defaultFallbackStatuses } from "./hostStatusConfig";
import { hostNameToJsonFile } from "./hostUtils";

/**
 * Get the default application statuses for a given host
 * @param hostName The name of the program host
 * @returns The default application statuses for the host, or fallback statuses if the host is not in the configuration
 */
export function getHostDefaultStatuses(hostName: string): ApplicationStatus[] {
  // Check if the hostName is directly a key in hostStatusConfig (short key like "Ardenwood")
  if (hostName in hostStatusConfig) {
    return hostStatusConfig[hostName].defaultStatuses;
  }

  // Try converting the full host name to the JSON file name (short key)
  const jsonFileName = hostNameToJsonFile[hostName as keyof typeof hostNameToJsonFile];
  
  // Check if the JSON file name is in the configuration
  if (jsonFileName && jsonFileName in hostStatusConfig) {
    return hostStatusConfig[jsonFileName].defaultStatuses;
  }
  
  // Return fallback statuses if the host is not in the configuration
  return defaultFallbackStatuses;
}

/**
 * Check if a program should use custom statuses
 * @param program The program to check
 * @param hostName The name of the program host
 * @returns True if the program should use custom statuses, false otherwise
 */
export function shouldUseCustomStatuses(program: Program, hostName: string): boolean {
  // Check if the hostName is directly a key in hostStatusConfig (short key like "Ardenwood")
  const configKey = hostName in hostStatusConfig ? hostName : hostNameToJsonFile[hostName as keyof typeof hostNameToJsonFile];

  // Check if the host is in the configuration and has override programs
  if (configKey && configKey in hostStatusConfig && hostStatusConfig[configKey].overridePrograms) {
    // Check if the program ID is in the override programs list
    if (hostStatusConfig[configKey].overridePrograms!.includes(program.id)) {
      return true;
    }
  }
  
  // If the program has custom statuses with valid status values, use them
  return program.application_status && 
         program.application_status.some(status => 
           status.isOverride && 
           status.status !== "-" as any && 
           (status.status === "open" || status.status === "closed" || status.status === "waitlist")
         );
}

/**
 * Apply the host status configuration to a program
 * @param program The program to update
 * @param hostName The name of the program host
 * @returns The updated program with the host status configuration applied
 */
export function applyHostStatusToProgram(program: Program, hostName: string): Program {
  // Convert the host name to the JSON file name
  const jsonFileName = hostNameToJsonFile[hostName as keyof typeof hostNameToJsonFile];
  
  // Check if the program should use custom statuses
  if (shouldUseCustomStatuses(program, hostName)) {
    // If the program already has custom statuses, keep them
    if (program.application_status && program.application_status.length > 0) {
      return program;
    }
  }
  
  // Get the default statuses for the host
  const defaultStatuses = getHostDefaultStatuses(hostName);
  
  // Create a new program object with the default statuses
  return {
    ...program,
    application_status: defaultStatuses
  };
}

/**
 * Apply the host status configuration to all programs in a file
 * @param programs The programs to update
 * @param hostName The name of the program host
 * @returns The updated programs with the host status configuration applied
 */
export function applyHostStatusConfig(programs: Program[], hostName: string): Program[] {
  return programs.map(program => applyHostStatusToProgram(program, hostName));
}

/**
 * Extract the host name from a file path
 * @param filePath The path to the program file
 * @returns The host name extracted from the file path
 */
export function extractHostNameFromPath(filePath: string): string {
  // Extract the filename from the path
  const fileName = filePath.split('/').pop() || '';
  
  // Remove the .json extension
  const hostName = fileName.replace('.json', '');
  
  return hostName;
} 