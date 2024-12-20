"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import * as S from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { GlobeIcon } from "lucide-react";

export default function LanguageSelector({
    className,
}: {
    className?: string;
}) {
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const isKo = pathname.endsWith("/ko");
    const isEn = pathname.endsWith("/en");
    const isJp = pathname.endsWith("/jp");

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true);
    }, []);

    // Ensure that the component does not render until mounted is true
    if (!mounted) {
        return null;
    }

    const onSelectChange = (value: string) => {
        const localePattern = /\/(ko|en|jp)$/;
        const newPath = pathname.replace(localePattern, `/${value}`);
        router.push(newPath);
    };

    return (
        <S.Select
            onValueChange={onSelectChange}
            defaultValue={isEn ? "en" : "ko"}
        >
            <S.SelectTrigger className={cn("w-fit gap-2", className)}>
                <GlobeIcon className="size-3.5" />
                <S.SelectValue />
            </S.SelectTrigger>
            <S.SelectContent align="center">
                <S.SelectItem
                    className="flex justify-between"
                    disabled={isKo}
                    value="ko"
                >
                    한국어
                </S.SelectItem>
                <S.SelectItem
                    className="flex justify-between"
                    disabled={isJp}
                    value="jp"
                >
                    日本語
                </S.SelectItem>

                <S.SelectItem
                    className="flex justify-between"
                    disabled={isEn}
                    value="en"
                >
                    English
                </S.SelectItem>
            </S.SelectContent>
        </S.Select>
    );
}
