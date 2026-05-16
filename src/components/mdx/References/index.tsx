import React, { Children, isValidElement } from "react";

import { cn } from "@/lib/utils";

export interface ReferenceItem {
    title: string;
    url: string;
    author?: string;
    site?: string;
    date?: string;
}

interface ReferencesProps {
    items?: ReferenceItem[];
    numbered?: boolean;
    title?: string;
    children?: React.ReactNode;
}

interface RefProps {
    title?: string;
    url?: string;
    author?: string;
    site?: string;
    date?: string;
}

export const Ref = (_props: RefProps) => null;

const getHostname = (url: string) => {
    try {
        return new URL(url).hostname.replace(/^www\./, "");
    } catch {
        return url;
    }
};

const isTruthyBool = (v: unknown) => {
    if (v === true) return true;
    if (typeof v === "string") return v === "" || v.toLowerCase() === "true";
    return false;
};

const collectFromChildren = (children: React.ReactNode): ReferenceItem[] => {
    const out: ReferenceItem[] = [];

    Children.forEach(children, (child) => {
        if (!isValidElement(child)) return;
        const p = child.props as RefProps;
        if (!p?.title || !p?.url) return;
        out.push({
            title: p.title,
            url: p.url,
            author: p.author,
            site: p.site,
            date: p.date,
        });
    });

    return out;
};

export const References = ({
    items,
    numbered,
    title = "참고자료",
    children,
}: ReferencesProps) => {
    const resolved = items?.length ? items : collectFromChildren(children);
    if (!resolved.length) return null;

    const showNumbers = isTruthyBool(numbered);

    return (
        <section className="my-10 border-t border-foreground-100 pt-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {title}
            </h2>
            <ol className="flex flex-col gap-3">
                {resolved.map((item, idx) => {
                    const meta = [item.author, item.site, item.date]
                        .filter(Boolean)
                        .join(" · ");
                    return (
                        <li
                            key={`${item.url}-${idx}`}
                            className={cn(
                                "flex gap-3 text-sm leading-relaxed",
                                !showNumbers && "list-none"
                            )}
                        >
                            <span
                                className={cn(
                                    "shrink-0 select-none text-zinc-400 dark:text-zinc-500",
                                    showNumbers ? "tabular-nums" : ""
                                )}
                            >
                                {showNumbers ? `[${idx + 1}]` : "•"}
                            </span>
                            <span className="flex flex-col gap-0.5">
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100"
                                >
                                    {item.title}
                                </a>
                                {meta && (
                                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                        {meta}
                                    </span>
                                )}
                                <span className="text-xs text-zinc-400 dark:text-zinc-500">
                                    {getHostname(item.url)} ↗
                                </span>
                            </span>
                        </li>
                    );
                })}
            </ol>
        </section>
    );
};
