import { Program } from "@/types/program";
import { getHostDefaultStatuses, shouldUseCustomStatuses } from "@/utils/hostStatusUtils";

/**
 * Check if a program is a BigBreak program
 * @param program The program to check
 * @returns True if the program is a BigBreak program
 */
export function isBigBreakProgram(program: Program): boolean {
  return program.program_host === "Big Break Visitor Center" || 
         program.visitor_center === "Big Break" ||
         program.id?.startsWith("bigbreak-");
}

/**
 * Check if a program is a CrabCove program
 * @param program The program to check
 * @returns True if the program is a CrabCove program
 */
export function isCrabCoveProgram(program: Program): boolean {
  return program.program_host === "Doug Siden Crab Cove Visitor Center" || 
         program.visitor_center === "Crab Cove" ||
         program.id?.startsWith("crabcove-");
}

/**
 * Check if a program is an Ardenwood program
 * @param program The program to check
 * @returns True if the program is an Ardenwood program
 */
export function isArdenwoodProgram(program: Program): boolean {
  return program.program_host === "Ardenwood Historic Farm" || 
         program.visitor_center === "Ardenwood" ||
         program.id?.startsWith("ardenwood-");
}

/**
 * Check if a program is a Mobile Education program
 * @param program The program to check
 * @returns True if the program is a Mobile Education program
 */
export function isMobileEducationProgram(program: Program): boolean {
  return program.program_host === "Mobile Education" || 
         program.visitor_center === "Mobile Education" ||
         program.id?.startsWith("mobile-");
}

/**
 * Check if a program is a Del Valle program
 * @param program The program to check
 * @returns True if the program is a Del Valle program
 */
export function isDelValleProgram(program: Program): boolean {
  return program.program_host === "Del Valle Visitor Center" || 
         program.visitor_center === "Del Valle" ||
         program.id?.startsWith("delvalle-");
}

/**
 * Check if a program is one of the specific Coyote Hills programs that need disabled buttons
 * @param program The program to check
 * @returns True if the program is coyotehills-1 or coyotehills-2
 */
export function isSpecificCoyoteHillsProgram(program: Program): boolean {
  return program.id === "coyotehills-1" || program.id === "coyotehills-2";
}

/**
 * Check if a program is a BigBreak, CrabCove, Ardenwood, Mobile Education, or specific Coyote Hills program (for consistent button behavior)
 * @param program The program to check
 * @returns True if the program is a BigBreak, CrabCove, Ardenwood, Mobile Education, or specific Coyote Hills program
 */
export function isClosedSeasonProgram(program: Program): boolean {
  return isBigBreakProgram(program) || isCrabCoveProgram(program) || isArdenwoodProgram(program) || isMobileEducationProgram(program) || isSpecificCoyoteHillsProgram(program);
}

/**
 * Get the Apply Now button text for a program
 * @param program The program to get the button text for
 * @returns The button text
 */
export function getApplyNowButtonText(program: Program): string {
  if (isClosedSeasonProgram(program)) {
    return "Spring applications open Sept. 22, 2025";
  }
  return "Apply Now";
}

/**
 * Check if the Apply Now button should be disabled for a program
 * @param program The program to check
 * @returns True if the button should be disabled
 */
export function shouldDisableApplyNowButton(program: Program): boolean {
  return isClosedSeasonProgram(program);
}

/**
 * Get the Apply Now button URL for a program
 * @param program The program to get the URL for
 * @returns The button URL
 */
export function getApplyNowButtonUrl(program: Program): string {
  if (isClosedSeasonProgram(program)) {
    return "#"; // Disabled link for BigBreak, CrabCove, Ardenwood, and specific Coyote Hills programs
  }
  
  if (program.id === "bigbreak-7") {
    return "https://apply.ebparks.org/custom/501/propose_opportunity?step=1";
  }
  
  return `https://apply.ebparks.org/custom/501/propose_opportunity?step=4&Program_Request_School_Program_Location_School_Program_Location=${program.link_suffix || ''}`;
}

/**
 * Get the status for a specific season
 * @param program The program to check
 * @param season The season to check (e.g., "Fall", "Spring")
 * @returns The status for the season
 */
