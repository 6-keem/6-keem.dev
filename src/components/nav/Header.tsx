"use client";

import { ProgressBar } from "./ProgressBar";
import { NavbarContent } from "./NavbarContent";
import { useScroll } from "../provider/ScrollProvider";
import { usePathname } from "next/navigation";
export enum RootPathType {
    "blog",
    "about",
    "gallery",
}

export const Header = () => {
    const { progress, navTopMargin } = useScroll();
    return (
        <>
            <ProgressBar progress={`${progress}`} />
            <nav
                className={`fixed top-0 pt-1H z-20 flex w-full flex-col items-center justify-center border-b bg-zinc-50 dark:bg-zinc-950 shadow-sm print:hidden`}
                style={{ marginTop: `${navTopMargin}px` }}
            >
                <NavbarContent />
            </nav>
        </>
    );
};
