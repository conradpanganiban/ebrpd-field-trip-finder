import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { useDeviceType } from "@/hooks/use-mobile";

interface GradeNavProps {
  selectedGrade: string | null;
  onGradeChange: (grade: string | null) => void;
  selectedCities: string[];
  onCityChange: (filterType: string, value: string) => void;
}

export const GradeNav = ({ 
  selectedGrade, 
  onGradeChange,
  selectedCities,
  onCityChange
}: GradeNavProps) => {
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [gradeDropdownOpen, setGradeDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const gradeDropdownRef = useRef<HTMLDivElement>(null);
  
  const deviceType = useDeviceType();
  const isMobile = deviceType === 'mobile';

  const grades = [
    "Pre-K", "K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "All"
  ];

  const cities = [
    "All", "District-wide", "Alameda", "Bay Point", "Antioch",
    "Berkeley", "Concord", "Fremont", "Livermore", "Martinez",
    "Oakland", "Oakley", "Pleasanton", "San Ramon", "Sunol", "Various"
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCityDropdownOpen(false);
      }
      if (gradeDropdownRef.current && !gradeDropdownRef.current.contains(event.target as Node)) {
        setGradeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCityClick = (city: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (city === "All") {
      // If clicking "All", clear other selections
      onCityChange("cities", "All");
    } else {
      if (selectedCities.includes("All")) {
        // If "All" is currently selected, remove it and select the clicked city
        onCityChange("cities", city);
      } else if (selectedCities.includes(city)) {
        // If city is already selected, remove it
        const newCities = selectedCities.filter(c => c !== city);
        if (newCities.length === 0) {
          // If no cities are selected, revert to "All"
          onCityChange("cities", "All");
        } else {
          // Remove the city
          onCityChange("cities", city);
        }
      } else {
        // Add the city to selection
        onCityChange("cities", city);
      }
    }
  };

  const handleGradeClick = (grade: string) => {
    onGradeChange(grade === "All" ? null : grade);
    setGradeDropdownOpen(false);
  };

  // Reorganize grades for vertical reading in the grid
  const organizeGradesForVerticalReading = () => {
    const result = [];
    const numColumns = 3;
    const numRows = Math.ceil(grades.length / numColumns);
    
    // Create a matrix with the correct number of rows and columns
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numColumns; j++) {
        const index = j * numRows + i;
        if (index < grades.length) {
          result.push(grades[index]);
        }
      }
    }
    
    return result;
  };

  const verticalGrades = organizeGradesForVerticalReading();

  return (
    <div className="bg-[#f0f5eb] px-6 py-4">
      <div className="flex items-center justify-between">
        {isMobile ? (
          // Mobile view - dropdown for grades
          <div className="relative" ref={gradeDropdownRef}>
            <button
              onClick={() => setGradeDropdownOpen(!gradeDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-[#4e6e1e] rounded-lg text-[#4e6e1e] hover:bg-white transition-colors"
            >
              <span>{selectedGrade ? `Grade: ${selectedGrade}` : "Grade: Select"}</span>
              {gradeDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {gradeDropdownOpen && (
              <div className="absolute left-0 mt-2 w-[300px] bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-[300px] overflow-y-auto">
                <div className="grid grid-cols-3 gap-1 p-2">
                  {verticalGrades.map((grade) => (
                    <button
                      key={grade}
                      onClick={() => handleGradeClick(grade)}
                      className={`flex items-center justify-center px-2 py-2 text-center hover:bg-gray-100 rounded-md ${
                        (selectedGrade === grade) || (grade === "All" && selectedGrade === null)
                          ? "text-[#8b5e34] font-bold bg-[#f0f5eb]"
                          : "text-gray-700"
                      }`}
                    >
                      <span>{grade}</span>
                      {(selectedGrade === grade) || (grade === "All" && selectedGrade === null) && 
                        <Check size={14} className="text-[#8b5e34] ml-1" />
                      }
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          // Desktop/Tablet view - horizontal list
          <div className="flex flex-wrap items-center gap-6">
            <span className="text-[#4e6e1e]">Grade:</span>
            {grades.map((grade) => (
              <button
                key={grade}
                onClick={() => onGradeChange(grade === "All" ? null : grade)}
                className={`text-[#4e6e1e] hover:text-[#8b5e34] transition-colors font-bold ${
                  (selectedGrade === grade) || (grade === "All" && selectedGrade === null)
                    ? "text-[#8b5e34] underline"
                    : ""
                }`}
              >
                {grade}
              </button>
            ))}
          </div>
        )}

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 border border-[#4e6e1e] rounded-lg text-[#4e6e1e] hover:bg-white transition-colors"
          >
            <span>City</span>
            {cityDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {cityDropdownOpen && (
            <div className="absolute right-0 mt-2 w-[200px] bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-[300px] overflow-y-auto">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={(e) => handleCityClick(city, e)}
                  className="flex items-center justify-between w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  <span className={selectedCities.includes(city) ? "text-[#8b5e34] font-bold" : "text-gray-700"}>
                    {city}
                  </span>
                  {selectedCities.includes(city) && <Check size={16} className="text-[#8b5e34]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 