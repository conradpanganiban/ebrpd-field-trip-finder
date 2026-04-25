import fs from 'fs/promises';
import path from 'path';
import { toZonedTime } from 'date-fns-tz';

interface ProgramData {
  accepting_applications: string | null;
  application_dates: string | null;
  [key: string]: any;
}

const PACIFIC_TIMEZONE = 'America/Los_Angeles';

function getNthWeekdayOfMonth(year: number, month: number, weekday: number, n: number): Date {
  const date = new Date(year, month, 1);
  let count = 0;
  
  while (date.getMonth() === month) {
    if (date.getDay() === weekday) {
      count++;
      if (count === n) {
        return date;
      }
    }
    date.setDate(date.getDate() + 1);
  }
  
  throw new Error(`Could not find ${n}th ${weekday} of month ${month}`);
}

function getLastDayOfMonth(year: number, month: number): Date {
  return new Date(year, month + 1, 0);
}

function calculateApplicationPeriod(): string {
  const now = toZonedTime(new Date(), PACIFIC_TIMEZONE);
  const year = now.getFullYear();

  // Calculate key dates
  const thirdMondayApril = getNthWeekdayOfMonth(year, 3, 1, 3); // April is 3 (0-based)
  const thirdSundaySeptember = getNthWeekdayOfMonth(year, 8, 0, 3);
  const fourthMondaySeptember = getNthWeekdayOfMonth(year, 8, 1, 4);
  const lastDayFebruary = getLastDayOfMonth(year, 1);
  const firstMondayMarch = getNthWeekdayOfMonth(year, 2, 1, 1);
  const thirdFridayApril = getNthWeekdayOfMonth(year, 3, 5, 3);

  // Fall Period (Third Monday in April through Third Sunday in September)
  if (now >= thirdMondayApril && now <= thirdSundaySeptember) {
    return "Fall (Aug. 11 to Dec. 31)";
  }

  // Spring Period (Fourth Monday in September through Last Day of February)
  if (now >= fourthMondaySeptember && now <= lastDayFebruary) {
    return "Spring (Jan. 1 to June 12)";
  }

  // Summer Period (First Monday in March through Third Friday in April)
  if (now >= firstMondayMarch && now <= thirdFridayApril) {
    return "Summer (June 15 to August 8)";
  }

  // Default to current period based on date
  const month = now.getMonth();
  if (month >= 7 && month <= 11) { // Aug-Dec
    return "Fall (Aug. 11 to Dec. 31)";
  } else if (month >= 0 && month <= 5) { // Jan-Jun
    return "Spring (Jan. 1 to June 12)";
  } else { // Jun-Aug
    return "Summer (June 15 to August 8)";
  }
}

export async function updateApplicationDates(): Promise<void> {
  try {
    const programsDir = path.join(process.cwd(), 'src', 'data', 'programs');
    const files = await fs.readdir(programsDir);

    for (const file of files) {
      if (!file.endsWith('.json')) continue;

      const filePath = path.join(programsDir, file);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const programData: ProgramData[] = JSON.parse(fileContent);

      const calculatedPeriod = calculateApplicationPeriod();

      // Update each program in the array
      for (const program of programData) {
        // Always update accepting_applications with the calculated period
        program.accepting_applications = calculatedPeriod;
      }

      await fs.writeFile(filePath, JSON.stringify(programData, null, 2));
    }
  } catch (error) {
    console.error('Error updating application dates:', error);
    throw error;
  }
} 