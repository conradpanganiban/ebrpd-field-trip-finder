const fs = require('fs');
const path = require('path');

const programsDir = path.join(__dirname, '../src/data/programs');

// Function to update season order in application_status
function updateSeasonOrder(applicationStatus) {
  if (!Array.isArray(applicationStatus)) return applicationStatus;
  
  // Find the seasons
  const fall2025 = applicationStatus.find(s => s.season === 'Fall 2025' || s.season === 'FULLY BOOKED Fall 2025');
  const spring2025 = applicationStatus.find(s => s.season === 'Spring 2025');
  const summer2025 = applicationStatus.find(s => s.season === 'Summer 2025');
  const spring2026 = applicationStatus.find(s => s.season === 'Spring 2026');
  const summer2026 = applicationStatus.find(s => s.season === 'Summer 2026');
  
  // Create new array with correct order
  const newOrder = [];
  
  // Add Fall 2025 first (with original status)
  if (fall2025) {
    newOrder.push(fall2025);
  }
  
  // Add Spring 2026 (ensure it's closed)
  if (spring2026) {
    newOrder.push(spring2026);
  } else if (spring2025) {
    // Convert Spring 2025 to Spring 2026 and close it
    newOrder.push({
      ...spring2025,
      season: 'Spring 2026',
      status: 'closed'
    });
  } else {
    // Create Spring 2026 if it doesn't exist
    newOrder.push({
      id: applicationStatus[0]?.id || 'unknown',
      season: 'Spring 2026',
      status: 'closed',
      isOverride: false
    });
  }
  
  // Add Summer 2026 (ensure it's closed)
  if (summer2026) {
    newOrder.push(summer2026);
  } else if (summer2025) {
    // Convert Summer 2025 to Summer 2026 and close it
    newOrder.push({
      ...summer2025,
      season: 'Summer 2026',
      status: 'closed'
    });
  } else {
    // Create Summer 2026 if it doesn't exist
    newOrder.push({
      id: applicationStatus[0]?.id || 'unknown',
      season: 'Summer 2026',
      status: 'closed',
      isOverride: false
    });
  }
  
  return newOrder;
}

// Function to process a single file
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    let updated = false;
    
    // Update each program's application_status
    data.forEach(program => {
      if (program.application_status) {
        const newOrder = updateSeasonOrder(program.application_status);
        if (JSON.stringify(newOrder) !== JSON.stringify(program.application_status)) {
          program.application_status = newOrder;
          updated = true;
        }
      }
    });
    
    if (updated) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`Updated: ${path.basename(filePath)}`);
    } else {
      console.log(`No changes needed: ${path.basename(filePath)}`);
    }
    
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Main execution - only process Crab Cove
function main() {
  const crabCoveFile = 'CrabCove.json';
  const filePath = path.join(programsDir, crabCoveFile);
  
  if (fs.existsSync(filePath)) {
    console.log(`Processing ${crabCoveFile}...`);
    processFile(filePath);
    console.log('Season order update complete for Crab Cove!');
  } else {
    console.error(`File ${crabCoveFile} not found!`);
  }
}

main();
