import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllJsonFileNames, getHostNameFromJsonFile, isValidJsonFileName } from "@/utils/hostUtils";
import { allPrograms } from "@/data/programs";
import { ProgramList } from "@/components/ProgramList";

interface HostPageProps {
  params: {
    host: string;
  };
}

export async function generateMetadata({ params }: HostPageProps): Promise<Metadata> {
  const { host } = params;
  
  if (!isValidJsonFileName(host)) {
    return {
      title: "Program Not Found",
    };
  }
  
  const hostName = getHostNameFromJsonFile(host);
  const filteredPrograms = allPrograms.filter((program) => program.program_host === hostName);
  
  const programCount = filteredPrograms.length;
  const gradeLevels = [...new Set(filteredPrograms.flatMap(p => p.grade.split(', ')))].join(', ');
  
  return {
    title: `${hostName} Programs | East Bay Regional Park District`,
    description: `Explore ${programCount} educational programs offered by ${hostName} at East Bay Regional Park District. Programs available for grades ${gradeLevels}.`,
    openGraph: {
      title: `${hostName} Programs | East Bay Regional Park District`,
      description: `Explore ${programCount} educational programs offered by ${hostName} at East Bay Regional Park District. Programs available for grades ${gradeLevels}.`,
      url: `https://ebparks-field-trips.netlify.app/programs/${host}`,
      siteName: 'East Bay Regional Park District Field Trips',
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${hostName} Programs | East Bay Regional Park District`,
      description: `Explore ${programCount} educational programs offered by ${hostName} at East Bay Regional Park District. Programs available for grades ${gradeLevels}.`,
    },
    alternates: {
      canonical: `https://ebparks-field-trips.netlify.app/programs/${host}`,
    },
  };
}

export async function generateStaticParams() {
  const hosts = getAllJsonFileNames();
  
  return hosts.map((host) => ({
    host,
  }));
}

export default function HostPage({ params }: HostPageProps) {
  const { host } = params;
  
  if (!isValidJsonFileName(host)) {
    notFound();
  }
  
  const hostName = getHostNameFromJsonFile(host);
  
  // Filter programs by host
  const filteredPrograms = allPrograms.filter((program) => program.program_host === hostName);
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">{hostName} Programs</h1>
      <ProgramList programs={filteredPrograms} allPrograms={allPrograms} />
    </div>
  );
} 