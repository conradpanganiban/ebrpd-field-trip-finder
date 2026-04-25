import { Program } from "@/types/program";

export function getUniqueCities(programs: Program[]): string[] {
  // Split comma-separated cities, filter out nulls, get unique values
  const cities = new Set<string>();
  programs.forEach(program => {
    if (program.city) {
      program.city.split(',').forEach(city => {
        cities.add(city.trim());
      });
    }
  });
  
  // Convert to array and sort
  return Array.from(cities).sort();
}

export function isCityMatch(program: Program, selectedCities: string[]): boolean {
  if (!program.city) return false;
  if (selectedCities.includes("All")) return true;
  
  const programCities = program.city.split(',').map(c => c.trim());
  return selectedCities.some(selectedCity => 
    programCities.includes(selectedCity)
  );
} 