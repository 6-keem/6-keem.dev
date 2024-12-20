"use client";

import { useScroll } from "@/components/provider/ScrollProvider";
import Link from "next/link";

export const Footer = () => {
    const { footerTopMargin } = useScroll();

    return (
        <footer
            className="py-8 z-20 bottom-0 w-full flex items-center justify-center border-t bg-secondary shadow-sm print:hidden"
            style={{ marginBottom: `${footerTopMargin}px` }}
        >
            <span>© Powered by&nbsp;</span>
            <Link href="https://github.com/6-keem/" className="underline">
                6-keem
            </Link>
        </footer>
    );
};
