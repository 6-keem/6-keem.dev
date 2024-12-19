"use client";

import { useEffect, useState } from "react";
import { ProgressBar } from "./ProgressBar";
import { NavbarContent } from "./NavbarContent";
import { useScroll } from "../provider/ScrollProvider";
export enum RootPathType {
    "blog",
    "about",
    "gallery",
}

export const Navbar = () => {
    const { progress, navTopMargin } = useScroll();
    return (
        <>
            <ProgressBar progress={`${progress}`} />
            <nav
                className={`fixed top-0 pt-1H z-20 flex w-full flex-col items-center justify-center border-b bg-background shadow-sm print:hidden`}
                style={{ marginTop: `${navTopMargin}px` }}
            >
                <NavbarContent />
            </nav>
        </>
    );
};
