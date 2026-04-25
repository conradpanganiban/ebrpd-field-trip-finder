import { updateApplicationDates } from '../src/utils/applicationDates';

async function main() {
  try {
    console.log('Updating application dates...');
    await updateApplicationDates();
    console.log('Application dates updated successfully.');
  } catch (error) {
    console.error('Failed to update application dates:', error);
    console.log('Continuing build despite application date update error...');
  }
}

main(); 