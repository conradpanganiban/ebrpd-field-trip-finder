// Map of program hosts to their addresses
export const programHostAddresses: Record<string, string> = {
  "Ardenwood Historic Farm": "34600 Ardenwood Blvd, Fremont, CA 94555",
  "Big Break Visitor Center": "69 Big Break Rd, Oakley, CA 94561",
  "Black Diamond Mines Visitor Center": "5175 Somersville Rd, Antioch, CA 94509",
  "Coyote Hills Visitor Center": "8000 Patterson Ranch Rd, Fremont, CA 94555",
  "Doug Siden Crab Cove Visitor Center": "1252 McKay Ave, Alameda, CA 94501",
  "Del Valle Visitor Center": "7000 Del Valle Rd, Livermore, CA 94550",
  "Mobile Education": "Various locations",
  "Sunol Visitor Center": "1895 Geary Rd, Sunol, CA 94586",
  "Tilden Environmental Education Center": "600 Canon Dr, Berkeley, CA 94708",
  "Thurgood Marshall Regional Park": "38.04690393457224, -122.01971286812669",
  "Radke Martinez Regional Shoreline": "300 N. Court St Martinez CA 94553"
};

/**
 * Gets the Google Maps URL for a program location
 * @param programHost The program host name
 * @param city The city name (optional)
 * @returns The Google Maps URL
 */
export const getGoogleMapsUrl = (programHost: string, city?: string): string => {
  const address = programHostAddresses[programHost];
  if (!address) {
    // Fallback to just the program host and city if no address is found
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(programHost + (city ? `, ${city}` : ''))}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}; 