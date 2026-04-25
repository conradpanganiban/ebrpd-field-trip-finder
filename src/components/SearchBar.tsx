import { Search } from "lucide-react";
import { Input } from "./ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
  className?: string;
}

export const SearchBar = ({ onSearch, className = "" }: SearchBarProps) => {
  return (
    <div className={`relative w-full ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        className="pl-10 pr-4 h-10 md:h-12 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
        placeholder="Search by visitor center, format, description, learning standards..."
        onChange={(e) => onSearch(e.target.value)}
        aria-label="Search programs"
      />
    </div>
  );
};
