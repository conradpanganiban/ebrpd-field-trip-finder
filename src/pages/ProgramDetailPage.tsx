import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { allPrograms } from '@/data/programs';
import { getHostNameFromJsonFile, isValidJsonFileName } from '@/utils/hostUtils';
import { toSlug, getProgramCanonicalUrl, getProgramIdFromSlug } from '@/utils/urlUtils';
import { ProgramDetails } from '@/components/program-modal/ProgramDetails';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import NotFound from './NotFound';
import { Program } from '@/types/program';

export const ProgramDetailPage: React.FC = () => {
  const { host, city, slug } = useParams<{ host: string; city: string; slug: string }>();
  const navigate = useNavigate();

  if (!host || !isValidJsonFileName(host)) {
    return <NotFound />;
  }

  const hostName = getHostNameFromJsonFile(host);
  const program = allPrograms.find(p => 
    p.program_host === hostName && 
    toSlug(p.city) === city && 
    toSlug(p.program_name) === slug
  );

  if (!program) {
    return <NotFound />;
  }

  // Redirect to canonical URL if the current URL doesn't match
  const canonicalUrl = getProgramCanonicalUrl(program);
  if (window.location.pathname !== canonicalUrl) {
    navigate(canonicalUrl, { replace: true });
    return null;
  }

  // Add metadata for SEO
  useEffect(() => {
    // Update document title
    document.title = program.metadata?.title || `${program.program_name} | ${program.program_host}`;
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', program.metadata?.description || program.description);
    }

    // Add canonical URL
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', `${window.location.origin}${canonicalUrl}`);
    }

    // Add Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', program.metadata?.og_title || program.program_name);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', program.metadata?.og_description || program.description);
    }

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', `${window.location.origin}${canonicalUrl}`);
    }

    // Add Twitter Card tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', program.metadata?.twitter_title || program.program_name);
    }

    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', program.metadata?.twitter_description || program.description);
    }
  }, [program, canonicalUrl]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/programs">Programs</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/programs/${host}`}>{program.program_host}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{program.program_name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mt-8">
        <ProgramDetails program={program} />
      </div>
    </div>
  );
}; 