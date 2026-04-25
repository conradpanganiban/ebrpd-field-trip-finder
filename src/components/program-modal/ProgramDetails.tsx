import React from "react";
import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Program, ApplicationStatus, LimitedAvailability } from "@/types/program";
import { Circle, Calendar, ArrowRight } from "lucide-react";
import { getStatusColor } from "@/utils/statusUtils";
import { getApplicationStatus, getSeasonDateRange } from "@/utils/applicationStatusUtils";
import { seasonDateRanges } from "@/utils/seasonDateRanges";
import { statusColors } from "@/styles/colors";
import { getHostDefaultStatuses, shouldUseCustomStatuses } from "@/utils/hostStatusUtils";
import { getSeasonButtonText, shouldDisableSeasonButton, getSeasonButtonUrl, isSpecificCoyoteHillsProgram } from "@/utils/programUtils";

interface ProgramDetailsProps {
  program: Program;
  // Add the new props
  activeTab?: string | null;
  compact?: boolean;
}

// Map program host names to hostStatusConfig keys
const hostNameMap: Record<string, string> = {
  "Ardenwood Historic Farm": "Ardenwood",
  "Big Break Visitor Center": "BigBreak",
  "Black Diamond Mines Visitor Center": "BlackDiamond",
  "Coyote Hills Visitor Center": "CoyoteHills",
  "Doug Siden Crab Cove Visitor Center": "CrabCove",
  "Del Valle Visitor Center": "DelValle",
  "Mobile Education": "MobileEducation",
  "Sunol Visitor Center": "Sunol",
  "Tilden Environmental Education Center": "TildenNatureArea"
};

const getHostName = (program: Program) => {
  const hostName = program.program_host;
  const configKey = hostNameMap[hostName] || hostName;
  return configKey;
};

