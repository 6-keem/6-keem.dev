'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export const SCROLL_TOP_FLAG = '__scrollTopOnNav';

/**
 * Returns navigate(href) which suppresses Next's default scroll behavior
 * and instead sets a sessionStorage flag picked up by <ScrollTopOnNavFlag/>
 * (mounted in the root layout) once the destination has rendered.
 */
export function useNavigateAndScrollTop() {
  const router = useRouter();

  return useCallback(
    (href: string) => {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(SCROLL_TOP_FLAG, '1');
      }
      router.push(href, { scroll: false });
    },
    [router],
  );
}
