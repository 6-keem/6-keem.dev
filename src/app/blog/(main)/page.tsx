import PostListPage from "@/components/post_list/PostListPage";
import { baseDomain, blogName, blogThumbnailURL } from "@/config/const";
import { Metadata } from "next";

const Blog = async () => {
    return <PostListPage />;
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
