import fs from 'fs';
import path from 'path';
import { Program } from '../src/types/program';

interface ProgramMetadata {
  title: string;
  description: string;
  keywords: string[];
  og_title: string;
  og_description: string;
  twitter_title: string;
  twitter_description: string;
}

function generateMetadata(program: Program): ProgramMetadata {
  const hostName = program.program_host;
  const description = program.description;
  const truncatedDescription = description.substring(0, 200) + (description.length > 200 ? '...' : '');
  const keywords = program.grade.split(', ');

  return {
    title: `${program.program_name} | ${hostName} | East Bay Regional Park District`,
    description: description,
    keywords: keywords,
    og_title: `${program.program_name} | ${hostName}`,
    og_description: truncatedDescription,
    twitter_title: `${program.program_name} | ${hostName}`,
    twitter_description: truncatedDescription
  };
}

function updateProgramFiles() {
  const programsDir = path.join(process.cwd(), 'src', 'data', 'programs');
  const files = fs.readdirSync(programsDir);

  files.forEach(file => {
    if (file.endsWith('.json')) {
      const filePath = path.join(programsDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const programs = JSON.parse(content) as Program[];

      const updatedPrograms = programs.map(program => ({
        ...program,
        metadata: generateMetadata(program)
      }));

      fs.writeFileSync(
        filePath,
        JSON.stringify(updatedPrograms, null, 2),
        'utf-8'
      );

      console.log(`Updated metadata for programs in ${file}`);
    }
  });
}

// Run the script
updateProgramFiles(); 