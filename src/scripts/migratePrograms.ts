import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Program } from '@/types/program';
import { applyHostStatusConfig, extractHostNameFromPath } from '../utils/hostStatusUtils';

try {
  // Get the directory name
  const __filename = fileURLToPath(import.meta.url);
  console.log('__filename:', __filename);
  
  const __dirname = path.dirname(__filename);
  console.log('__dirname:', __dirname);
  
  // Define the path to the programs directory
  const PROGRAMS_DIR = path.join(__dirname, '../data/programs');
  console.log('PROGRAMS_DIR:', PROGRAMS_DIR);
  
  // Read all JSON files in the programs directory
  console.log('Reading program files...');
  const programFiles = fs.readdirSync(PROGRAMS_DIR)
    .filter(file => file.endsWith('.json'));
  console.log('Found program files:', programFiles);
  
  // Process each program file
  programFiles.forEach(file => {
    try {
      console.log(`Processing ${file}...`);
      const filePath = path.join(PROGRAMS_DIR, file);
      console.log('Reading from:', filePath);
      
      const programData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      console.log('Successfully read program data');
      
      // Check if the data is an array
      const isArray = Array.isArray(programData);
      const programs = isArray ? programData : [programData];
      console.log(`Processing ${programs.length} programs`);
      
      // Extract the host name from the file path
      const hostName = extractHostNameFromPath(file);
      console.log(`Host name: ${hostName}`);
      
      // Apply the host status configuration
      const updatedPrograms = applyHostStatusConfig(programs as Program[], hostName);
      console.log(`Updated ${updatedPrograms.length} programs`);
      
      // Write the updated data back to the file
      fs.writeFileSync(
        filePath,
        JSON.stringify(isArray ? updatedPrograms : updatedPrograms[0], null, 2),
        'utf8'
      );
      
      console.log(`Successfully updated ${file}`);
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  });
  
  console.log('Migration completed');
} catch (error) {
  console.error('Error during migration:', error);
} 