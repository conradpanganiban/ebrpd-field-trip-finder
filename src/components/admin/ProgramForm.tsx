import { useEffect, useState } from "react";
import { 
  Program, 
  ProgramFormat, 
  ProgramFee, 
  ApplicationStatus, 
  ProgramSeason,
  ProgramStatus,
  LimitedAvailability
} from "@/types/program";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface ProgramFormProps {
  program?: Program;
  visitorCenter: string;
  onSave: (program: Program) => void;
  onCancel: () => void;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
] as const;

const currentYear = new Date().getFullYear();
const APPLICATION_STATUSES: ApplicationStatus[] = [
  { season: "Spring", status: "waitlist" },
  { season: "Spring", status: "open" },
  { season: "Spring", status: "closed" },
  { season: "Summer", status: "waitlist" },
  { season: "Summer", status: "open" },
  { season: "Summer", status: "closed" },
  { season: "Fall", status: "waitlist" },
  { season: "Fall", status: "open" },
  { season: "Fall", status: "closed" }
];

export const ProgramForm = ({ program, visitorCenter, onSave, onCancel }: ProgramFormProps) => {
  const [formData, setFormData] = useState<Partial<Program>>({
    id: "",
    program_name: "",
    description: "",
    grade: "",
    duration: "",
    max_participants: "",
    format: "In Person",
    fee: "no",
    learning_standards: null,
    specific_timing: null,
    city: "",
    application_status: [],
    limited_availability: {
      days: [],
      months: []
    }
  });

  useEffect(() => {
    if (program) {
      setFormData({
        ...program,
        format: program.format || "In Person",
        application_status: program.application_status || [],
        fee: (program.fee || "no") as ProgramFee,
        limited_availability: typeof program.limited_availability === 'string' 
          ? { days: [], months: [] }
          : program.limited_availability || { days: [], months: [] }
      });
    } else {
      // Generate new ID for new programs
      const newId = `${(visitorCenter || '').toLowerCase()}-${Date.now()}`;
      setFormData(prev => ({
        ...prev,
        id: newId,
        format: "In Person",
        application_status: [],
        fee: "no" as ProgramFee,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
    }
  }, [program, visitorCenter]);

  const handleApplicationStatusToggle = (status: ApplicationStatus) => {
    const currentStatuses = formData.application_status || [];
    
    // Remove any existing status for this season
    const filteredStatuses = currentStatuses.filter(s => s.season !== status.season);
    
    // Add the new status if it's not already there
    if (!currentStatuses.some(s => s.season === status.season && s.status === status.status)) {
      filteredStatuses.push(status);
    }

    setFormData(prev => ({
      ...prev,
      application_status: filteredStatuses
    }));
  };

  const isStatusSelected = (status: ApplicationStatus) => {
    const currentStatuses = formData.application_status || [];
    return currentStatuses.some(s => s.season === status.season && s.status === status.status);
  };

  const handleFormatChange = (format: ProgramFormat) => {
    setFormData(prev => ({
      ...prev,
      format
    }));
  };

  const handleDayToggle = (day: string) => {
    const limitedAvailability = formData.limited_availability;
    if (typeof limitedAvailability === 'string') return;

    const days = limitedAvailability?.days || [];
    setFormData(prev => ({
      ...prev,
      limited_availability: {
        days: days.includes(day)
          ? days.filter(d => d !== day)
          : [...days, day],
        months: limitedAvailability?.months || []
      }
    }));
  };

  const handleMonthToggle = (month: string) => {
    const limitedAvailability = formData.limited_availability;
    if (typeof limitedAvailability === 'string') return;

    const months = limitedAvailability?.months || [];
    setFormData(prev => ({
      ...prev,
      limited_availability: {
        days: limitedAvailability?.days || [],
        months: months.includes(month)
          ? months.filter(m => m !== month)
          : [...months, month]
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.program_name) {
      alert("Program name is required");
      return;
    }

    const updatedProgram = {
      ...formData,
      updated_at: new Date().toISOString()
    } as Program;

    onSave(updatedProgram);
  };

  const isDaySelected = (day: string): boolean => {
    const limitedAvailability = formData.limited_availability;
    if (typeof limitedAvailability === 'string') return false;
    return limitedAvailability?.days?.includes(day) || false;
  };

  const isMonthSelected = (month: string): boolean => {
    const limitedAvailability = formData.limited_availability;
    if (typeof limitedAvailability === 'string') return false;
    return limitedAvailability?.months?.includes(month) || false;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{program ? "Edit Program" : "Add New Program"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="program_name">Program Name *</Label>
            <Input
              id="program_name"
              value={formData.program_name}
              onChange={e => setFormData(prev => ({ ...prev, program_name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Format</Label>
            <div className="flex gap-2">
              {(["In Person", "virtual", "hybrid"] as ProgramFormat[]).map((formatOption) => (
                <Button
                  key={formatOption}
                  type="button"
                  variant={formData.format === formatOption ? "default" : "outline"}
                  onClick={() => handleFormatChange(formatOption)}
                >
                  {formatOption}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fee">Fee</Label>
              <Select
                value={formData.fee}
                onValueChange={(value: ProgramFee) => setFormData(prev => ({ ...prev, fee: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select fee option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="varies">Varies</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Application Status</Label>
            <div className="grid grid-cols-3 gap-2">
              {APPLICATION_STATUSES.map((status) => (
                <Button
                  key={`${status.season}-${status.status}`}
                  type="button"
                  variant={isStatusSelected(status) ? "default" : "outline"}
                  onClick={() => handleApplicationStatusToggle(status)}
                >
                  {`${status.season} - ${status.status}`}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Limited Availability</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Days</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {DAYS.map((day) => (
                    <Button
                      key={day}
                      type="button"
                      variant={isDaySelected(day) ? "default" : "outline"}
                      onClick={() => handleDayToggle(day)}
                    >
                      {day}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <Label>Months</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {MONTHS.map((month) => (
                    <Button
                      key={month}
                      type="button"
                      variant={isMonthSelected(month) ? "default" : "outline"}
                      onClick={() => handleMonthToggle(month)}
                    >
                      {month}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {program ? "Update Program" : "Add Program"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
