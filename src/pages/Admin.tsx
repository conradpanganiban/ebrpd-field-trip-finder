import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Program } from "@/types/program";
import { ProgramTable } from "@/components/admin/ProgramTable";
import { ProgramForm } from "@/components/admin/ProgramForm";
import { FileSelector } from "@/components/admin/FileSelector";
import { ActionBar } from "@/components/admin/ActionBar";
import { useToast } from "@/hooks/use-toast";
import { ProgramModal } from "@/components/ProgramModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Get the API base URL from environment variable, fallback to relative path for development
const API_BASE_URL = import.meta.env.PROD ? 'https://ebparks-field-trips.netlify.app' : '';

const Admin = () => {
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowingForm, setIsShowingForm] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [modifiedFiles, setModifiedFiles] = useState<Set<string>>(() => {
    // Initialize from localStorage
    const saved = localStorage.getItem('modifiedFiles');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewProgramIndex, setPreviewProgramIndex] = useState<number>(0);
  const [modifiedPrograms, setModifiedPrograms] = useState<Set<string>>(() => {
    // Initialize from localStorage
    const saved = localStorage.getItem('modifiedPrograms');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const isPublisher = localStorage.getItem("accessLevel") === "publisher";

  useEffect(() => {
    const hasAccess = localStorage.getItem("adminAccess") === "true";
    if (!hasAccess) {
      navigate("/admin");
      return;
    }
  }, [navigate]);

  // Update localStorage when modified states change
  useEffect(() => {
    localStorage.setItem('modifiedFiles', JSON.stringify([...modifiedFiles]));
  }, [modifiedFiles]);

  useEffect(() => {
    localStorage.setItem('modifiedPrograms', JSON.stringify([...modifiedPrograms]));
  }, [modifiedPrograms]);

  const handleFileSelect = async (filename: string) => {
    setIsLoading(true);
    setSelectedFile(filename);
  
    try {
      const response = await fetch(`/programs/${filename}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch program data: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setPrograms(Array.isArray(data) ? data : []);
      toast({
        title: "File loaded",
        description: `${filename} loaded successfully.`,
      });
    } catch (error) {
      console.error("Error loading file:", error);
      toast({
        title: "Error",
        description: `Failed to load ${filename}.`,
        variant: "destructive",
      });
      setPrograms([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProgram = () => {
    setSelectedProgram(null);
    setIsShowingForm(true);
  };

  const handleEditProgram = (program: Program) => {
    setSelectedProgram(program);
    setIsShowingForm(true);
  };

  const handleSaveProgram = (program: Program) => {
    if (selectedProgram) {
      setPrograms(programs.map((p) => (p.id === program.id ? program : p)));
      toast({
        title: "Program updated",
        description: "The program has been updated in the table.",
      });
    } else {
      setPrograms([...programs, program]);
      toast({
        title: "Program added",
        description: "The program has been added to the table.",
      });
    }
    setIsShowingForm(false);
    
    // Mark both file and program as modified
    if (selectedFile) {
      setModifiedFiles(prev => new Set(prev).add(selectedFile));
      setModifiedPrograms(prev => new Set(prev).add(program.id));
    }
  };

  const handleDeleteProgram = (id: string) => {
    setPrograms(programs.filter((p) => p.id !== id));
    // Mark file as modified when a program is deleted
    if (selectedFile) {
      setModifiedFiles(prev => new Set(prev).add(selectedFile));
    }
    toast({
      title: "Program deleted",
      description: "The program has been removed from the table.",
    });
  };

  const handlePreviewProgram = (index: number) => {
    if (!selectedFile || programs.length === 0) {
      toast({
        title: "No data to preview",
        description: "Please select a file with programs first.",
        variant: "destructive",
      });
      return;
    }

    setPreviewProgramIndex(index);
    setIsPreviewModalOpen(true);
  };

  const handlePreviousPreview = () => {
    if (previewProgramIndex > 0) {
      setPreviewProgramIndex(prev => prev - 1);
    }
  };

  const handleNextPreview = () => {
    if (previewProgramIndex < programs.length - 1) {
      setPreviewProgramIndex(prev => prev + 1);
    }
  };

  const handleSaveToOriginal = () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file first.",
        variant: "destructive",
      });
      return;
    }
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmSave = async () => {
    setIsConfirmDialogOpen(false);
    const accessLevel = localStorage.getItem("accessLevel");
    
    if (accessLevel === "publisher") {
      try {
        // For production (Netlify), we'll download the file instead of trying to save directly
        if (import.meta.env.PROD) {
          const jsonData = JSON.stringify(programs, null, 2);
          const blob = new Blob([jsonData], { type: "application/json" });
          const url = URL.createObjectURL(blob);

          const link = document.createElement("a");
          link.href = url;
          link.download = selectedFile;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          // Only clear modified states if the user is a publisher (Webadmin)
          const password = localStorage.getItem("adminPassword");
          if (password?.startsWith("Webadmin")) {
            setModifiedFiles(prev => {
              const newSet = new Set(prev);
              newSet.delete(selectedFile);
              return newSet;
            });
            setModifiedPrograms(prev => {
              const newSet = new Set(prev);
              programs.forEach(program => {
                newSet.delete(program.id);
              });
              return newSet;
            });
          }

          toast({
            title: "Success",
            description: `${selectedFile} has been downloaded. Please commit this file to the repository.`,
          });
          return;
        }

        // For development, try to save directly
        const response = await fetch(`${API_BASE_URL}/api/admin/programs/${selectedFile}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Access-Level': 'publisher'
          },
          body: JSON.stringify(programs, null, 2)
        });

        if (!response.ok) throw new Error('Failed to save programs');

        // Only clear modified states if the user is a publisher (Webadmin)
        const password = localStorage.getItem("adminPassword");
        if (password?.startsWith("Webadmin")) {
          setModifiedFiles(prev => {
            const newSet = new Set(prev);
            newSet.delete(selectedFile);
            return newSet;
          });
          setModifiedPrograms(prev => {
            const newSet = new Set(prev);
            programs.forEach(program => {
              newSet.delete(program.id);
            });
            return newSet;
          });
        }

        toast({
          title: "Success",
          description: `${selectedFile} has been saved to the server.`,
        });
      } catch (error) {
        console.error('Error saving file:', error);
        toast({
          title: "Error",
          description: "Failed to save the file to the server.",
          variant: "destructive",
        });
      }
    } else {
      // Download file for editors (modified state persists)
      const jsonData = JSON.stringify(programs, null, 2);
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = selectedFile;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: `${selectedFile} has been downloaded for replacement.`,
      });
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Program Management</h1>
        <Button
          variant="outline"
          onClick={() => {
            localStorage.removeItem("adminAccess");
            localStorage.removeItem("accessLevel");
            navigate("/admin");
          }}
        >
          Logout
        </Button>
      </div>

      <div className="space-y-6">
        <FileSelector
          files={[]}
          selectedFile={selectedFile}
          onSelectFile={handleFileSelect}
          isLoading={isLoading}
          modifiedFiles={modifiedFiles}
        />

        <ActionBar
          onAddProgram={handleAddProgram}
          onSaveToOriginal={handleSaveToOriginal}
          disabled={!selectedFile || isLoading}
          isPublisher={isPublisher}
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className={`${isShowingForm ? "lg:col-span-3" : "lg:col-span-5"}`}>
            <ProgramTable
              programs={programs}
              onEditProgram={handleEditProgram}
              onDeleteProgram={handleDeleteProgram}
              onPreviewProgram={handlePreviewProgram}
              isLoading={isLoading}
              modifiedPrograms={modifiedPrograms}
            />
          </div>

          {isShowingForm && (
            <div className="lg:col-span-2">
              <ProgramForm
                program={selectedProgram}
                visitorCenter={selectedFile.replace(".json", "")}
                onSave={handleSaveProgram}
                onCancel={() => setIsShowingForm(false)}
              />
            </div>
          )}
        </div>
      </div>

      {isPreviewModalOpen && (
        <ProgramModal
          program={programs[previewProgramIndex]}
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          onPrevious={handlePreviousPreview}
          onNext={handleNextPreview}
          hasPrevious={previewProgramIndex > 0}
          hasNext={previewProgramIndex < programs.length - 1}
          isAdmin={true}
        />
      )}

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Save</DialogTitle>
            <DialogDescription>
              Are you sure you want to save these changes to the original file? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmSave}>
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;