export function getSeasonStatus(program: Program, season: string): string {
  // Get the host name and map it to the config key
  const hostName = program.program_host;
  const hostNameMap: Record<string, string> = {
    "Ardenwood Historic Farm": "Ardenwood",
    "Big Break Visitor Center": "BigBreak",
    "Black Diamond Mines Visitor Center": "BlackDiamond",
    "Coyote Hills Visitor Center": "CoyoteHills",
    "Doug Siden Crab Cove Visitor Center": "CrabCove",
    "Del Valle Visitor Center": "DelValle",
    "Mobile Education": "MobileEducation",
    "Sunol Visitor Center": "Sunol",
    "Tilden Environmental Education Center": "TildenNatureArea"
  };
  const configKey = hostNameMap[hostName] || hostName;
  
  // Get the default statuses for the host
  const defaultStatuses = getHostDefaultStatuses(configKey);
  
  // Check if the program should use custom statuses
  const useCustomStatuses = shouldUseCustomStatuses(program, configKey);
  
  // Use custom statuses if available and should be used, otherwise use defaults
  const applicationStatuses = useCustomStatuses && program.application_status && program.application_status.length > 0
    ? program.application_status
    : defaultStatuses;
  
  const statusEntry = applicationStatuses?.find(status => 
    status.season.includes(season)
  );
  return statusEntry?.status || "closed";
}

/**
 * Check if a season is fully booked
 * @param program The program to check
 * @param season The season to check
 * @returns True if the season is fully booked
 */
export function isSeasonFullyBooked(program: Program, season: string): boolean {
  // Get the host name and map it to the config key
  const hostName = program.program_host;
  const hostNameMap: Record<string, string> = {
    "Ardenwood Historic Farm": "Ardenwood",
    "Big Break Visitor Center": "BigBreak",
    "Black Diamond Mines Visitor Center": "BlackDiamond",
    "Coyote Hills Visitor Center": "CoyoteHills",
    "Doug Siden Crab Cove Visitor Center": "CrabCove",
    "Del Valle Visitor Center": "DelValle",
    "Mobile Education": "MobileEducation",
    "Sunol Visitor Center": "Sunol",
    "Tilden Environmental Education Center": "TildenNatureArea"
  };
  const configKey = hostNameMap[hostName] || hostName;
  
  // Get the default statuses for the host
  const defaultStatuses = getHostDefaultStatuses(configKey);
  
  // Check if the program should use custom statuses
  const useCustomStatuses = shouldUseCustomStatuses(program, configKey);
  
  // Use custom statuses if available and should be used, otherwise use defaults
  const applicationStatuses = useCustomStatuses && program.application_status && program.application_status.length > 0
    ? program.application_status
    : defaultStatuses;
  
  const statusEntry = applicationStatuses?.find(status => 
    status.season.includes("FULLY BOOKED") && status.season.includes(season)
  );
  return !!statusEntry;
}

/**
 * Get the button text for a specific season
 * @param program The program to check
 * @param season The season to check
 * @returns The button text
 */
export function getSeasonButtonText(program: Program, season: string): string {
  if (isSeasonFullyBooked(program, season)) {
    return `${season} Season is full`;
  }
  
  const status = getSeasonStatus(program, season);
  if (status === "open") {
    return `Apply for ${season}`;
  }
  
  return `${season} Not Available`;
}

/**
 * Check if a season button should be disabled
 * @param program The program to check
 * @param season The season to check
 * @returns True if the button should be disabled
 */
export function shouldDisableSeasonButton(program: Program, season: string): boolean {
  // Explicitly disable Spring CTAs for specific Coyote Hills programs
  if (isSpecificCoyoteHillsProgram(program) && season === "Spring") {
    return true;
  }

  return isSeasonFullyBooked(program, season) || getSeasonStatus(program, season) === "closed";
}

/**
 * Get the URL for a specific season button with season-specific parameters
 * @param program The program to check
 * @param season The season to check
 * @returns The button URL
 */
