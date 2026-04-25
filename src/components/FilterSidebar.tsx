import { ScrollArea } from "@/components/ui/scroll-area";
import { Program } from "@/types/program";
import { getUniqueCities } from "@/utils/cityUtils";
import { FilterSection, FilterCheckbox, FilterHeader } from "./filter/FilterComponents";
import { getJsonFileFromHostName } from "@/utils/hostUtils";
import { isProgramOpen, isProgramFullyClosed } from "@/utils/programUtils";
import { Link } from "react-router-dom";

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  programs: Program[];
  selectedFilters: {
    programHosts: string[];
    formats: string[];
    fees: string[];
    cities: string[];
    availability: string[];
  };
  onFilterChange: (filterType: string, value: string) => void;
  onReset: () => void;
}

export function FilterSidebar({
  isOpen,
  onClose,
  programs,
  selectedFilters,
  onFilterChange,
  onReset,
}: FilterSidebarProps) {
  // Get unique values for each filter type
  const program_hosts = Array.from(new Set(programs.map((p) => p.program_host))).sort();
  const formats = Array.from(new Set(programs.flatMap((p) => 
    Array.isArray(p.format) ? p.format.filter(Boolean) : (p.format ? [p.format] : [])
  ))).sort((a, b) => {
    const order = ["In Person", "In Classroom", "Virtual"];
    return order.indexOf(a) - order.indexOf(b);
  });
  const fees = ["Yes", "No"];
  const cities = getUniqueCities(programs);
  const availability = ["Open", "Closed"];

  return (
    <>
      {/* Background overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed inset-y-0 right-0 w-[85%] max-w-[20rem] bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } z-50 md:w-[85%] md:max-w-[20.5rem]`}
      >
        <div className="h-full flex flex-col">
          <FilterHeader onReset={onReset} onClose={onClose} />

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
              {/* Program Hosts */}
              <FilterSection title="Program Host">
                {program_hosts.map((host) => (
                  <FilterCheckbox
                    key={`host-${host}`}
                    id={`host-${host}`}
                    checked={selectedFilters.programHosts.includes(host)}
                    onCheckedChange={() => onFilterChange("programHosts", host)}
                    label={host}
                  />
                ))}
              </FilterSection>

              {/* Format */}
              <FilterSection title="Format">
                {formats.map((format) => (
                  <FilterCheckbox
                    key={format}
                    id={`format-${format}`}
                    checked={selectedFilters.formats.includes(format)}
                    onCheckedChange={() => onFilterChange("formats", format)}
                    label={format}
                    showFormatIcon={true}
                  />
                ))}
              </FilterSection>

              {/* Fee */}
              <FilterSection title="Fee">
                {fees.map((fee) => (
                  <FilterCheckbox
                    key={`fee-${fee}`}
                    id={`fee-${fee}`}
                    checked={selectedFilters?.fees?.includes(fee.toLowerCase()) ?? false}
                    onCheckedChange={() => onFilterChange("fees", fee.toLowerCase())}
                    label={fee}
                  />
                ))}
              </FilterSection>

              {/* Availability */}
              <FilterSection title="Availability">
                {availability.map((status) => (
                  <FilterCheckbox
                    key={`availability-${status}`}
                    id={`availability-${status}`}
                    checked={selectedFilters?.availability?.includes(status.toLowerCase()) ?? false}
                    onCheckedChange={() => onFilterChange("availability", status.toLowerCase())}
                    label={status}
                  />
                ))}
              </FilterSection>

              {/* Cities */}
              <FilterSection title="City">
                {cities.filter(city => city !== "All").map((city) => (
                  <FilterCheckbox
                    key={`city-${city}`}
                    id={`city-${city}`}
                    checked={selectedFilters.cities.includes(city)}
                    onCheckedChange={() => onFilterChange("cities", city)}
                    label={city}
                  />
                ))}
              </FilterSection>
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
} 