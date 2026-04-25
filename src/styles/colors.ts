export const visitorCenterColors: { [key: string]: string } = {
  "Ardenwood": "#117733",  // Green
  "Big Break": "#AA4499",  // Purple
  "Black Diamond": "#88CCEE",  // Light Blue
  "Coyote Hills": "#DDCC77",  // Yellow
  "Crab Cove": "#CC6677",  // Pink
  "Del Valle": "#44AA99",  // Teal
  "Mobile Education": "#648FFF",  // Blue
  "Sunol": "#EE3377",  // Pink
  "Tilden": "#332288"  // Dark Blue
};

export const statusColors = {
  "open": { fill: "#7cba3d", text: "#2c5530" },
  "waitlist": { fill: "#f3d28b", text: "#8b6b2f" },
  "closed": { fill: "#e0e0e0", text: "#666666" }
};

export const getProgramHostColor = (host: string): string => {
  // Extract visitor center name from the host
  const visitorCenter = extractVisitorCenter(host);
  
  // Return the color for the visitor center or a default color
  return visitorCenterColors[visitorCenter] || "#a7b4ff";
};

/**
 * Extract the visitor center name from a program host
 * @param host The full program host name
 * @returns The visitor center name
 */
export const extractVisitorCenter = (host: string | undefined | null): string => {
  // Handle undefined or null host
  if (!host) {
    return "Unknown";
  }

  // Map of full host names to visitor center names
  const hostToVisitorCenter: { [key: string]: string } = {
    "Ardenwood Historic Farm": "Ardenwood",
    "Big Break Visitor Center": "Big Break",
    "Black Diamond Mines Visitor Center": "Black Diamond",
    "Coyote Hills Visitor Center": "Coyote Hills",
    "Doug Siden Crab Cove Visitor Center": "Crab Cove",
    "Del Valle Visitor Center": "Del Valle",
    "Mobile Education": "Mobile Education",
    "Radke Martinez Regional Shoreline": "Radke Martinez",
    "Sunol Visitor Center": "Sunol",
    "Thurgood Marshall Regional Park - Home of the Port Chicago 50": "Thurgood Marshall",
    "Tilden Environmental Education Center": "Tilden"
  };

  // Check if the host is in our mapping
  if (host in hostToVisitorCenter) {
    return hostToVisitorCenter[host];
  }

  // If not found in mapping, try to extract the first part of the name
  // This handles cases where the host name might be in a different format
  const parts = host.split(' ');
  if (parts.length > 0) {
    // Check if the first part is a known visitor center
    if (parts[0] in visitorCenterColors) {
      return parts[0];
    }
    
    // Check if the first two parts form a known visitor center
    if (parts.length > 1 && `${parts[0]} ${parts[1]}` in visitorCenterColors) {
      return `${parts[0]} ${parts[1]}`;
    }
  }

  // Default to the original host if no mapping is found
  return host;
}; 