'use client';

import { useSidebar } from '@/components/provider/SidebarProvider';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
};

export default function Sidebar() {
  const { open } = useSidebar();
  const currentPath = usePathname();
  const navItems = [
    { path: '/blog', label: '블로그' },
    { path: '/gallery', label: '갤러리' },
    { path: '/about', label: '프로필' },
  ];

  return (
    <aside
      className={cn(
        'fixed top-14 bottom-8 left-0 z-10 h-screen w-48 pt-28 bg-background',
        'transition-transform duration-300 ease-in-out',
        open ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <div className="p-4">
        <motion.ul key={currentPath} variants={containerVariants} initial="hidden" animate="visible">
          {currentPath.split('/').length !== 2 && currentPath.includes('blog') && (
            <motion.li variants={itemVariants}>
              <Link
                href={'/blog'}
                key={'/blog'}
                onClick={(e) => {
                  if (currentPath === '/blog') {
                    e.preventDefault();
                  }
                }}
                className="group flex h-full items-center px-4"
              >
                <ArrowLeft
                  className="w-4 h-4 text-foreground-400 transition-transform duration-300 group-hover:-translate-x-1.5"
                  strokeWidth={2}
                />
                <div
                  className={`
                      rounded-md py-2.5 px-3 transition-colors text-sm
                      ${'bg-transparent text-foreground-400'}
                    `}
                >
                  <span className="font-semibold">홈</span>
                </div>
              </Link>
            </motion.li>
          )}
          {navItems.map((item) => (
            <motion.li variants={itemVariants} key={item.path}>
              <Link
                href={item.path}
                onClick={(e) => {
                  if (currentPath === item.path && item.path !== '/blog') {
                    e.preventDefault();
                  }
                }}
              >
                <div
                  className={`
                    rounded-md px-4 py-2.5 transition-colors text-sm
                    ${currentPath === item.path ? 'bg-secondary text-text-selected' : 'text-text-unselected hover:text-text-selected'}
                    ${
                      currentPath === item.path
                        ? 'dark:bg-secondary dark:text-text-selected'
                        : 'dark:text-text-unselected dark:hover:text-text-selected'
                    }
                `}
                >
                  <span className="font-semibold">{item.label}</span>
                </div>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </aside>
  );
}
