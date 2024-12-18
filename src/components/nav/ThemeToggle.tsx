"use client";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Popover가 열리면 body의 스크롤을 막고, 닫히면 다시 활성화
    useEffect(() => {
        if (popoverOpen) {
            document.body.style.overflow = "hidden"; // 스크롤 막기
        } else {
            document.body.style.overflow = "auto"; // 스크롤 다시 활성화
        }

        // cleanup: 팝오버가 닫히면 스크롤이 정상적으로 돌아가도록 설정
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [popoverOpen]);

    if (!mounted) return null;

    return (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
                <Button variant={"ghost"} className="p-2 md:p-3">
                    {theme === "light" ? (
                        <Sun style={{ width: "20px", height: "20px" }} />
                    ) : (
                        <Moon style={{ width: "20px", height: "20px" }} />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <div className="grid grid-cols-1 gap-1 p-1">
                    <Button
                        className="justify-start"
                        variant={"ghost"}
                        onClick={() => setTheme("light")}
                    >
                        <Sun /> Light
                    </Button>
                    <Button
                        className="justify-start"
                        variant={"ghost"}
                        onClick={() => setTheme("dark")}
                    >
                        <Moon /> Dark
                    </Button>
                    <Button
                        className="justify-start"
                        variant={"ghost"}
                        onClick={() => setTheme("system")}
                    >
                        <Monitor /> System
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
};
