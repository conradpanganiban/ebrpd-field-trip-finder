import { useState } from 'react';

type ViewMode = 'card' | 'table';

export function useViewMode(initialMode: ViewMode = 'card') {
  const [viewMode, setViewMode] = useState<ViewMode>(initialMode);

  return {
    viewMode,
    setViewMode,
  };
} 