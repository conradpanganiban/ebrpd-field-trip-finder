# Season Closure Guide for Visitor Centers

This guide outlines the complete process for closing a visitor center's season in the TripFinder application. When a visitor center needs to close applications for a specific season (e.g., Fall 2025), follow these steps in order.

## Overview

Closing a season involves updating multiple files to ensure:
1. **Program data** reflects the closed status
2. **UI components** display appropriate messaging
3. **Button behavior** is disabled with proper text
4. **Modal displays** show closed status correctly
5. **Configuration files** are consistent

**Important Note**: Not all programs in a visitor center need to be closed. Some visitor centers may have mixed statuses where certain programs remain open while others are closed (e.g., Coyote Hills has 2 open programs and others closed).

## Step-by-Step Process

### 1. Update Program Data Files

#### 1.1 Modify the JSON Program File
**File Location**: `src/data/programs/[VisitorCenterName].json`

**Changes Required**:
- **For programs to be closed**: Change the season name from `"Fall 2025"` to `"FULLY BOOKED Fall 2025"`
- **For programs to remain open**: Keep the season name as `"Fall 2025"` with `"status": "open"`
- Ensure `"status": "closed"` is set for closed programs
- Verify `"isOverride": false` is maintained

**Example - Mixed Status Visitor Center**:
```json
"application_status": [
  {
    "id": "coyotehills-1",
    "season": "Fall 2025",                    // Remains open
    "status": "open",                         // Open for applications
    "isOverride": false
  },
  {
    "id": "coyotehills-2", 
    "season": "Fall 2025",                    // Remains open
    "status": "open",                         // Open for applications
    "isOverride": false
  },
  {
    "id": "coyotehills-3",
    "season": "FULLY BOOKED Fall 2025",      // Changed to closed
    "status": "closed",                       // Must be "closed"
    "isOverride": false
  }
  // ... other programs
]
```

**Example - Fully Closed Visitor Center**:
```json
"application_status": [
  {
    "id": "ardenwood-1",
    "season": "FULLY BOOKED Fall 2025",      // Changed from "Fall 2025"
    "status": "closed",                       // Must be "closed"
    "isOverride": false
  },
  // ... other programs (all closed)
]
```

**Important**: 
- Apply the "FULLY BOOKED" change **only to programs that need to be closed**
- Programs that should remain open keep their original season name and "open" status
- Review each program individually to determine its status

#### 1.2 Verify Season Date Ranges
**File Location**: `src/utils/seasonDateRanges.ts`

**Check**: Ensure the "FULLY BOOKED Fall 2025" season exists with correct dates.

**Example**:
```typescript
"FULLY BOOKED Fall 2025": {
    start: new Date(2025, 7, 11), // August 11, 2025
    end: new Date(2025, 11, 31)   // December 31, 2025
},
```

**Note**: The "FULLY BOOKED" season should have the same date range as the regular season.

### 2. Update Host Status Configuration

#### 2.1 Modify Host Status Config
**File Location**: `src/utils/hostStatusConfig.ts`

**Changes Required**:
- **For fully closed visitor centers**: Update all seasons to "closed" status
- **For mixed status visitor centers**: Use `overridePrograms` array to specify which programs have custom statuses
- Ensure the configuration matches the actual program data

**Example - Fully Closed Visitor Center**:
```typescript
"Ardenwood": {
  defaultStatuses: [
    { season: "FULLY BOOKED Fall 2025", status: "closed", isOverride: false },
    { season: "Spring 2026", status: "closed", isOverride: false },
    { season: "Summer 2026", status: "closed", isOverride: false }
  ],
  overridePrograms: []
},
```

**Example - Mixed Status Visitor Center**:
```typescript
"CoyoteHills": {
  defaultStatuses: [
    { season: "Fall 2025", status: "closed", isOverride: false },        // Default closed
    { season: "Spring 2026", status: "closed", isOverride: false },
    { season: "Summer 2026", status: "closed", isOverride: false }
  ],
  overridePrograms: ["coyotehills-1", "coyotehills-2"]                  // These programs override defaults
},
```

**Note**: Programs listed in `overridePrograms` will use their individual `application_status` instead of the host defaults.

