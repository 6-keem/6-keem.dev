import { PostBody } from "@/components/post_detail/PostBody";
import { PostFooter } from "@/components/post_detail/PostFooter";
import { PostHeader } from "@/components/post_detail/PostHeader";
import TocContent from "@/components/sidebar/toc/TocContentSidebar";
import { getPostDetail, getSortedPostList, parseToc } from "@/lib/post";

type Props = Promise<{
    category: string;
    slug: string;
}>;

const PostDetail = async ({ params }: { params: Props }) => {
    const category = (await params).category;
    const slug = (await params).slug;

    const post = await getPostDetail(category, slug);
    const posts = (await getSortedPostList(category)).reverse();
    const toc = parseToc(post.content);
    return (
        <div className="prose mx-auto w-full max-w-[750px] px-5 dark:prose-invert sm:px-6">
            <PostHeader post={post} />
            <article className="relative">
                {/* <SidebarContent /> */}
                <PostBody post={post} posts={posts} />
                <TocContent toc={toc} />
            </article>
            <PostFooter post={post} posts={posts} />
        </div>
    );
};

export default PostDetail;
