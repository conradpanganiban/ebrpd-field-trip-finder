
import fs from 'fs';
import path from 'path';
import { Program } from '../types/program';

const PROGRAMS_DIR = path.join(process.cwd(), 'src/data/programs');

// Temporary interface for migration that includes old fields
interface ProgramWithOldFields extends Omit<Program, 'limited_availability' | 'days_not_available' | 'months_not_available'> {
  days_not_available?: string[] | null;
  months_not_available?: string[] | null;
}

function migrateProgramFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const program = JSON.parse(content) as ProgramWithOldFields;

  // Create limited_availability object if either field exists
  if (program.days_not_available || program.months_not_available) {
    (program as any).limited_availability = {
      days: program.days_not_available || [],
      months: program.months_not_available || []
    };
  }

  // Remove old fields
  delete program.days_not_available;
  delete program.months_not_available;

  // Write back the updated file
  fs.writeFileSync(filePath, JSON.stringify(program, null, 2));
}

function migrateAllPrograms() {
  const files = fs.readdirSync(PROGRAMS_DIR);
  
  files.forEach(file => {
    if (file.endsWith('.json')) {
      const filePath = path.join(PROGRAMS_DIR, file);
      console.log(`Migrating ${file}...`);
      migrateProgramFile(filePath);
    }
  });
}

migrateAllPrograms();
