import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { allPrograms } from "@/data/programs";
import { isValidJsonFileName, getHostNameFromJsonFile } from "@/utils/hostUtils";
import { ProgramDetails } from "@/components/program-modal/ProgramDetails";
import { getApplyNowButtonText, shouldDisableApplyNowButton, getApplyNowButtonUrl } from "@/utils/programUtils";

interface ProgramPageProps {
  params: {
    host: string;
    programId: string;
  };
}

export async function generateMetadata({ params }: ProgramPageProps): Promise<Metadata> {
  const { host, programId } = params;
  
  if (!isValidJsonFileName(host)) {
    return {
      title: "Program Not Found",
    };
  }
  
  const program = allPrograms.find(p => p.id === programId);
  
  if (!program) {
    return {
      title: "Program Not Found",
    };
  }
  
  const hostName = getHostNameFromJsonFile(host);
  
  // Use program metadata if available, otherwise generate default metadata
  const metadata = program.metadata || {
    title: `${program.program_name} | ${hostName} | East Bay Regional Park District`,
    description: program.description,
    keywords: program.grade.split(', '),
    og_title: `${program.program_name} | ${hostName}`,
    og_description: program.description.substring(0, 200) + (program.description.length > 200 ? '...' : ''),
    twitter_title: `${program.program_name} | ${hostName}`,
    twitter_description: program.description.substring(0, 200) + (program.description.length > 200 ? '...' : '')
  };
  
  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    openGraph: {
      title: metadata.og_title,
      description: metadata.og_description,
      url: `https://ebparks-field-trips.netlify.app/programs/${host}/${programId}`,
      siteName: 'East Bay Regional Park District Field Trips',
      locale: 'en_US',
      type: 'article',
      publishedTime: program.created_at,
      modifiedTime: program.updated_at,
      authors: [hostName],
      tags: program.grade.split(', '),
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.twitter_title,
      description: metadata.twitter_description,
    },
    alternates: {
      canonical: `https://ebparks-field-trips.netlify.app/programs/${host}/${programId}`,
    },
  };
}

export async function generateStaticParams() {
  const programs = allPrograms;
  
  return programs.map((program) => ({
    host: getHostNameFromJsonFile(program.program_host),
    programId: program.id,
  }));
}

export default function ProgramPage({ params }: ProgramPageProps) {
  const { host, programId } = params;
  
  if (!isValidJsonFileName(host)) {
    notFound();
  }
  
  const program = allPrograms.find(p => p.id === programId);
  
  if (!program) {
    notFound();
  }
  
  const hostName = getHostNameFromJsonFile(host);
  
  return (
    <div className="container mx-auto py-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/programs/${host}`}>{hostName}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{program.program_name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="max-w-3xl mx-auto mt-8">
        <h1 className="text-3xl font-bold mb-6">{program.program_name}</h1>
        
        <div className="mb-6">
          <Button 
            asChild 
            className={`w-full ${shouldDisableApplyNowButton(program) ? "opacity-50 cursor-not-allowed" : ""}`}
            style={{ backgroundColor: 'rgb(80 111 51)', color: 'white', borderColor: 'rgb(80 111 51)' }}
            disabled={shouldDisableApplyNowButton(program)}
          >
            <a 
              href={getApplyNowButtonUrl(program)}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center hover:no-underline"
              onClick={shouldDisableApplyNowButton(program) ? (e) => e.preventDefault() : undefined}
            >
              {getApplyNowButtonText(program)}
              {!shouldDisableApplyNowButton(program) && <ArrowRight className="ml-2 h-4 w-4" />}
            </a>
          </Button>
        </div>
        
        <ProgramDetails program={program} />
      </div>
    </div>
  );
} 