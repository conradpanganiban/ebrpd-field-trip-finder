import React from 'react';

// Define types for application periods data structure
export interface ApplicationPeriod {
  dateRange: string;     // e.g., "Aug. 11 to Dec. 31"
  isAvailable: boolean;  // Whether applications are being accepted
  isWaitlist?: boolean;  // Optional: Whether it's waitlist only
}

// Define props for the component
interface ApplicationPeriodsProps {
  periods: ApplicationPeriod[];
  compact?: boolean;     // Optional: For more compact display on mobile
  className?: string;    // Optional: Allow additional styling
}

// Icons mapping for different states
const STATUS_ICONS = {
  available: "🟢",
  unavailable: "✖️",
  waitlist: "⏳"
};

export const ApplicationPeriods: React.FC<ApplicationPeriodsProps> = ({
  periods,
  compact = false,
  className = ""
}) => {
  // Helper function to get appropriate icon based on period status
  const getStatusIcon = (period: ApplicationPeriod): string => {
    if (period.isAvailable) {
      return period.isWaitlist ? STATUS_ICONS.waitlist : STATUS_ICONS.available;
    }
    return STATUS_ICONS.unavailable;
  };

  // Determine text color based on status
  const getTextColorClass = (period: ApplicationPeriod): string => {
    if (period.isAvailable) {
      return period.isWaitlist ? "text-yellow-600" : "text-green-600";
    }
    return "text-red-600";
  };

  return (
    <div className={`space-y-${compact ? '0.5' : '1'} ${className}`}>
      {periods.map((period, index) => (
        <div key={index} className="flex items-center gap-2">
          <span className={`text-sm ${getTextColorClass(period)}`}>
            {getStatusIcon(period)}
          </span>
          <span className="text-sm">
            {period.dateRange}
            {period.isWaitlist && period.isAvailable && (
              <span className="ml-1 text-xs italic text-yellow-600">(waitlist only)</span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ApplicationPeriods;