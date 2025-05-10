import Image from "next/image";
import Link from "next/link";

import { CalendarDays, Clock3 } from "lucide-react";
import { PostWithVisibility } from "./PostListPage";
import WarningTape from "../WarningTape";

interface Props {
    post: PostWithVisibility;
}
const MAX_LINES = 5;

const PostCard = ({ post }: Props) => {
    const extractPlainText = (mdxContent: string) => {
        // Remove MDX components like Callouts, Images, Links, etc.
        const cleanContent = mdxContent
            .replace(/<Callout[^>]*>.*?<\/Callout>/g, "") // Remove entire <Callout> components (including content)
            .replace(/```[\s\S]*?```/g, "") // Remove code blocks, including content between ``` (code block content)
            .replace(/<[^>]+>/g, "") // Remove any other HTML tags
            .replace(/^#{1,6}\s+/gm, "") // Remove Markdown headers (e.g., # Heading, ## Subheading)
            .replace(/^\s*[-*]\s+/gm, "") // Remove unordered list bullets (e.g., - item, * item)
            .replace(/^\s*\d+\.\s+/gm, "") // Remove ordered list numbers (e.g., 1. item)
            .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // Convert links to plain text (i.e., [link](url) => link)
            .replace(/\!\[.*?\]\(.*?\)/g, "") // Remove image markdown
            .replace(/!출처:\s*https?\:\/\/[^\s]+/g, "") // Remove !출처: with a URL (e.g., !출처: https://d2.naver.com/helloworld/59361)
            .replace(/---/g, "") // Remove Markdown horizontal rule (---)
            .replace(/(\r\n|\n|\r)/g, " ") // Replace newlines with a space
            .replace(/\s+/g, " ") // Replace multiple spaces with a single space
            .replace(/\**/g, "") // Replave bold syntax (**example**)
            .replace(/\|/g, "")
            .replace(/-+/g, "")
            .trim(); // Trim leading/trailing spaces

        return cleanContent;
    };

    const scrambleString = (text: string) => {
        const specialChars = "!@#$%^&*()_+~`|}{[]\\:;?><,./-=";
        let result = "";

        for (let i = 0; i < text.length; i++) {
            const randomIndex = Math.floor(Math.random() * specialChars.length);
            result += specialChars[randomIndex];
        }

        return result;
    };

    return (
        <>
            <Link href={post.url} className="hidden sm:block">
                <li
                    className="flex w-full gap-3 overflow-hidden rounded-md transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800 py-2 px-2"
                    style={{ height: "192px" }}
                >
                    <div className="relative w-80 h-44 rounded-md border sm:block hidden overflow-hidden">
                        <Image
                            src={post.thumbnail}
                            alt={`thumbnail for ${post.title}`}
                            layout="fill"
                            priority
                            style={{
                                objectFit: "cover",
                                filter: `${post.visibility === "private" ? "blur(12px)" : ""}`,
                            }}
                        />
                    </div>

                    <div className="w-full flex flex-col justify-between overflow-hidden">
                        <div className="flex-1">
                            <h2 className="mb-3 text-lg font-semibold sm:text-lg md:text-xl">
                                {post.visibility === "public" ? post.title : "비밀글 🔐"}
                            </h2>
                            <div
                                className={`text-text-secondary text-sm font-thin sm:text-sm md:text-md ${
                                    post.title.length > 100 ? "line-clamp-3" : "line-clamp-5"
                                }`}
                            >
                                {post.visibility === "public"
                                    ? extractPlainText(post.content)
                                    : scrambleString(post.content)}
                            </div>
                        </div>
                        <div className="flex justify-between gap-3 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                                <CalendarDays className="w-3.5" />
                                <span>{post.dateString}</span>
                            </div>
                            <div className="text-sm font-medium text-sky-500 lg:text-base">
                                {post.categoryPublicName}
                            </div>
                        </div>
                    </div>
                </li>
            </Link>
            <Link href={post.url} className="sm:hidden">
                <li className="flex h-full flex-col gap-3 overflow-hidden rounded-md border shadow-md transition hover:shadow-xl dark:border-zinc-700 dark:hover:border-white">
                    <div className="relative aspect-[2/1] w-full rounded-t-md border-b">
                        <Image
                            src={post.thumbnail}
                            alt={`thumbnail for ${post.title}`}
                            sizes="(max-width: 1000px) 50vw, 450px"
                            fill
                            priority
                            style={{
                                objectFit: "cover",
                                filter: `${post.visibility === "private" ? "blur(12px)" : ""}`,
                            }}
                        />
                    </div>
                    <div className="flex flex-1 flex-col justify-between p-4 pt-1">
                        <div>
                            <h2 className="mb-1 mt-1 text-lg font-bold sm:text-xl md:text-lg">{post.title}</h2>
                            <h2 className="mb-1 text-text-secondary text-sm font-thin sm:text-sm md:text-md line-clamp-3">
                                {extractPlainText(post.content)}
                            </h2>
                        </div>
                        <div className="flex justify-between gap-3 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                                <CalendarDays className="w-3.5" />
                                <span>{post.dateString}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm font-medium text-sky-500 lg:text-base">
                                {post.categoryPublicName}
                            </div>
                        </div>
                    </div>
                </li>
            </Link>
        </>
    );
};

export default PostCard;
