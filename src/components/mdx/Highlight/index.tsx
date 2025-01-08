'use client'

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export interface HighlightColor {
    PEACH: string;
    MINT: string;
    LAVENDER: string;
    SKY: string;
    LEMON: string;
}

const baseColors = {
    PEACH: '255, 112, 112',
    MINT: '112, 255, 112',
    LAVENDER: '190, 120, 255',
    SKY: '102, 179, 255',
    LEMON: '255, 255, 102',
};

export interface HighlightProps {
    color: keyof HighlightColor;
    children: React.ReactNode;
}

export const Highlight: React.FC<HighlightProps> = ({ color, children }) => {
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // SSR 불일치 방지
    if (!mounted) {
        return <span>{children}</span>;
    }

    const currentTheme = theme || resolvedTheme || 'light';
    const alpha = currentTheme === 'dark' ? 0.5 : 0.5;
    const backgroundColor = `rgba(${baseColors[color]}, ${alpha})`;

    return (
        <span
            style={{
                background: `linear-gradient(to bottom, transparent 60%, ${backgroundColor} 60%, ${backgroundColor} 80%, transparent 80%)`,
                display: 'inline-block',
                position: 'relative',
                padding: '0 2px',
            }}
        >
            {children}
        </span>
    );
};

