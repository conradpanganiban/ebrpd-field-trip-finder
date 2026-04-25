import { Button } from "@/components/ui/button";
import { Plus, Save } from "lucide-react";

interface ActionBarProps {
  onAddProgram: () => void;
  onSaveToOriginal: () => void;
  disabled: boolean;
  isPublisher?: boolean;
}

export const ActionBar = ({
  onAddProgram,
  onSaveToOriginal,
  disabled,
  isPublisher = false,
}: ActionBarProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <Button
          onClick={onAddProgram}
          disabled={disabled}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add New Program
        </Button>
      </div>
      <div className="flex gap-2">
        {isPublisher && (
          <Button
            variant="default"
            onClick={onSaveToOriginal}
            disabled={disabled}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save to Original
          </Button>
        )}
      </div>
    </div>
  );
};
