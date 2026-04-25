import { seasonDateRanges } from './seasonDateRanges';

/**
 * Migrates a program's application status data to the new format
 * @param program The program to migrate
 * @returns The program with migrated application status data
 */
export function migrateProgramApplicationStatus(program) {
  // Create a new program object with the migrated data
  const migratedProgram = { ...program };
  
  // Initialize application_status if it doesn't exist
  if (!migratedProgram.application_status) {
    migratedProgram.application_status = [];
  }

  // If application_status is an array of strings, convert them to the new format
  if (migratedProgram.application_status.length > 0 && 
      typeof migratedProgram.application_status[0] === 'string') {
    // Cast to unknown first, then to string[] to avoid type error
    const oldStatuses = migratedProgram.application_status;
    const newStatuses = oldStatuses.map(status => {
      const [seasonPart, statusPart] = status.split(" - ");
      const [season, year] = seasonPart.split(" ");
      const status_value = statusPart || "closed";
      return {
        season: `${season} ${year}`,
        status: status_value,
        isOverride: true
      };
    });
    
    migratedProgram.application_status = newStatuses;
  } else if (migratedProgram.application_status.length === 0) {
    // If application_status is empty, generate default statuses
    const seasons = Object.keys(seasonDateRanges);
    
    const defaultStatuses = seasons.map(season => {
      return {
        season,
        status: "closed",
        isOverride: false
      };
    });
    
    migratedProgram.application_status = defaultStatuses;
  }
  
  // Special case for bigbreak-7
  if (program.id === "bigbreak-7") {
    migratedProgram.application_status = migratedProgram.application_status.map(status => ({
      ...status,
      customMessage: "Call 510-544-2553 for details"
    }));
  }
  
  // Clean up old fields
  delete migratedProgram.application_dates;
  delete migratedProgram.accepting_applications;
  
  return migratedProgram;
}

/**
 * Migrates an array of programs to the new application status format
 * @param programs The programs to migrate
 * @returns The programs with migrated application status data
 */
export function migrateProgramsApplicationStatus(programs) {
  return programs.map(program => migrateProgramApplicationStatus(program));
} 