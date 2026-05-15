'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function ScrollLock() {
  const pathname = usePathname();

  useEffect(() => {
    const isEditor = pathname.startsWith('/editor');

    if (isEditor) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100dvh';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.height = '';
    }

    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, [pathname]);

  return null;
}
