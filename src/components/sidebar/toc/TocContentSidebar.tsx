"use client";
import { HeadingItem } from "@/config/types";
import { useHeadingsObserver } from "@/hooks/useHeadingsObserver";
import { cn } from "@/lib/utils";
import Link from "next/link";
import CopyLinkButton from "../../common/CopyLinkButton";
import { ScrollTop } from "../../common/TocButtons";

interface Props {
    toc: HeadingItem[];
}

const TocContent = ({ toc }: Props) => {
    const activeIdList = useHeadingsObserver("h2, h3");
    return (
        <aside className="not-prose absolute -top-[200px] left-full -mb-[100px] hidden h-[calc(100%+150px)] xl:block ">
            <div className="sticky bottom-0  top-[200px] z-10 ml-[5rem] mt-[200px] w-[200px]">
                <div className="mb-4 border-l px-4 py-2">
                    <div className="mb-1 font-bold">On this page</div>
                    <ul className="text-xs">
                        {toc.map((item) => {
                            const isH3 = item.indent === 1;
                            const isIntersecting = activeIdList.includes(
                                item.link
                            );
                            return (
                                <li
                                    key={item.link}
                                    className={cn(
                                        isH3 && "ml-4",
                                        isIntersecting &&
                                            "font-medium text-sky-500",
                                        "py-1 transition"
                                    )}
                                >
                                    <Link href={item.link}>{item.text}</Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div className="flex gap-1">
                    <CopyLinkButton/>
                    <ScrollTop />
                </div>
            </div>
        </aside>
    );
};

export default TocContent;
