import { ApplicationStatus } from "@/types/program";

export interface HostStatusConfig {
  [hostName: string]: {
    defaultStatuses: ApplicationStatus[];
    overridePrograms?: string[];
  }
}

// Configuration for each program host
export const hostStatusConfig: HostStatusConfig = {
  "Ardenwood": {
    defaultStatuses: [
      { season: "FULLY BOOKED Spring 2026", status: "closed", isOverride: false },
      { season: "Summer 2026", status: "open", isOverride: false }
    ],
    overridePrograms: [] // Example overrides
  },
  "BigBreak": {
    defaultStatuses: [
      { season: "FULLY BOOKED Spring 2026", status: "closed", isOverride: false },
      { season: "Summer 2026", status: "open", isOverride: false }
    ]
  },
  "BlackDiamond": {
    defaultStatuses: [
      { season: "FULLY BOOKED Spring 2026", status: "closed", isOverride: false },
      { season: "Summer 2026", status: "open", isOverride: false }
    ]
  },
  "CoyoteHills": {
    defaultStatuses: [
      { season: "Spring 2026", status: "open", isOverride: false },
      { season: "Summer 2026", status: "open", isOverride: false }
    ],
    overridePrograms: []
  },
  "CrabCove": {
    defaultStatuses: [
      { season: "FULLY BOOKED Spring 2026", status: "closed", isOverride: false },
      { season: "Summer 2026", status: "open", isOverride: false }
    ]
  },
  "DelValle": {
    defaultStatuses: [
      { season: "Spring 2026", status: "open", isOverride: false },
      { season: "Summer 2026", status: "open", isOverride: false }
    ]
  },
  "MobileEducation": {
    defaultStatuses: [
      { season: "FULLY BOOKED Spring 2026", status: "closed", isOverride: false },
      { season: "Summer 2026", status: "open", isOverride: false }
    ]
  },
  "Sunol": {
    defaultStatuses: [
      { season: "Spring 2026", status: "open", isOverride: false },
      { season: "Summer 2026", status: "open", isOverride: false }
    ]
  },
  "TildenNatureArea": {
    defaultStatuses: [
      { season: "FULLY BOOKED Spring 2026", status: "closed", isOverride: false },
      { season: "Summer 2026", status: "open", isOverride: false }
    ]
  }
};

// Default statuses to use if a host is not in the configuration
export const defaultFallbackStatuses: ApplicationStatus[] = [
  { season: "Spring 2026", status: "open", isOverride: false },
  { season: "Summer 2026", status: "open", isOverride: false }
];
