"use client";

import { ThemeProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes";

export default function MyThemeProvider({
    children,
    ...props
}: ThemeProviderProps) {
    return (
        <ThemeProvider attribute={"class"} defaultTheme="system" {...props}>
            {children}
        </ThemeProvider>
    );
}
