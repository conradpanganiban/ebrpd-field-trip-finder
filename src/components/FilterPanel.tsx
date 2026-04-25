import { Button } from "./ui/button";
import { useState } from "react";
import { ChevronDown, ChevronUp, X, Check } from "lucide-react";
import { useDeviceType } from "@/hooks/use-mobile";

interface FilterPanelProps {
  onFilterChange: (filters: { grade?: string | null; cities?: string[] }) => void;
  isOpen?: boolean;
  onClose?: () => void;
  selectedCities?: string[];
}

export const FilterPanel = ({ 
  onFilterChange, 
  isOpen = true,
  onClose,
  selectedCities = []
}: FilterPanelProps) => {
  const [activeGrade, setActiveGrade] = useState<string | null>(null);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [gradeDropdownOpen, setGradeDropdownOpen] = useState(false);

  const deviceType = useDeviceType();
  const isMobile = deviceType === 'mobile';
  const isTablet = deviceType === 'tablet';

  const grades = [
    "Pre-K", "K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "All"
  ];

  const cities = [
    "All", "District-wide", "Alameda", "Antioch",
    "Berkeley", "Concord", "Fremont", "Livermore", "Martinez",
    "Oakland", "Oakley", "Pleasanton", "San Ramon", "Sunol", "Various"
  ];

  const handleFilterChange = (newGrade: string | null, newCities: string[]) => {
    setActiveGrade(newGrade);
    onFilterChange({ grade: newGrade, cities: newCities });
  };

  const handleGradeClick = (grade: string) => {
    const newGrade = grade === "All" ? null : grade;
    handleFilterChange(newGrade, selectedCities);
    setGradeDropdownOpen(false);
  };

  const handleCityClick = (city: string) => {
    let newCities: string[];
    if (city === "All") {
      newCities = [];
    } else if (selectedCities.includes(city)) {
      newCities = selectedCities.filter(c => c !== city);
    } else {
      newCities = [...selectedCities, city];
    }
    handleFilterChange(activeGrade, newCities);
  };

  if (!isOpen) return null;

  return (
    <div className={`bg-secondary rounded-lg animate-fade-in ${isMobile ? 'p-6 absolute top-full left-0 right-0 z-50 shadow-lg' : 'p-4'}`}>
      {isMobile && onClose && (
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-accent"
          aria-label="Close filters"
        >
          <X className="h-5 w-5 text-[#4e6e1e]" />
        </button>
      )}

      {/* Grade & City Row */}
      <div className={`flex ${isMobile ? 'flex-row gap-2 justify-between' : 'flex-col sm:flex-row items-center justify-between gap-4'}`}>
        {/* Grade Selection */}
        {isMobile ? (
          // Mobile view - dropdown
          <div className="relative w-[50%]">
            <button
              onClick={() => setGradeDropdownOpen(!gradeDropdownOpen)}
              className="flex items-center justify-between w-full px-4 py-3 border border-[#4e6e1e] rounded-lg text-[#4e6e1e] hover:bg-[#f0f5eb] text-sm"
              aria-expanded={gradeDropdownOpen}
              aria-haspopup="true"
            >
              {activeGrade ? `Grade: ${activeGrade}` : "Grade: Select"}
              {gradeDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {gradeDropdownOpen && (
              <div className="absolute left-0 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-[300px] overflow-y-auto">
                {grades.map((grade) => (
                  <button
                    key={grade}
                    onClick={() => handleGradeClick(grade)}
                    className={`block w-full text-left px-4 py-3 text-sm hover:bg-gray-100 ${
                      (activeGrade === grade) || (grade === "All" && activeGrade === null) 
                        ? "text-[#8b5e34] font-bold" 
                        : "text-gray-700 font-medium"
                    }`}
                  >
                    {grade}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Tablet and Desktop view - horizontal list
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-[#4e6e1e]">Grade:</h3>
            <div className="flex flex-wrap gap-2 text-sm font-medium text-[#4e6e1e]">
              {grades.map((grade) => (
                <button
                  key={grade}
                  onClick={() => handleGradeClick(grade)}
                  className={`px-2 py-1 rounded-md hover:text-[#8b5e34] cursor-pointer font-bold ${
                    (activeGrade === grade) || (grade === "All" && activeGrade === null) 
                      ? "text-[#8b5e34] underline" 
                      : ""
                  }`}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* City Dropdown */}
        <div className={`relative ${isMobile ? 'w-[50%]' : ''}`}>
          <button
            onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
            className="flex items-center justify-between w-full px-4 py-2 border border-[#4e6e1e] rounded-lg text-[#4e6e1e] hover:bg-[#f0f5eb] text-sm"
            aria-expanded={cityDropdownOpen}
            aria-haspopup="true"
          >
            City
            {cityDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {cityDropdownOpen && (
            <div className="absolute right-0 mt-2 w-[200%] bg-white border border-gray-300 text-sm rounded-lg shadow-lg z-10 max-h-[300px] overflow-y-auto">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => handleCityClick(city)}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center justify-between ${
                    selectedCities.includes(city) ? "text-[#8b5e34] font-bold" : "text-gray-700"
                  }`}
                >
                  <span>{city}</span>
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
