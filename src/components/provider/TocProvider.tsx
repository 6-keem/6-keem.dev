'use client';

import { HeadingItem } from '@/config/types';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface TocContextType {
  toc: HeadingItem[];
  setToc: (toc: HeadingItem[]) => void;
}

const TocContext = createContext<TocContextType | undefined>(undefined);

const TocManager = () => {
  const pathname = usePathname();
  const { setToc } = useToc();

  useEffect(() => {
    setToc([]);
  }, [pathname, setToc]);

  return null;
};

export const TocProvider = ({ children }: { children: ReactNode }) => {
  const [toc, setToc] = useState<HeadingItem[]>([]);
  return (
    <TocContext.Provider value={{ toc, setToc }}>
      <TocManager />
      {children}
    </TocContext.Provider>
  );
};

export const useToc = () => {
  const context = useContext(TocContext);
  if (!context) {
    throw new Error('useToc must be used within a TocProvider');
  }
  return context;
};
