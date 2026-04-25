import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { FormatIcon } from "@/components/ui/format-icon";

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
}

export const FilterSection = ({ title, children }: FilterSectionProps) => (
  <div>
    <h3 className="font-medium mb-3">{title}</h3>
    <div className="space-y-2">
      {children}
    </div>
  </div>
);

interface FilterCheckboxProps {
  id: string;
  checked: boolean;
  onCheckedChange: () => void;
  label: string;
  showFormatIcon?: boolean;
}

export const FilterCheckbox = ({ id, checked, onCheckedChange, label, showFormatIcon }: FilterCheckboxProps) => (
  <div className="flex items-start space-x-2">
    <Checkbox
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      className="mt-0.5"
    />
    <label
      htmlFor={id}
      className="text-sm leading-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
    >
      {showFormatIcon && <FormatIcon format={label} className="h-4 w-4" />}
      {label}
    </label>
  </div>
);

interface FilterHeaderProps {
  onReset: () => void;
  onClose: () => void;
}

export const FilterHeader = ({ onReset, onClose }: FilterHeaderProps) => (
  <div className="p-4 border-b flex justify-between items-center">
    <h2 className="text-lg font-semibold">Filters</h2>
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={onReset}>
        Reset
      </Button>
      <Button variant="ghost" size="sm" onClick={onClose}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  </div>
); 