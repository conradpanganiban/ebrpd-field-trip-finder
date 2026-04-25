import { ApplicationStatus, ProgramStatus } from "@/types/program";
import { seasonDateRanges } from "./seasonDateRanges";
import { getHostDefaultStatuses } from "./hostStatusUtils";

export function getApplicationStatus(applicationDates: string | string[] | undefined, acceptingApplications: string | undefined): ApplicationStatus[] {
  // If both applicationDates and acceptingApplications are undefined, return default closed statuses
  if (!applicationDates && !acceptingApplications) {
    return [
      {
        season: `Spring ${new Date().getFullYear()}`,
        status: "closed",
        isOverride: false
      },
      {
        season: `Summer ${new Date().getFullYear()}`,
        status: "closed",
        isOverride: false
      },
      {
        season: `Fall ${new Date().getFullYear()}`,
        status: "closed",
        isOverride: false
      }
    ];
  }

  // If we have applicationDates or acceptingApplications, parse them
  const statuses: ApplicationStatus[] = [];
  const dateStr = Array.isArray(applicationDates) ? applicationDates[0] : applicationDates;
  
  // Check for waitlist status - safely handle undefined values
  const isWaitlist = dateStr?.includes("waitlist") || acceptingApplications?.includes("waitlist");
  
  // Check for specific season mentions - safely handle undefined values
  const hasSpring = dateStr?.includes("spring") || acceptingApplications?.includes("spring");
  const hasSummer = dateStr?.includes("summer") || acceptingApplications?.includes("summer");
  const hasFall = dateStr?.includes("fall") || acceptingApplications?.includes("fall");
  
  // If no specific seasons mentioned, assume all seasons
  const applyToAll = !hasSpring && !hasSummer && !hasFall;
  
  if (applyToAll || hasSpring) {
    statuses.push({
      season: `Spring ${new Date().getFullYear()}`,
      status: isWaitlist ? "waitlist" : "open",
      isOverride: false
    });
  }
  
  if (applyToAll || hasSummer) {
    statuses.push({
      season: `Summer ${new Date().getFullYear()}`,
      status: isWaitlist ? "waitlist" : "open",
      isOverride: false
    });
  }
  
  if (applyToAll || hasFall) {
    statuses.push({
      season: `Fall ${new Date().getFullYear()}`,
      status: isWaitlist ? "waitlist" : "open",
      isOverride: false
    });
  }
  
  return statuses;
}

// Helper function to get the date range for a season
export function getSeasonDateRange(season: string): { start: Date; end: Date } {
  if (!season) {
    // Default to current year if season is undefined or empty
    const year = new Date().getFullYear();
    return {
      start: new Date(year, 0, 1),
      end: new Date(year, 11, 31)
    };
  }

  const range = seasonDateRanges[season];
  
  if (!range) {
    // Default to current year if season not found
    const year = new Date().getFullYear();
    return {
      start: new Date(year, 0, 1),
      end: new Date(year, 11, 31)
    };
  }
  
  return range;
}

// Helper function to get all seasons for a given year
export function getAllSeasons(year: number): string[] {
  return [
    `Spring ${year}`,
    `Summer ${year}`,
    `Fall ${year}`
  ];
} 