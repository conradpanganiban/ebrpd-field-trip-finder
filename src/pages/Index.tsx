import { useState, useEffect } from "react";
import { SearchBar } from "@/components/SearchBar";
import { ProgramCard } from "@/components/ProgramCard";
import { TableView } from "@/components/TableView";
import { Program } from "@/types/program";
import { Grid, List, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import allPrograms from "@/data/programs";
import { useIsMobile } from "@/hooks/use-mobile";
import { FilterSidebar } from "@/components/FilterSidebar";
import { isProgramOpen, isProgramFullyClosed } from "@/utils/programUtils";
import { GradeNav } from "@/components/GradeNav";

const Index = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({
    programHosts: [] as string[],
    formats: [] as string[],
    fees: [] as string[],
    cities: ["All"] as string[],
    availability: [] as string[],
  });
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>(allPrograms);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      const shouldShow = window.scrollY <= 50;
      setShowAnnouncement((prev) => (prev !== shouldShow ? shouldShow : prev));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Add event listener for program host filtering
  useEffect(() => {
    const handleProgramHostFilter = (event: CustomEvent<{ programHost: string }>) => {
      const { programHost } = event.detail;
      setSelectedFilters(prev => ({
        ...prev,
        programHosts: [programHost]
      }));
      // Close the filter sidebar if it's open
      setIsFilterSidebarOpen(false);
    };

    window.addEventListener('filterProgramHost', handleProgramHostFilter as EventListener);
    return () => window.removeEventListener('filterProgramHost', handleProgramHostFilter as EventListener);
  }, []);

  useEffect(() => {
    const filtered = allPrograms.filter(program => {
      // Search query filter
      if (searchQuery) {
        const query = (searchQuery || '').toLowerCase();
        if (
          !(program.program_name?.toLowerCase()?.includes(query)) &&
          !(program.description?.toLowerCase()?.includes(query)) &&
          !(program.city?.toLowerCase()?.includes(query)) &&
          !(program.program_host?.toLowerCase()?.includes(query)) &&
          !(program.learning_standards?.toLowerCase()?.includes(query)) &&
          !(program.format && (Array.isArray(program.format) 
            ? program.format.some(f => (f || '').toLowerCase()?.includes(query))
            : (program.format || '').toLowerCase()?.includes(query)))
        ) {
          return false;
        }
      }

      // Grade filter
      if (selectedGrade) {
        if (typeof program.grade !== 'string' || !program.grade.includes(selectedGrade)) {
          return false;
        }
      }

      // City filter
      if (!selectedFilters.cities.includes("All")) {
        const programCities = program.city?.split(',').map(c => c.trim()) || [];
        if (!selectedFilters.cities.some(city => programCities.includes(city))) {
          return false;
        }
      }

      // Location filter
      if (selectedFilters.programHosts.length > 0) {
        if (!selectedFilters.programHosts.includes(program.program_host)) {
          return false;
        }
      }

      // Format filter
      if (selectedFilters.formats.length > 0) {
        const programFormat = Array.isArray(program.format) ? program.format : [program.format];
        if (!programFormat.some(format => selectedFilters.formats.includes(format))) {
          return false;
        }
      }

      // Fee filter
      if (selectedFilters.fees.length > 0) {
        const hasFee = program.id === "bigbreak-7" || program.fee === "yes";
        if (!selectedFilters.fees.includes(hasFee ? "yes" : "no")) {
          return false;
        }
      }

      // Availability filter
      if (selectedFilters.availability.length > 0) {
        const isOpen = isProgramOpen(program);
        const isClosed = isProgramFullyClosed(program);
        
        if (selectedFilters.availability.includes("open") && !isOpen) {
          return false;
        }
        if (selectedFilters.availability.includes("closed") && !isClosed) {
          return false;
        }
      }

      return true;
    });

    setFilteredPrograms(filtered);
  }, [searchQuery, selectedFilters, selectedGrade]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setSelectedFilters(prev => {
      const currentFilters = prev[filterType as keyof typeof prev];
      let newFilters: string[];
      
      if (filterType === "cities") {
        if (value === "All") {
          newFilters = ["All"];
        } else {
          const currentCities = currentFilters.filter(c => c !== "All");
          if (currentCities.includes(value)) {
            // Remove the city if it's already selected
            newFilters = currentCities.filter(c => c !== value);
            if (newFilters.length === 0) {
              newFilters = ["All"];
            }
          } else {
            // Add the city to selection
            newFilters = [...currentCities, value];
          }
        }
      } else {
        newFilters = currentFilters.includes(value)
          ? currentFilters.filter(v => v !== value)
          : [...currentFilters, value];
      }
      
      return {
        ...prev,
        [filterType]: newFilters
      };
    });
  };

  const handleResetFilters = () => {
    setSelectedFilters({
      programHosts: [],
      formats: [],
      fees: [],
      cities: ["All"],
      availability: [],
    });
    setSelectedGrade(null);
  };

  const hasActiveFilters = Object.values(selectedFilters).some(filters => 
    filters.length > 0 && (filters.length > 1 || filters[0] !== "All")
  ) || selectedGrade !== null;

  return (
    <div className="min-h-screen bg-background">
      <div 
        className={`bg-[#506F33] text-white text-center py-2 px-4 transition-all duration-300 ${
          showAnnouncement ? 'opacity-100 h-auto' : 'opacity-0 h-0 overflow-hidden'
        }`}
      >
        <p className="text-sm md:text-lg font-medium">
          Applications for field trips through July 31, 2026 are open.
        </p>
        <p className="text-xs md:text-sm font-normal md:font-medium">
          Most sites are fully booked for the spring season.
        </p>
                <p className="text-xs md:text-sm font-normal md:font-medium">
          Apply by March 15 for early consideration and best availability for the summer.
        </p>
      </div>

      <div className="sticky top-0 bg-background z-40">
        <div className="container py-4 px-4 md:px-6">
          <h1 className="text-4xl font-bold text-center mb-4">
            East Bay Regional Parks Field Trips
          </h1>
        </div>

        <GradeNav
          selectedGrade={selectedGrade}
          onGradeChange={setSelectedGrade}
          selectedCities={selectedFilters.cities}
          onCityChange={handleFilterChange}
        />

        <div className="container py-4 px-4 md:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1">
              <SearchBar onSearch={handleSearch} className="flex-grow" />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFilterSidebarOpen(true)}
                className={`flex items-center gap-2 ${hasActiveFilters ? 'bg-primary/10' : ''}`}
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
                {hasActiveFilters && (
                  <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                    {Object.values(selectedFilters).reduce((acc, curr) => 
                      acc + (curr.length > 1 || curr[0] !== "All" ? curr.length : 0), 0
                    ) + (selectedGrade ? 1 : 0)}
                  </span>
                )}
              </Button>
            </div>

            <div className="flex items-center gap-1 border rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-lg"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-lg"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="container py-4 px-4 md:px-6">
        <div className="space-y-6">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrograms.map((program) => (
                <ProgramCard key={program.id} program={program} allPrograms={filteredPrograms} />
              ))}
            </div>
          ) : (
            <TableView programs={filteredPrograms} />
          )}
        </div>
      </main>

      <FilterSidebar
        isOpen={isFilterSidebarOpen}
        onClose={() => setIsFilterSidebarOpen(false)}
        programs={allPrograms}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />
    </div>
  );
};

export default Index;
