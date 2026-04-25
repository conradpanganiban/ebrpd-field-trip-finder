import { Program } from "@/types/program";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { Clock, MapPin, Users, ArrowRight, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { getEmojisForProgram, getNotoEmojiClass } from "@/utils/emojiUtils";
import { useState } from "react";
import { ProgramModal } from "./ProgramModal";
import { getProgramHostColor } from "@/styles/colors";
import { getJsonFileFromHostName } from "@/utils/hostUtils";
import { Link } from "react-router-dom";
import { FormatIcon } from "./ui/format-icon";
import { getProgramCanonicalUrl } from "@/utils/urlUtils";
import { getGoogleMapsUrl } from "@/utils/locationUtils";
import { getApplyNowButtonText, shouldDisableApplyNowButton, getApplyNowButtonUrl, isClosedSeasonProgram, getSeasonButtonText, shouldDisableSeasonButton, getSeasonButtonUrl, isSeasonFullyBooked } from "@/utils/programUtils";

interface ProgramCardProps {
  program: Program;
  allPrograms: Program[];
}

export const ProgramCard = ({ program, allPrograms }: ProgramCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentProgram, setCurrentProgram] = useState<Program>(program);
  const borderColor = getProgramHostColor(program.program_host);
  const programEmojis = getEmojisForProgram(program.description, program.emoji);
  const jsonFileName = getJsonFileFromHostName(program.program_host);

  // Find the current program's index in the filtered programs array
  const currentIndex = allPrograms.findIndex(p => p.id === currentProgram.id);

  const handleCardClick = () => {
    setIsOpen(true);
    setCurrentProgram(program);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handlePreviousProgram = () => {
    if (currentIndex > 0) {
      setCurrentProgram(allPrograms[currentIndex - 1]);
    }
  };

  const handleNextProgram = () => {
    if (currentIndex < allPrograms.length - 1) {
      setCurrentProgram(allPrograms[currentIndex + 1]);
    }
  };

  return (
    <>
      <Card 
        className="w-full h-full transition-all duration-300 hover:bg-[rgb(245,247,245)] hover:shadow-lg animate-slide-up flex flex-col cursor-pointer"
        onClick={handleCardClick}
        data-program-id={program.id}
      >
        <div style={{ backgroundColor: borderColor, height: "8px" }} />
        <div className="flex flex-col h-full">
          <CardHeader className="space-y-1 flex-shrink-0">
            {/* Grade badges row */}
            <div className="flex flex-wrap gap-1 mb-2">
              {typeof program.grade === 'string' && program.grade.split(", ").map((grade, index) => (
                <Badge key={index} variant="secondary">
                  {grade}
                </Badge>
              ))}
            </div>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl">{program.program_name}</CardTitle>
                <CardDescription>{program.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-shrink-0">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <MapPin className="w-4 h-4 mr-2" />
                {program.format === "In Person" && 
                 program.program_host !== "Mobile Education" ? (
                  <a
                    href={getGoogleMapsUrl(program.program_host, program.city)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="hover:underline text-left"
                  >
                    <span>{program.program_host} {program.city && `- ${program.city}`}</span>
                  </a>
                ) : (
                  <span>{program.program_host} {program.city && `- ${program.city}`}</span>
                )}
              </div>
              <div className="flex items-center text-sm">
                <Clock className="w-4 h-4 mr-2" />
                <span>{program.duration}</span>
              </div>
              <div className="flex items-center text-sm">
                <FormatIcon format={program.format} className="w-4 h-4 mr-2" />
                <span>{program.format}</span>
              </div>
              <p className="text-sm font-medium mt-2 text-primary">
                {program.id === "bigbreak-7" 
                  ? "Please call 510-544-2553 for program details and pricing."
                  : program.fee === "yes" 
                    ? "Program fee applies" 
                    : "No fee"
                }
              </p>
            </div>
          </CardContent>
          <div className="flex-grow"></div>
          <CardFooter className="flex-shrink-0">
            <div className="w-full space-y-2">
              {/* Button and emojis row */}
              <div className="flex items-center w-full">
                {/* Emoji tags */}
                {programEmojis.length > 0 && program.visitor_center !== "Black Diamond" && (
                  <div className="flex gap-1 text-base overflow-hidden whitespace-nowrap">
                    {(() => {
                      // Show only first 4 emojis for all programs to prevent overlap with buttons
                      return programEmojis.slice(0, 4).map((emoji, index) => (
                        <span 
                          key={index} 
                          title="Program tag" 
                          role="img" 
                          aria-label="Program tag"
                          className="noto-emoji"
                        >
                          {emoji}
                        </span>
                      ));
                    })()}
                  </div>
                )}
                <div className="flex flex-col space-y-2 ml-auto max-w-[200px]">
                  {/* Spring Button */}
                  <Button 
                    asChild 
                    size="sm" 
                    onClick={(e) => e.stopPropagation()}
                    disabled={shouldDisableSeasonButton(program, "Spring")}
                    className={`text-sm px-4 py-2 h-8 ${shouldDisableSeasonButton(program, "Spring") ? "opacity-50 cursor-not-allowed text-black" : ""}`}
                    style={!shouldDisableSeasonButton(program, "Spring") ? { backgroundColor: 'rgb(80 111 51)', color: 'white', borderColor: 'rgb(80 111 51)' } : {}}
                  >
                    <a 
                      href={getSeasonButtonUrl(program, "Spring")}
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={shouldDisableSeasonButton(program, "Spring") ? (e) => e.preventDefault() : undefined}
                    >
                      {getSeasonButtonText(program, "Spring")}
                      {!shouldDisableSeasonButton(program, "Spring") && <ArrowRight className="ml-2 h-4 w-4" />}
                    </a>
                  </Button>
                  
                  {/* Summer Button */}
                  <Button 
                    asChild 
                    size="sm" 
                    onClick={(e) => e.stopPropagation()}
                    disabled={shouldDisableSeasonButton(program, "Summer")}
                    className={`text-sm px-4 py-2 h-8 ${shouldDisableSeasonButton(program, "Summer") ? "opacity-50 cursor-not-allowed text-black" : ""}`}
                    style={!shouldDisableSeasonButton(program, "Summer") ? { backgroundColor: 'rgb(80 111 51)', color: 'white', borderColor: 'rgb(80 111 51)' } : {}}
                  >
                    <a 
                      href={getSeasonButtonUrl(program, "Summer")}
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={shouldDisableSeasonButton(program, "Summer") ? (e) => e.preventDefault() : undefined}
                    >
                      {getSeasonButtonText(program, "Summer")}
                      {!shouldDisableSeasonButton(program, "Summer") && <ArrowRight className="ml-2 h-4 w-4" />}
                    </a>
                  </Button>

                </div>
              </div>
            </div>
          </CardFooter>
        </div>
      </Card>

      {/* Ensure the modal opens properly for all programs */}
      {isOpen && currentProgram && (
        <ProgramModal
          program={currentProgram}
          isOpen={isOpen}
          onClose={handleCloseModal}
          onPrevious={handlePreviousProgram}
          onNext={handleNextProgram}
          hasPrevious={currentIndex > 0}
          hasNext={currentIndex < allPrograms.length - 1}
        />
      )}
    </>
  );
};
