// Program-related types
export type ProgramHost = 
  | "Ardenwood Historic Farm"
  | "Big Break Visitor Center"
  | "Black Diamond Mines Visitor Center"
  | "Coyote Hills Visitor Center"
  | "Del Valle Visitor Center"
  | "Doug Siden Crab Cove Visitor Center"
  | "Mobile Education"
  | "Sunol Visitor Center"
  | "Tilden Environmental Education Center";

export type ProgramFormat = "In Person" | "virtual" | "hybrid" | "In Classroom";

export type ProgramFee = "yes" | "no" | "varies";

export type ProgramGrade = 
  | "Pre-K"
  | "K"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12"
  | "College"
  | "Adult";

export type ProgramSeason = "Spring" | "Summer" | "Fall";

export type ProgramStatus = "open" | "closed" | "waitlist";

// New ApplicationStatus interface
export interface ApplicationStatus {
  season: string;
  status: ProgramStatus;
  isOverride?: boolean;
  customMessage?: string;
}

export type LimitedAvailability = string | {
  days: string[];
  months: string[];
};

export interface ProgramMetadata {
  title: string;
  description: string;
  keywords: string[];
  og_title: string;
  og_description: string;
  twitter_title: string;
  twitter_description: string;
}

export interface Program {
  id: string;
  program_name: string;
  description: string;
  grade: string;
  duration: string;
  max_participants: string;
  visitor_center: string;
  days_not_available: string[] | null;
  months_not_available: string[] | null;
  format: ProgramFormat;
  fee: ProgramFee;
  emoji?: string;
  learning_standards: string | null;
  specific_timing: string | null;
  city: string;
  created_at: string;
  updated_at: string;
  // These fields are deprecated but kept for backward compatibility
  application_dates?: string;
  accepting_applications?: string;
  limited_availability: LimitedAvailability;
  application_status: ApplicationStatus[];
  program_host: ProgramHost;
  // New fields
  class_size?: string | null;
  class_max?: number | null;
  max_students?: number | string | null;
  max_chaperones?: number | string | null;
  link_suffix: string;
  // Metadata field
  metadata?: ProgramMetadata;
}

// Type guards
export const isProgramHost = (value: string): value is ProgramHost => {
  const validHosts: ProgramHost[] = [
    "Ardenwood Historic Farm",
    "Big Break Visitor Center",
    "Black Diamond Mines Visitor Center",
    "Coyote Hills Visitor Center",
    "Del Valle Visitor Center",
    "Doug Siden Crab Cove Visitor Center",
    "Mobile Education",
    "Sunol Visitor Center",
    "Tilden Environmental Education Center"
  ];
  return validHosts.includes(value as ProgramHost);
};

export const isProgramFormat = (value: string): value is ProgramFormat => {
  return ["In Person", "virtual", "hybrid", "In Classroom"].includes(value);
};

export const isProgramFee = (value: string): value is ProgramFee => {
  return ["yes", "no", "varies"].includes(value);
};

export const isProgramGrade = (value: string): value is ProgramGrade => {
  const validGrades: ProgramGrade[] = [
    "Pre-K", "K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12",
    "College", "Adult"
  ];
  return validGrades.includes(value as ProgramGrade);
};

export const isProgramSeason = (value: string): value is ProgramSeason => {
  return ["Spring", "Summer", "Fall"].includes(value);
};

export const isProgramStatus = (value: string): value is ProgramStatus => {
  return ["open", "closed", "waitlist"].includes(value);
};

export const isApplicationStatus = (value: unknown): value is ApplicationStatus => {
  if (!value || typeof value !== 'object') return false;
  
  const status = value as ApplicationStatus;
  return (
    typeof status.season === 'string' &&
    typeof status.status === 'string' &&
    (status.isOverride === undefined || typeof status.isOverride === 'boolean') &&
    (status.customMessage === undefined || typeof status.customMessage === 'string')
  );
};

export const isLimitedAvailability = (value: unknown): value is LimitedAvailability => {
  return typeof value === 'string' || (typeof value === 'object' && 'days' in value && 'months' in value);
};
