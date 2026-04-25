import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FileSelectorProps {
  files: string[];
  selectedFile: string;
  onSelectFile: (file: string) => void;
  isLoading: boolean;
  modifiedFiles: Set<string>;
}

export const FileSelector = ({
  files,
  selectedFile,
  onSelectFile,
  isLoading,
  modifiedFiles,
}: FileSelectorProps) => {
  const [availableFiles, setAvailableFiles] = useState<string[]>([]);

  useEffect(() => {
    // Update path to use public/programs directory
    const programFiles = [
      "Ardenwood.json",
      "BigBreak.json",
      "BlackDiamond.json",
      "CoyoteHills.json",
      "CrabCove.json",
      "DelValle.json",
      "MobileEducation.json",
      "Sunol.json",
      "TildenNatureArea.json",
    ];
    setAvailableFiles(programFiles);
  }, []);

  const formatDisplayName = (filename: string) => {
    return filename.replace('.json', '');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Visitor Center</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Select
            value={selectedFile}
            onValueChange={onSelectFile}
            disabled={isLoading}
          >
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select a visitor center">
                {selectedFile ? formatDisplayName(selectedFile) : "Select a visitor center"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {availableFiles.map((file) => (
                <SelectItem key={file} value={file} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {formatDisplayName(file)}
                    {modifiedFiles.has(file) && (
                      <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800">
                        Modified
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedFile && modifiedFiles.has(selectedFile) && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              Modified
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