export const ProgramDetails = ({ program }: ProgramDetailsProps) => {
  // Convert format to array if it's a string
  const formats = Array.isArray(program.format) 
    ? program.format 
    : [program.format];

  // Get the host name
  const hostName = program.program_host;
  
  // Map the host name to the hostStatusConfig key
  const configKey = getHostName(program);
  
  // Get the default statuses for the host
  const defaultStatuses = getHostDefaultStatuses(configKey);
  
  // Check if the program has custom statuses that should override the defaults
  const useCustomStatuses = shouldUseCustomStatuses(program, configKey);
  
  // Derive the application statuses used for display and CTA logic
  let applicationStatuses: ApplicationStatus[];

  // For the two specific Coyote Hills Ohlone programs, mirror the Ardenwood pattern:
  // Spring is marked as FULLY BOOKED (closed) and Summer remains open.
  if (isSpecificCoyoteHillsProgram(program)) {
    applicationStatuses = [
      {
        id: program.id,
        season: "FULLY BOOKED Spring 2026",
        status: "closed",
        isOverride: true,
      },
      {
        id: program.id,
        season: "Summer 2026",
        status: "open",
        isOverride: true,
      },
    ];
  } else {
    // Use custom statuses if available and should be used, otherwise use defaults
    applicationStatuses = useCustomStatuses && program.application_status && program.application_status.length > 0
      ? program.application_status
      : defaultStatuses;
  }
  
  // Debug log to check the values
  // console.log('Program:', program.program_name);
  // console.log('Host:', hostName, 'Config Key:', configKey);
  // console.log('Use Custom Statuses:', useCustomStatuses);
  // console.log('Application Statuses:', applicationStatuses);

  return (
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-sm text-gray-900 mb-1">Description</h3>
            <p className="text-sm">{program.description}</p>
          </div>
          
          {program.limited_availability && (
            <div>
              <h3 className="font-medium text-sm text-gray-900 mb-1">Limited Availability</h3>
              {typeof program.limited_availability === 'string' ? (
                <p className="text-sm">{program.limited_availability}</p>
              ) : (
                <>
                  {(program.limited_availability as { days?: string[] }).days?.length > 0 && (
                    <p className="text-sm">Not available on: {(program.limited_availability as { days: string[] }).days.join(", ")}</p>
                  )}
                  {(program.limited_availability as { months?: string[] }).months?.length > 0 && (
                    <p className="text-sm">Not available during: {(program.limited_availability as { months: string[] }).months.join(", ")}</p>
                  )}
                </>
              )}
            </div>
          )}
          
          <div>
            <h3 className="font-medium text-sm text-gray-900 mb-1">Fee</h3>
            <p className="text-sm">
              {program.id === "bigbreak-7" 
                ? "Please call 510-544-2553 for program details and pricing."
                : program.fee === "no" 
                  ? "Free to public schools in Alameda and Contra Costa Counties, 501(c)(3) non-profits, and government agencies. $61/hour per Naturalist for private schools, non-district schools, and for-profit organizations."
                  : program.fee === "yes"
                    ? (
                      <>
                        {program.id === "blackdiamond-10" ? "$3 per participant" : "$3-$7 per person"}{" "}
                        <a 
                          href="https://www.ebparks.org/sites/default/files/2026-fee-schedule.pdf?v=2" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-[rgb(80,111,51)] underline"
                        >
                          View the current fee schedule
                        </a>
                        <br />
                        There is an additional $61/hour per Naturalist for private schools, non-district schools, and for-profit organizations.
                      </>
                    )
                    : "Free to public schools in Alameda and Contra Costa Counties, 501(c)(3) non-profits, and government agencies. $61/hour per Naturalist for private schools, non-district schools, and for-profit organizations."
              }
            </p>
          </div>
          
          {/* Learning Standards Section - Moved to left column */}
          {program.learning_standards && (
            <div>
              <h3 className="font-medium text-sm text-gray-900 mb-1">Learning Standards</h3>
              <p className="text-sm">{program.learning_standards}</p>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-sm text-gray-900 mb-1">Grade Levels</h3>
            <Badge variant="secondary">{program.grade}</Badge>
          </div>
          
          <div>
            <h3 className="font-medium text-sm text-gray-900 mb-1">Duration</h3>
            <p className="text-sm">{program.duration}</p>
          </div>
          
          {/* Max Participants Section - Grouped together */}
          {(program.class_size || program.class_max || program.max_students) && (
            <div className="border rounded-md p-3 bg-gray-50">
              <h3 className="font-medium text-sm text-gray-900 mb-2">MAX PARTICIPANTS</h3>
              <p className="text-sm mb-3">{program.max_participants}</p>
              
              {/* Class size and number of classes in one row */}
              {(program.class_size || program.class_max) && (
                <div className="grid grid-cols-2 gap-4 mb-3">
                  {program.class_size && (
                    <div>
                      <h3 className="font-medium text-sm text-gray-900 mb-1">Class Size</h3>
                      <p className="text-sm">
                        {typeof program.class_size === 'number' 
                          ? `${program.class_size} students` 
                          : program.class_size}
                      </p>
                    </div>
                  )}
                  {program.class_max && (
                    <div>
                      <h3 className="font-medium text-sm text-gray-900 mb-1">Number of Classes</h3>
                      <p className="text-sm">
                        {typeof program.class_max === 'number' 
                          ? `Up to ${program.class_max} per day` 
                          : `${program.class_max}`}
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Max students and max chaperones in one row */}
              {(program.max_students || program.max_chaperones) && (
                <div className="grid grid-cols-2 gap-4">
                  {program.max_students && (
                    <div>
                      <h3 className="font-medium text-sm text-gray-900 mb-1">Students allowed</h3>
                      <p className="text-sm">
                        {typeof program.max_students === 'string' 
                          ? program.max_students 
                          : `${program.max_students} max`}
                      </p>
                    </div>
                  )}
                  {program.max_chaperones ? (
                    <div>
                      <h3 className="font-medium text-sm text-gray-900 mb-1"># Chaperones</h3>
                      <p className="text-sm">{program.max_chaperones}</p>
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-medium text-sm text-gray-900 mb-1"># Chaperones</h3>
                      <p className="text-sm">Specific numbers not required or limited (to be confirmed during scheduling)</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Accepting Applications Section - Moved to right column */}
          <div>
            <h3 className="font-medium text-sm text-gray-900 mb-1">Currently Scheduling</h3>
            <div className="space-y-3">
              {applicationStatuses.map((status, index) => {
                // Skip rendering if status is not open, closed, or waitlist
                if (status.status !== "open" && status.status !== "closed" && status.status !== "waitlist") return null;
                
                const colorObj = statusColors[status.status as keyof typeof statusColors] || statusColors.closed;
                const dateRange = getSeasonDateRange(status.season);
                const formattedDateRange = `${dateRange.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${dateRange.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
                
                // Determine which season this is for the button
                const seasonName = status.season.includes('Fall') ? 'Fall' : status.season.includes('Spring') ? 'Spring' : status.season.includes('Summer') ? 'Summer' : null;
                
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Circle
                        className="h-3 w-3"
                        style={{
                          fill: colorObj.fill,
                          color: colorObj.text
                        }}
                      />
                      <span className="text-sm">{status.season}</span>
                      <span className="text-sm text-gray-500">
                        ({formattedDateRange})
                      </span>
                    </div>
                    
                    {/* Season-specific Apply Now button - only show for open seasons */}
                    {seasonName && !shouldDisableSeasonButton(program, seasonName) && (
                      <Button 
                        asChild 
                        size="sm" 
                        className="text-xs px-2 py-1 h-6"
                        style={{ backgroundColor: 'rgb(80 111 51)', color: 'white', borderColor: 'rgb(80 111 51)' }}
                      >
                        <a 
                          href={getSeasonButtonUrl(program, seasonName)}
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          Apply for {seasonName}
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </a>
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          {program.specific_timing && (
            <div>
              <h3 className="font-medium text-sm text-gray-900 mb-1">Specific Timing</h3>
              <p className="text-sm">{program.specific_timing}</p>
            </div>
          )}
        </div>
      </div>
    </CardContent>
  );
};
