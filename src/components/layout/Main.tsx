'use client';

import { useSidebar } from '@/components/provider/SidebarProvider';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

export default function Main({ children }: { children: ReactNode }) {
  const { open } = useSidebar();

  return (
    <main
      className={cn('flex-1 min-h-screen pt-[64px] pb-[48px] relative', 'transition-all duration-300 ease-in-out', open ? 'ml-48' : 'ml-0')}
    >
      {children}
    </main>
  );
}