### 3. Update Utility Functions

#### 3.1 Modify Program Utils
**File Location**: `src/utils/programUtils.ts`

**Changes Required**:
- Add a new function to identify the visitor center's programs
- Update the main identification function to include the visitor center
- Ensure button text and disabled state logic includes the visitor center

**Example**:
```typescript
// Add new identification function
export function isArdenwoodProgram(program: Program): boolean {
  return program.program_host === "Ardenwood Historic Farm" || 
         program.visitor_center === "Ardenwood" ||
         program.id?.startsWith("ardenwood-");
}

// Update main function
export function isBigBreakOrCrabCoveOrSpecificCoyoteHillsProgram(program: Program): boolean {
  return isBigBreakProgram(program) || 
         isCrabCoveProgram(program) || 
         isArdenwoodProgram(program) ||           // Added
         isSpecificCoyoteHillsProgram(program);
}
```

**Note**: The function name should be updated to reflect all included visitor centers.

## UI Component Behavior Changes

### Emoji Display Logic

When a visitor center closes its season, the emoji display behavior may change:

#### Ardenwood Programs (Closed Seasons)
- **Program Cards**: Show only the **first 3 emojis** instead of all emojis
- **Reason**: Provides a cleaner, more focused appearance for closed programs
- **Implementation**: Automatically detected when `program.program_host === "Ardenwood Historic Farm"` and has "FULLY BOOKED" status

#### Other Visitor Centers
- **Program Cards**: Continue to show **all emojis** as normal
- **No changes** to emoji display behavior

#### Example Emoji Behavior
```typescript
// Ardenwood program with 7 emojis: 🌽 🐐 👨‍🌾 👁️ 👃 👂 ✋
// When season is closed: Shows only 🌽 🐐 👨‍🌾 (first 3)
// When season is open: Shows all 7 emojis

// Other visitor center programs: Always show all emojis regardless of status
```

### 4. Verify UI Components

#### 4.1 Program Card Component
**File Location**: `src/components/ProgramCard.tsx`

**Check**: Ensure the "Fully Booked" text displays for the visitor center.

**Current Implementation**:
```typescript
{isBigBreakOrCrabCoveOrSpecificCoyoteHillsProgram(program) && (
  <div className="text-left mb-1">
    <p className="text-sm font-medium text-red-600">Fully Booked for Fall 2025</p>
  </div>
)}
```

**Action**: No changes needed if the utility function is properly updated.

#### 4.2 Program Modal Component
**File Location**: `src/components/ProgramModal.tsx`

**Check**: Verify button text and disabled state work correctly.

**Current Implementation**: Uses the utility functions for button behavior.

**Action**: No changes needed if utility functions are properly updated.

#### 4.3 Program Details Component
**File Location**: `src/components/program-modal/ProgramDetails.tsx`

**Check**: Verify season names display correctly in the modal.

**Current Implementation**: Displays season names directly from program data.

**Action**: No changes needed if program data is properly updated.

### 5. Testing and Verification

#### 5.1 Build Verification
Run the build command to ensure no TypeScript errors:
```bash
npm run build
```

#### 5.2 Visual Verification
Check that the following elements display correctly:

**Program Cards**:
- ✅ **Closed programs**: "Fully Booked for Fall 2025" text appears in red above the button
- ✅ **Closed programs**: Button is disabled (grayed out)
- ✅ **Closed programs**: Button text shows "Spring applications open Sept. 22, 2025"
- ✅ **Open programs**: Button shows "Apply Now" and is enabled

**Program Modals**:
- ✅ **Closed programs**: "FULLY BOOKED Fall 2025" appears under "Currently Scheduling"
- ✅ **Closed programs**: Status shows as closed with appropriate styling
- ✅ **Open programs**: "Fall 2025" appears with open status
- ✅ Button behavior matches the program's status

#### 5.3 Data Consistency Check
Verify that:
- **Closed programs** show "FULLY BOOKED Fall 2025" with "closed" status
- **Open programs** show "Fall 2025" with "open" status
- Season names are consistent across all files
- No programs are missed in the updates
- Mixed status visitor centers use `overridePrograms` correctly

## File Checklist

