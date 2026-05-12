'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { SCROLL_TOP_FLAG } from '@/lib/smooth-navigate';
import { smoothScrollTo } from '@/lib/smooth-scroll';

export default function ScrollTopOnNavFlag() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem(SCROLL_TOP_FLAG) !== '1') return;
    sessionStorage.removeItem(SCROLL_TOP_FLAG);
    smoothScrollTo(0, 0);
  }, [pathname]);

  return null;
}
