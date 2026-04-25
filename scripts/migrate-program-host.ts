import * as fs from 'fs';
import * as path from 'path';

const programsDir = path.join(process.cwd(), 'src', 'data', 'programs');

// Process each program file
fs.readdirSync(programsDir)
  .filter(file => file.endsWith('.json'))
  .forEach(file => {
    const filePath = path.join(programsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const programs = JSON.parse(content);

    // Update each program in the file
    const updatedPrograms = programs.map((program: any) => {
      const { location, ...rest } = program;
      return {
        ...rest,
        program_host: location
      };
    });

    // Write back to file
    fs.writeFileSync(
      filePath,
      JSON.stringify(updatedPrograms, null, 2),
      'utf-8'
    );

    console.log(`Updated ${file}`);
  });

console.log('Migration complete!'); 