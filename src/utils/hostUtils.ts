import { ProgramHost } from "@/types/program";

// Map JSON file names to program host names
export const jsonFileToHostName: Record<string, ProgramHost> = {
  "Ardenwood": "Ardenwood Historic Farm",
  "BigBreak": "Big Break Visitor Center",
  "BlackDiamond": "Black Diamond Mines Visitor Center",
  "CoyoteHills": "Coyote Hills Visitor Center",
  "CrabCove": "Doug Siden Crab Cove Visitor Center",
  "DelValle": "Del Valle Visitor Center",
  "MobileEducation": "Mobile Education",
  "Sunol": "Sunol Visitor Center",
  "TildenNatureArea": "Tilden Environmental Education Center"
};

// Map program host names to JSON file names
export const hostNameToJsonFile: Record<ProgramHost, string> = {
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

// Get program host name from JSON file name
export const getHostNameFromJsonFile = (jsonFileName: string): ProgramHost | null => {
  return jsonFileToHostName[jsonFileName] || null;
};

// Get JSON file name from program host name
export const getJsonFileFromHostName = (hostName: ProgramHost): string | null => {
  return hostNameToJsonFile[hostName] || null;
};

// Check if a JSON file name is valid
export const isValidJsonFileName = (jsonFileName: string): boolean => {
  return jsonFileName in jsonFileToHostName;
};

// Get all valid JSON file names
export const getAllJsonFileNames = (): string[] => {
  return Object.keys(jsonFileToHostName);
}; 