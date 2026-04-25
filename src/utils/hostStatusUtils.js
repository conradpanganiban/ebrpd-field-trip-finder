import { hostStatusConfig, defaultFallbackStatuses } from './hostStatusConfig';

/**
 * Get the default application statuses for a given host
 * @param {string} hostName The name of the program host
 * @returns {Array} The default application statuses for the host, or fallback statuses if the host is not in the configuration
 */
export function getHostDefaultStatuses(hostName) {
  // Check if the host is in the configuration
  if (hostName in hostStatusConfig) {
    return hostStatusConfig[hostName].defaultStatuses;
  }
  
  // Return fallback statuses if the host is not in the configuration
  return defaultFallbackStatuses;
}

/**
 * Check if a program should use custom statuses
 * @param {Object} program The program to check
 * @param {string} hostName The name of the program host
 * @returns {boolean} True if the program should use custom statuses, false otherwise
 */
export function shouldUseCustomStatuses(program, hostName) {
  // Check if the host is in the configuration and has override programs
  if (hostName in hostStatusConfig && hostStatusConfig[hostName].overridePrograms) {
    // Check if the program ID is in the override programs list
    return hostStatusConfig[hostName].overridePrograms.includes(program.id);
  }
  
  // If the program has custom statuses, use them
  return program.application_status && program.application_status.some(status => status.isOverride);
}

/**
 * Apply the host status configuration to a program
 * @param {Object} program The program to update
 * @param {string} hostName The name of the program host
 * @returns {Object} The updated program with the host status configuration applied
 */
export function applyHostStatusToProgram(program, hostName) {
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
 * @param {Array} programs The programs to update
 * @param {string} hostName The name of the program host
 * @returns {Array} The updated programs with the host status configuration applied
 */
export function applyHostStatusConfig(programs, hostName) {
  return programs.map(program => applyHostStatusToProgram(program, hostName));
}

/**
 * Extract the host name from a file path
 * @param {string} filePath The path to the program file
 * @returns {string} The host name extracted from the file path
 */
export function extractHostNameFromPath(filePath) {
  // Extract the filename from the path
  const fileName = filePath.split('/').pop() || '';
  
  // Remove the .json extension
  const hostName = fileName.replace('.json', '');
  
  return hostName;
} 