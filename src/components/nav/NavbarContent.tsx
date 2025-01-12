import { GithubIcon } from "lucide-react";
import { Button } from "../ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { usePathname } from "next/navigation";
import Link from "next/link";
import LanguageSelector from "../about/language-selector";

export const NavbarContent = () => {
    const pathname = usePathname();
    const currentPath = pathname.split("/").slice(0, 2).join("/");

    const navItems = [
        { path: "/blog", label: "6-keem" },
        { path: "/gallery", label: "Gallery" },
        { path: "/about", label: "About" },
    ];

    const localePathList = ["/about"];
    const isLocalePath = localePathList.some((path) => pathname.startsWith(path));

    return (
        <div className="flex h-[64px] w-full max-w-[1200px] items-center justify-between px-4">
            <div className="flex space-x-2">
                {navItems.map((item) => (
                    <Link
                        href={item.path}
                        key={item.path}
                        onClick={(e) => {
                            if (currentPath === item.path && item.path !== "/blog") {
                                e.preventDefault();
                            }
                        }}
                    >
                        <div
                            className={`
            rounded-full px-4 py-1 text-center text-xs transition-colors md:text-sm
            ${
                currentPath === item.path
                    ? "bg-secondary text-text-selected"
                    : "text-text-unselected hover:text-text-selected"
            }
            ${
                currentPath === item.path
                    ? "dark:bg-secondary dark:text-text-selected"
                    : "dark:text-text-unselected dark:hover:text-text-selected"
            }
        `}
                        >
                            <span className="font-bold">{item.label}</span>
                        </div>
                    </Link>
                ))}
            </div>
            <div className="flex items-center">
                {isLocalePath && <LanguageSelector className="hidden sm:flex" />}
                <ThemeToggle />
                <Link href={"https://github.com/6-keem/"}>
                    <Button variant={"ghost"} className="p-0 ms-2 flex items-center">
                        <div className="p-2 md:p-3 flex items-center justify-center">
                            <GithubIcon style={{ width: "20px", height: "20px" }} />
                        </div>
                    </Button>
                </Link>
            </div>
        </div>
    );
};