export function getSeasonButtonUrl(program: Program, season: string): string {
  if (shouldDisableSeasonButton(program, season)) {
    return "#";
  }
  
  if (program.id === "bigbreak-7") {
    return "https://apply.ebparks.org/custom/501/propose_opportunity?step=1";
  }
  
  // Season-specific URL construction
  if (season === "Fall") {
    return `https://apply.ebparks.org/custom/501/propose_opportunity?step=4&Program_Request_Preferred_Method_of_Contact_Preferred_Method_of_Contact=E-mail&OPP_STATE=CA&Program_Request_Season_Season=2025%20Fall%20(mid-August%20through%20end%20of%20December)&Program_Request_Closed_Field_Trip_Locations_Closed_Field_Trip_Locations=${program.link_suffix || ''}`;
  } else if (season === "Spring") {
    return `https://apply.ebparks.org/custom/501/propose_opportunity?step=4&Program_Request_Preferred_Method_of_Contact_Preferred_Method_of_Contact=E-mail&OPP_STATE=CA&Program_Request_Season_Season=2026%20Spring%20(January%20through%20mid-June)&Program_Request_Open_Field_Trip_Locations_Open_Field_Trip_Locations=${program.link_suffix || ''}`;
  } else if (season === "Summer") {
    return `https://apply.ebparks.org/custom/501/propose_opportunity?step=4&Program_Request_Preferred_Method_of_Contact_Preferred_Method_of_Contact=E-mail&OPP_STATE=CA&Program_Request_Season_Season=2026%20Summer%20(June%20and%20July)&Program_Request_Closed_Field_Trip_Locations_Closed_Field_Trip_Locations=${program.link_suffix || ''}`;
  }
  
  // Default fallback
  return `https://apply.ebparks.org/custom/501/propose_opportunity?step=4&Program_Request_School_Program_Location_School_Program_Location=${program.link_suffix || ''}`;
}

/**
 * Check if a program has any open seasons
 * @param program The program to check
 * @returns True if the program has at least one open season
 */
export function isProgramOpen(program: Program): boolean {
  // Get the host name and map it to the config key
  const hostName = program.program_host;
  const hostNameMap: Record<string, string> = {
    "Ardenwood Historic Farm": "Ardenwood",
    "Big Break Visitor Center": "BigBreak",
    "Black Diamond Mines Visitor Center": "BlackDiamond",
    "Coyote Hills Visitor Center": "CoyoteHills",
    "Doug Siden Crab Cove Visitor Center": "CrabCove",
    "Del Valle Visitor Center": "DelValle",
    "Mobile Education": "MobileEducation",
    "Sunol Visitor Center": "Sunol",
    "Tilden Environmental Education Center": "TildenNatureArea"
  };
  const configKey = hostNameMap[hostName] || hostName;
  
  // Get the default statuses for the host
  const defaultStatuses = getHostDefaultStatuses(configKey);
  
  // Check if the program should use custom statuses
  const useCustomStatuses = shouldUseCustomStatuses(program, configKey);
  
  // Use custom statuses if available and should be used, otherwise use defaults
  const applicationStatuses = useCustomStatuses && program.application_status && program.application_status.length > 0
    ? program.application_status
    : defaultStatuses;
  
  if (!applicationStatuses || applicationStatuses.length === 0) {
    return false;
  }
  
  return applicationStatuses.some(status => 
    status.status === "open" && !status.season.includes("FULLY BOOKED")
  );
}

/**
 * Check if a program is fully closed (all seasons are closed or fully booked)
 * @param program The program to check
 * @returns True if the program is fully closed
 */
export function isProgramFullyClosed(program: Program): boolean {
  // Get the host name and map it to the config key
  const hostName = program.program_host;
  const hostNameMap: Record<string, string> = {
    "Ardenwood Historic Farm": "Ardenwood",
    "Big Break Visitor Center": "BigBreak",
    "Black Diamond Mines Visitor Center": "BlackDiamond",
    "Coyote Hills Visitor Center": "CoyoteHills",
    "Doug Siden Crab Cove Visitor Center": "CrabCove",
    "Del Valle Visitor Center": "DelValle",
    "Mobile Education": "MobileEducation",
    "Sunol Visitor Center": "Sunol",
    "Tilden Environmental Education Center": "TildenNatureArea"
  };
  const configKey = hostNameMap[hostName] || hostName;
  
  // Get the default statuses for the host
  const defaultStatuses = getHostDefaultStatuses(configKey);
  
  // Check if the program should use custom statuses
  const useCustomStatuses = shouldUseCustomStatuses(program, configKey);
  
  // Use custom statuses if available and should be used, otherwise use defaults
  const applicationStatuses = useCustomStatuses && program.application_status && program.application_status.length > 0
    ? program.application_status
    : defaultStatuses;
  
  if (!applicationStatuses || applicationStatuses.length === 0) {
    return true;
  }
  
  return applicationStatuses.every(status => 
    status.status === "closed" || status.season.includes("FULLY BOOKED")
  );
}