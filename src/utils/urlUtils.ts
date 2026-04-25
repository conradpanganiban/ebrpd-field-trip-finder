import { Program } from '@/types/program';

/**
 * Converts a string to a URL-friendly slug
 * @param str The string to convert
 * @returns A URL-friendly slug
 */
export const toSlug = (str: string | undefined | null): string => {
  // Handle undefined, null, or empty string cases
  if (!str || typeof str !== 'string') {
    return '';
  }
  
  return str
    .toLowerCase()
    // Replace special characters with their word equivalents
    .replace(/&/g, 'and')
    .replace(/\+/g, 'plus')
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
    .replace(/(^-|-$)/g, '') // Remove leading/trailing hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .substring(0, 100); // Limit length for SEO
};

/**
 * Generates a canonical URL path for a program
 * @param program The program object
 * @returns The canonical URL path
 */
export const getProgramCanonicalUrl = (program: Program): string => {
  const hostSlug = toSlug(program.program_host);
  const citySlug = toSlug(program.city);
  const programSlug = toSlug(program.program_name);
  
  // Ensure we have valid slugs before constructing URL
  if (!hostSlug || !citySlug || !programSlug) {
    console.warn('Invalid program data for URL generation:', program);
    return '/programs';
  }
  
  return `/programs/${hostSlug}/${citySlug}/${programSlug}`;
};

/**
 * Extracts the program ID from a canonical URL
 * @param programs Array of all programs
 * @param host The host parameter from the URL
 * @param city The city parameter from the URL
 * @param slug The slug parameter from the URL
 * @returns The program ID if found, null otherwise
 */
export const getProgramIdFromSlug = (programs: Program[], host: string, city: string, slug: string): string | null => {
  const program = programs.find(p => {
    // Ensure all required properties exist before calling toSlug
    if (!p.program_host || !p.city || !p.program_name) {
      return false;
    }
    
    return toSlug(p.program_host) === host &&
           toSlug(p.city) === city &&
           toSlug(p.program_name) === slug;
  });
  return program?.id || null;
};
