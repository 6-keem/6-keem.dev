'use client';

import { HeadingItem } from '@/config/types';
import { useHeadingsObserver } from '@/hooks/useHeadingsObserver';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebar } from '../provider/SidebarProvider';

interface Props {
  toc: HeadingItem[];
  navTopMargin: number;
}

const TocContent = ({ toc, navTopMargin }: Props) => {
  const { open } = useSidebar();
  const [isOpen, setIsOpen] = useState(false);
  const lastActiveIdRef = useRef(toc[0]?.link);
  const activeIdList = useHeadingsObserver('h2, h3', toc);
  const validIdList = activeIdList.filter((id) => id);

  let currentActiveId;

  if (validIdList.length > 0) {
    currentActiveId = validIdList[0];
    lastActiveIdRef.current = currentActiveId;
  } else {
    currentActiveId = lastActiveIdRef.current;
  }

  useEffect(() => {
    lastActiveIdRef.current = toc[0]?.link;
  }, [toc]);

  useEffect(() => {
    if (!isOpen) return;
    const handleScroll = () => setIsOpen(false);
    window.addEventListener('scroll', handleScroll, { once: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  const activeItem = activeIdList.length === 1 && activeIdList[0] === '' ? null : toc.find((item) => item.link === currentActiveId) || null;

  if (!toc || toc.length === 0) {
    return null;
  }

  const scrollBasedMargin = -20 + (-navTopMargin / 65) * 20;
  const finalTocMargin = open ? -20 : scrollBasedMargin;

  return (
    <AnimatePresence>
      {activeItem && (
        <motion.div
          key={toc[0]?.link || 'toc-content'}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={`not-prose w-full border-b border-foreground-50 transition-[margin-left] duration-300 ${open ? 'ml-48' : ''}`}
          style={{ marginTop: finalTocMargin }}
        >
          <div className="flex flex-col px-8 pt-2 pb-1">
            <button onClick={() => setIsOpen(!isOpen)} className="flex w-full items-center justify-between py-2 text-sm">
              <span className="font-medium text-foreground">{activeItem?.text || 'Table of Contents'}</span>
              <ChevronDown size={18} className={cn('transform transition-transform duration-300', isOpen && 'rotate-180')} />
            </button>

            <div
              className={cn(
                'grid overflow-hidden transition-all duration-300 ease-in-out',
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              )}
            >
              <ul className="overflow-hidden">
                {toc.map((item) => {
                  const isActive = currentActiveId === item.link;
                  const isH3 = item.indent === 1;
                  return (
                    <li key={item.link}>
                      <Link
                        href={item.link}
                        aria-current={isActive}
                        className={cn(
                          'block py-1 text-sm transition-colors',
                          isH3 && 'pl-4',
                          isActive
                            ? 'font-medium text-foreground'
                            : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                        )}
                      >
                        {item.text}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TocContent;
