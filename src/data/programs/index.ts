import Ardenwood from './Ardenwood.json';
import BigBreak from './BigBreak.json';
import BlackDiamond from './BlackDiamond.json';
import CoyoteHills from './CoyoteHills.json';
import CrabCove from './CrabCove.json';
import DelValle from './DelValle.json';
import MobileEducation from './MobileEducation.json';
import Sunol from './Sunol.json';
import TildenNatureArea from './TildenNatureArea.json';

// Function to ensure all required fields are present
const ensureRequiredFields = (programs: any[]) => {
  return programs.map(program => ({
    ...program,
    specific_timing: program.specific_timing || null,
    created_at: program.created_at || "2024-03-17T00:00:00Z",
    updated_at: program.updated_at || "2024-03-17T00:00:00Z"
  }));
};

const HIDDEN_PROGRAM_IDS = ["blackdiamond-1"];

const filterHidden = (programs: any[]) =>
  programs.filter((p) => !HIDDEN_PROGRAM_IDS.includes(p.id));

// Transform all program data to ensure required fields
const transformedArdenwood = ensureRequiredFields(Ardenwood);
const transformedBigBreak = ensureRequiredFields(BigBreak);

// Ensure Black Diamond Coal Mining History Tour appears first among Black Diamond programs
const transformedBlackDiamond = filterHidden(ensureRequiredFields(BlackDiamond)).sort((a, b) => {
  if (a.id === "blackdiamond-10") return -1;
  if (b.id === "blackdiamond-10") return 1;
  return 0;
});

const transformedCoyoteHills = ensureRequiredFields(CoyoteHills);
const transformedCrabCove = ensureRequiredFields(CrabCove);
const transformedDelValle = ensureRequiredFields(DelValle);
const transformedMobileEducation = ensureRequiredFields(MobileEducation);
const transformedSunol = ensureRequiredFields(Sunol);
const transformedTildenNatureArea = ensureRequiredFields(TildenNatureArea);

export const allPrograms = [
  ...transformedArdenwood,
  ...transformedBigBreak,
  ...transformedBlackDiamond,
  ...transformedCoyoteHills,
  ...transformedCrabCove,
  ...transformedDelValle,
  ...transformedMobileEducation,
  ...transformedSunol,
  ...transformedTildenNatureArea
];

export const programsByLocation = {
  "Ardenwood Historic Farm": transformedArdenwood,
  "Big Break": transformedBigBreak,
  "Black Diamond Mines": transformedBlackDiamond,
  "Coyote Hills": transformedCoyoteHills,
  "Crab Cove": transformedCrabCove,
  "Del Valle": transformedDelValle,
  "Mobile Education": transformedMobileEducation,
  "Sunol Wilderness": transformedSunol,
  "Tilden Nature Area": transformedTildenNatureArea
};

export default allPrograms;
