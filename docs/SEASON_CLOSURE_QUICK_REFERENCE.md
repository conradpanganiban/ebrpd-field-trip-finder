# Season Closure Quick Reference

## 🚨 Emergency Season Closure Checklist

When a visitor center needs to close its season immediately, follow these **5 critical steps**:

### 1. 📁 Update Program Data
**File**: `src/data/programs/[VisitorCenterName].json`
- **Closed programs**: Change `"Fall 2025"` → `"FULLY BOOKED Fall 2025"`
- **Open programs**: Keep `"Fall 2025"` with `"status": "open"`
- Set `"status": "closed"` for closed programs only
- **Important**: Not all programs need to be closed (e.g., Coyote Hills has 2 open programs)

### 2. ⚙️ Update Host Config
**File**: `src/utils/hostStatusConfig.ts`
- **Fully closed centers**: Update all seasons to "closed"
- **Mixed status centers**: Use `overridePrograms` array for open programs
- Ensure configuration matches actual program data

### 3. 🔧 Update Utility Functions
**File**: `src/utils/programUtils.ts`
- Add `is[VisitorCenterName]Program()` function
- Include in main identification function

### 4. ✅ Test Build
```bash
npm run build
```
- Must complete without errors

### 5. 👀 Visual Verification
- **Closed programs**: Show "Fully Booked for Fall 2025" with disabled buttons
- **Open programs**: Show "Fall 2025" with enabled "Apply Now" buttons
- **Ardenwood closed programs**: Show only first 3 emojis (cleaner appearance)
- Modals display appropriate status for each program

---

## 📋 File Locations

| Component | File Path |
|-----------|-----------|
| Program Data | `src/data/programs/[Name].json` |
| Host Config | `src/utils/hostStatusConfig.ts` |
| Utility Functions | `src/utils/programUtils.ts` |
| Season Dates | `src/utils/seasonDateRanges.ts` |

---

## 🔄 Mixed Status Scenarios

### Fully Closed Visitor Center (e.g., Ardenwood)
- All programs use `"FULLY BOOKED Fall 2025"`
- Host config shows all seasons as "closed"
- No `overridePrograms` needed

### Mixed Status Visitor Center (e.g., Coyote Hills)
- Some programs: `"Fall 2025"` with `"status": "open"`
- Other programs: `"FULLY BOOKED Fall 2025"` with `"status": "closed"`
- Host config uses `overridePrograms: ["program-1", "program-2"]`

---

## 🔍 Common Issues

| Problem | Solution |
|---------|----------|
| Button still shows "Apply Now" | Check utility function includes visitor center |
| "Fully Booked" text missing | Verify identification function logic |
| Mixed status not working | Check `overridePrograms` configuration |
| Build errors | Check TypeScript syntax and imports |
| Season name wrong | Verify JSON data file updates |

---

## 📞 Need Help?

1. Check browser console for errors
2. Compare with working examples:
   - **Fully closed**: Big Break, Crab Cove, Ardenwood
   - **Mixed status**: Coyote Hills
3. Verify all file paths are correct
4. Ensure TypeScript compilation succeeds
5. Check `overridePrograms` configuration for mixed statuses

---

**⚠️ Remember**: 
- Always test with `npm run build` before deploying!
- Not all programs in a visitor center need to be closed
- Use `overridePrograms` for mixed status configurations
