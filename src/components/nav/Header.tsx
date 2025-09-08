'use client';

import { ProgressBar } from './ProgressBar';
import { NavbarContent } from './NavbarContent';
import { useScroll } from '../provider/ScrollProvider';
import { useSidebar } from '../provider/SidebarProvider';
import { useToc } from '../provider/TocProvider';
import TocContent from './HeaderToc';
export enum RootPathType {
  'blog',
  'about',
  'gallery',
}

export const Header = () => {
  const { toc } = useToc();
  const { progress, navTopMargin } = useScroll();
  const { open } = useSidebar();

  return (
    <>
      <ProgressBar progress={`${progress}`} />
      <nav
        className={`fixed top-0 pt-1H z-20 flex w-full flex-col justify-center bg-background print:hidden`}
        style={{ marginTop: open ? 0 : navTopMargin }}
      >
        <NavbarContent />
        {toc.length !== 0 && <TocContent toc={toc} navTopMargin={navTopMargin} />}
      </nav>
    </>
  );
};
