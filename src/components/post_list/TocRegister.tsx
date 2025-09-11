'use client';

import { HeadingItem } from '@/config/types';
import { useEffect } from 'react';
import { useToc } from '../provider/TocProvider';

export const TocRegistrar = ({ toc }: { toc: HeadingItem[] }) => {
  const { setToc } = useToc();

  useEffect(() => {
    setToc(toc);
  }, [toc, setToc]);

  return null;
};
