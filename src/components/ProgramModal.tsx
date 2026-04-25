// ProgramModal.tsx
import React, { useState } from "react";
import { Program } from "@/types/program";
import { Card } from "@/components/ui/card"; // ✅ Fix: Ensure Card is imported
import { getEmojisForProgram, getNotoEmojiClass } from "@/utils/emojiUtils";
import { ProgramHeader } from "./program-modal/ProgramHeader";
import { ProgramDetails } from "./program-modal/ProgramDetails";
import { ProgramFooter } from "./program-modal/ProgramFooter";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { getSeasonButtonText, shouldDisableSeasonButton, getSeasonButtonUrl } from "@/utils/programUtils";

interface ProgramModalProps {
  program: Program | null;
  isOpen: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  isAdmin?: boolean;
}

export const ProgramModal = ({
  program,
  isOpen,
  onClose,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  isAdmin = false,
}: ProgramModalProps) => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("details");

  // If not open, don't render anything
  if (!isOpen) {
    return null;
  }

  // If no program data, don't render anything
  if (!program) {
    return null;
  }

  const programEmojis = getEmojisForProgram(program.description, program.emoji) || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />

      <Card className={`relative z-10 w-full ${isMobile ? 'max-h-[95vh]' : 'max-w-3xl max-h-[85vh]'} overflow-y-auto flex flex-col`}>
        <ProgramHeader 
          programName={program.program_name} 
          location={program.program_host} 
          city={program.city} 
          onClose={onClose} 
          program={program}
        />
        

        <div className="flex-1 overflow-y-auto px-2 py-1">
          <ProgramDetails program={program} />
        </div>

        {/* Emoji tags */}
        {programEmojis.length > 0 && program.visitor_center !== "Black Diamond" && (
          <div className="px-6 pb-2 flex flex-wrap gap-2 text-xl">
            {programEmojis.map((emoji, index) => (
              <span 
                key={index} 
                title="Program tag" 
                role="img" 
                aria-label="Program tag"
                className="noto-emoji"
              >
                {emoji}
              </span>
            ))}
          </div>
        )}

        <ProgramFooter 
          onPrevious={onPrevious} 
          onNext={onNext} 
          hasPrevious={hasPrevious} 
          hasNext={hasNext}
        />
      </Card>
    </div>
  );
};

export default ProgramModal;