Use this checklist to ensure all required changes are completed:

- [ ] `src/data/programs/[VisitorCenterName].json` - Updated program seasons appropriately (closed vs. open)
- [ ] `src/utils/seasonDateRanges.ts` - Verified "FULLY BOOKED" season exists
- [ ] `src/utils/hostStatusConfig.ts` - Updated host status configuration (consider mixed statuses)
- [ ] `src/utils/programUtils.ts` - Added visitor center identification functions
- [ ] Build completed successfully with no errors
- [ ] Visual verification completed for cards and modals
- [ ] Data consistency verified across all programs
- [ ] Mixed status programs properly configured with `overridePrograms` if needed

## Common Issues and Solutions

### Issue: Button Still Shows "Apply Now"
**Cause**: Utility function not properly updated to include the visitor center
**Solution**: Check that `isBigBreakOrCrabCoveOrSpecificCoyoteHillsProgram` includes the visitor center

### Issue: "Fully Booked" Text Not Displaying
**Cause**: Program identification function not working correctly
**Solution**: Verify the identification logic matches the program data structure

### Issue: Season Name Shows as "Fall 2025" Instead of "FULLY BOOKED Fall 2025"
**Cause**: Program data file not updated
**Solution**: Check that all programs that should be closed have the updated season name

### Issue: Mixed Status Programs Not Working Correctly
**Cause**: `overridePrograms` not configured properly
**Solution**: Ensure programs that should override host defaults are listed in the `overridePrograms` array

### Issue: Build Errors
**Cause**: TypeScript compilation issues
**Solution**: Check for syntax errors, missing imports, or type mismatches

## Template for New Visitor Center Closure

When closing a season for a new visitor center, use this template:

```typescript
// 1. Add identification function
export function is[VisitorCenterName]Program(program: Program): boolean {
  return program.program_host === "[Exact Host Name]" || 
         program.visitor_center === "[Visitor Center Name]" ||
         program.id?.startsWith("[prefix]-");
}

// 2. Update main function
export function isBigBreakOrCrabCoveOrSpecificCoyoteHillsProgram(program: Program): boolean {
  return isBigBreakProgram(program) || 
         isCrabCoveProgram(program) || 
         isArdenwoodProgram(program) ||
         is[VisitorCenterName]Program(program) ||           // Add this line
         isSpecificCoyoteHillsProgram(program);
}

// 3. Update function name (optional but recommended)
export function isClosedSeasonProgram(program: Program): boolean {
  // ... same logic as above
}
```

## Mixed Status Configuration Examples

### Coyote Hills (Mixed Status)
```typescript
"CoyoteHills": {
  defaultStatuses: [
    { season: "Fall 2025", status: "closed", isOverride: false },        // Default closed
    { season: "Spring 2026", status: "closed", isOverride: false },
    { season: "Summer 2026", status: "closed", isOverride: false }
  ],
  overridePrograms: ["coyotehills-1", "coyotehills-2"]                  // These remain open
},
```

### Ardenwood (Fully Closed)
```typescript
"Ardenwood": {
  defaultStatuses: [
    { season: "FULLY BOOKED Fall 2025", status: "closed", isOverride: false },
    { season: "Spring 2026", status: "closed", isOverride: false },
    { season: "Summer 2026", status: "closed", isOverride: false }
  ],
  overridePrograms: []                                                   // No overrides needed
},
```

## Maintenance Notes

- **Season Updates**: When seasons change (e.g., from Fall 2025 to Fall 2026), update all references
- **New Programs**: Ensure new programs added to visitor centers follow the appropriate status pattern
- **Reopening**: To reopen a season, reverse the process by changing "FULLY BOOKED Fall 2025" back to "Fall 2025" and "closed" to "open"
- **Mixed Status Changes**: When changing program statuses, update both the program data and host configuration accordingly

## Support

If you encounter issues not covered in this guide:
1. Check the browser console for JavaScript errors
2. Verify all file paths and names are correct
3. Ensure TypeScript compilation succeeds
4. Compare with working examples (Big Break, Crab Cove, Ardenwood, Coyote Hills)
5. Check that all imports and dependencies are correct
6. Verify mixed status configurations use `overridePrograms` correctly
