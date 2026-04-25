import fs from 'fs';
import path from 'path';
import { Program } from '../src/types/program';

// Helper function to determine application status
function getApplicationStatus(applicationDates: string | string[] | undefined, acceptingApplications: string | undefined): string[] {
  if (!applicationDates && !acceptingApplications) {
    return ["Spring 2025 - closed", "Summer 2025 - closed", "Fall 2025 - closed"];
  }

  const statuses: string[] = [];
  const dateStr = Array.isArray(applicationDates) ? applicationDates[0] : applicationDates;
  
  if (dateStr?.includes("Spring")) {
    statuses.push("Spring 2025 - open");
  } else {
    statuses.push("Spring 2025 - closed");
  }
  
  if (dateStr?.includes("Summer")) {
    statuses.push("Summer 2025 - open");
  } else {
    statuses.push("Summer 2025 - closed");
  }
  
  if (dateStr?.includes("Fall")) {
    statuses.push("Fall 2025 - open");
  } else {
    statuses.push("Fall 2025 - closed");
  }

  return statuses;
}

// Function to migrate a single program
function migrateProgram(program: any): Program {
  return {
    ...program,
    limited_availability: {
      days: program.days_not_available || [],
      months: program.months_not_available || []
    },
    application_status: getApplicationStatus(program.application_dates, program.accepting_applications),
    emoji: program["emoji?"] || undefined,
    format: (program.format || '').toLowerCase().split(" ").join("-")
  };
}

// Main migration function
async function migrateProgramData() {
  const programsDir = path.join(process.cwd(), 'src', 'data', 'programs');
  const file = 'Ardenwood.json';
  const filePath = path.join(programsDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const programs = JSON.parse(content);

  const migratedPrograms = programs.map(migrateProgram);

  // Write back to file
  fs.writeFileSync(
    filePath,
    JSON.stringify(migratedPrograms, null, 2)
  );

  console.log(`Migrated ${file}`);
}

// Run migration
migrateProgramData().catch(console.error); 