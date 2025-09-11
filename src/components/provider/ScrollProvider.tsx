'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface ScrollContextProps {
  progress: number;
  navTopMargin: number;
  footerTopMargin: number;
}

const ScrollContext = createContext<ScrollContextProps>({
  progress: 0,
  navTopMargin: 0,
  footerTopMargin: 0, // Footer 기본적으로 숨김 상태
});

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lastScrollY, setLastScrollY] = useState(0);
  const [navTopMargin, setNavTopMargin] = useState(0);
  const [footerTopMargin, setFooterTopMargin] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      // Progress 계산
      const newProgress = totalHeight === 0 ? 0 : Math.min(Math.max((currentScrollY / totalHeight) * 100, 0), 100);

      setProgress(newProgress);

      // Navbar 동작
      if (currentScrollY < lastScrollY) {
        setNavTopMargin((prevMargin) => Math.min(prevMargin + (lastScrollY - currentScrollY), 0));
      } else if (currentScrollY > lastScrollY) {
        setNavTopMargin((prevMargin) => Math.max(prevMargin - (currentScrollY - lastScrollY), -65));
      }

      const isBottom = totalHeight - (currentScrollY + 80) <= 0;
      if (isBottom) {
        if (currentScrollY < lastScrollY) {
          setFooterTopMargin(Math.max(totalHeight - (currentScrollY + 80), -80));
        } else {
          // 스크롤이 내려감 -> 화면이 내려감
          setFooterTopMargin(Math.min(totalHeight - (currentScrollY + 80), 0));
        }
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return <ScrollContext.Provider value={{ progress, navTopMargin, footerTopMargin }}>{children}</ScrollContext.Provider>;
};

export const useScroll = () => useContext(ScrollContext);
