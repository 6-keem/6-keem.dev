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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeIdList = useHeadingsObserver('h2, h3', toc);
  const validIdList = activeIdList.filter((id) => id);

  let currentActiveId;

  if (validIdList.length > 0) {
    // When multiple headings are intersecting, prefer the earliest one
    // in document order (the "previous" section we just scrolled past).
    const earliest = toc.find((item) => validIdList.includes(item.link));
    currentActiveId = earliest?.link ?? validIdList[0];
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
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { once: true });
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
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
          className={`not-prose w-full bg-background border-b border-foreground-50 transition-[margin-left] duration-300 ${open ? 'ml-48' : ''}`}
          style={{ marginTop: finalTocMargin }}
        >
          <div ref={containerRef} className="relative flex flex-col px-8 pt-2 pb-1">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-label={isOpen ? 'Hide table of contents' : 'Show table of contents'}
              className="absolute right-8 top-2 z-10 p-2 -m-2"
            >
              <ChevronDown size={18} className={cn('transform transition-transform duration-300', isOpen && 'rotate-180')} />
            </button>

            <div
              className={cn(
                'grid transition-all duration-300 ease-in-out',
                isOpen ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100',
              )}
            >
              <div className="overflow-hidden">
                <button
                  type="button"
                  onClick={() => setIsOpen(true)}
                  className="flex w-full items-center py-2 text-sm pr-8"
                >
                  <span className="font-bold text-foreground">{activeItem?.text || 'Table of Contents'}</span>
                </button>
              </div>
            </div>

            <div
              className={cn(
                'grid transition-all duration-300 ease-in-out',
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
              )}
            >
              <div className="overflow-hidden">
                <ul className="py-2">
                  {toc.map((item, i) => {
                    const isActive = currentActiveId === item.link;
                    const isH3 = item.indent === 1;
                    return (
                      <li key={item.link}>
                        <Link
                          href={item.link}
                          aria-current={isActive}
                          onClick={(e) => {
                            const id = item.link.startsWith('#') ? item.link.slice(1) : item.link;
                            const el = document.getElementById(id);
                            if (el) {
                              e.preventDefault();
                              const targetY = el.getBoundingClientRect().top + window.scrollY;
                              // Going up: header expands → leave more room (larger offset).
                              // Going down: header collapses → land closer to top (smaller offset).
                              const goingUp = targetY < window.scrollY;
                              const offset = goingUp ? 112 : 72;
                              window.scrollTo({ top: targetY - offset });
                              history.replaceState(null, '', item.link);
                            }
                            setIsOpen(false);
                          }}
                          className={cn(
                            'block py-1 text-sm transition-colors',
                            isH3 && 'pl-4',
                            i === 0 && 'pr-8',
                            isActive
                              ? 'font-bold text-foreground'
                              : 'text-muted-foreground/70 hover:text-foreground',
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TocContent;
