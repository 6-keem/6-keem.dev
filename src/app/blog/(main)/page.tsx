import PostListPage from "@/components/post_list/PostListPage";
import { baseDomain, blogName, blogThumbnailURL } from "@/config/const";
import { Metadata } from "next";

type SearchParams = Promise<{ page?: string }>;

const Blog = async ({ searchParams }: { searchParams: SearchParams }) => {
    const sp = await searchParams;
    const page = sp.page ? Number(sp.page) : 1;
    return <PostListPage page={Number.isFinite(page) ? page : 1} />;
};

export async function generateMetadata(): Promise<Metadata> {
    const title = blogName;
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

export default Blog;
