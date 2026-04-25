# Application Status Data Structure

This directory contains sample JSON files demonstrating the new application status data structure for programs.

## Overview

The application status data structure has been updated to provide more flexibility and consistency. The new structure allows for:

1. Program-specific overrides for application statuses
2. Custom messages for special cases
3. Default statuses for programs without specific overrides
4. Integration with the `seasonDateRanges` utility for consistent date ranges

## Sample Files

- `sample-program.json`: A standard program with overridden application statuses
- `sample-special-program.json`: A program with custom messages in the application status
- `sample-default-program.json`: A program with default application statuses

## Data Structure

### ApplicationStatus Interface

```typescript
interface ApplicationStatus {
  season: string;           // e.g., "Spring 2025"
  status: ProgramStatus;    // "open", "closed", or "waitlist"
  isOverride?: boolean;     // Whether this is a program-specific override
  customMessage?: string;   // Optional custom message for this program/season
}
```

### Program Interface

The `Program` interface includes the following fields related to application status:

```typescript
interface Program {
  // ... other fields ...
  
  // These fields are deprecated but kept for backward compatibility
  application_dates?: string;
  accepting_applications?: string;
  
  // The new application status field
  application_status: ApplicationStatus[];
}
```

## Migration

The `migrationUtils.ts` file provides utilities to migrate existing programs to the new data structure:

- `migrateProgramApplicationStatus`: Migrates a single program
- `migrateProgramsApplicationStatus`: Migrates an array of programs

## Usage

When displaying application statuses in the UI, use the `getSeasonDateRange` function from `applicationStatusUtils.ts` to get the date range for a season:

```typescript
import { getSeasonDateRange } from "@/utils/applicationStatusUtils";

// Get the date range for a season
const dateRange = getSeasonDateRange("Spring 2025"); // Returns "January 1 to May 31"
```

## Special Cases

The migration utility includes special case handling for programs with unique application processes, such as "bigbreak-7", which requires a custom message. 