"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

interface ScrollContextProps {
    progress: number;
    navTopMargin: number;
    footerHeight: number;
}

const ScrollContext = createContext<ScrollContextProps>({
    progress: 0,
    navTopMargin: 0,
    footerHeight: 0, // Footer 기본적으로 숨김 상태
});

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [lastScrollY, setLastScrollY] = useState(0);
    const [navTopMargin, setNavTopMargin] = useState(0);
    const [footerHeight, setFooterHeight] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const totalHeight =
                document.documentElement.scrollHeight -
                document.documentElement.clientHeight;

            // Progress 계산
            const newProgress =
                totalHeight === 0
                    ? 0
                    : Math.min(
                          Math.max((currentScrollY / totalHeight) * 100, 0),
                          100
                      );

            setProgress(newProgress);

            // Navbar 동작
            if (currentScrollY < lastScrollY) {
                setNavTopMargin((prevMargin) =>
                    Math.min(prevMargin + (lastScrollY - currentScrollY), 0)
                );
            } else if (currentScrollY > lastScrollY) {
                setNavTopMargin((prevMargin) =>
                    Math.max(prevMargin - (currentScrollY - lastScrollY), -65)
                );
            }

            const isAtBottom = totalHeight - currentScrollY <= 0;
            const maxFooterHeight = 80;
            const deltaScroll = currentScrollY - lastScrollY;

            // Footer가 최하단에 있을 때만 높이 확장
            if (isAtBottom) {
                setFooterHeight((prev) =>
                    Math.min(prev + Math.abs(deltaScroll), maxFooterHeight)
                );
            } else if (currentScrollY < lastScrollY) {
                // 스크롤 올릴 때 Footer가 축소
                setFooterHeight((prev) =>
                    Math.max(prev - Math.abs(deltaScroll), 0)
                );
            }

            setLastScrollY(currentScrollY);

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [lastScrollY]);

    return (
        <ScrollContext.Provider
            value={{ progress, navTopMargin, footerHeight }}
        >
            {children}
        </ScrollContext.Provider>
    );
};

export const useScroll = () => useContext(ScrollContext);
