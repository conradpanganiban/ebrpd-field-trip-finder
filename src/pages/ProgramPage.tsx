import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { allPrograms } from '@/data/programs';
import { ProgramList } from '@/components/ProgramList';
import { useViewMode } from '@/hooks/useViewMode';
import { getHostNameFromJsonFile, isValidJsonFileName } from '@/utils/hostUtils';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import NotFound from './NotFound';

export const ProgramPage: React.FC = () => {
  const { host } = useParams<{ host: string }>();
  const navigate = useNavigate();
  const { viewMode } = useViewMode();

  // Validate host parameter and get host name
  if (!host || !isValidJsonFileName(host)) {
    return <NotFound />;
  }

  const hostName = getHostNameFromJsonFile(host);
  if (!hostName) {
    return <NotFound />;
  }

  // Filter programs by host
  const filteredPrograms = allPrograms.filter(program => program.program_host === hostName);

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to All Programs
        </Button>
        <h1 className="text-3xl font-bold">{hostName} Programs</h1>
      </div>
      
      <ProgramList programs={filteredPrograms} allPrograms={allPrograms} />
    </div>
  );
}; 