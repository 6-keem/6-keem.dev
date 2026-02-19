import { baseDomain, blogThumbnailURL } from "@/config/const";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
    const title = "김상준 | 풀스택 개발자";
    const url = baseDomain;
    const thumbnailURL = blogThumbnailURL;

    return {
        title,
        openGraph: {
            title,
            url,
            images: [thumbnailURL],
        },
        twitter: {
            title,
            images: [thumbnailURL],
        },
    };
}

export default function AboutPage() {
    return redirect("/about/ko");
}
