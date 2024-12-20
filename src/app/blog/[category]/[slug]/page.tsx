import { PostBody } from "@/components/post_detail/PostBody";
import { PostHeader } from "@/components/post_detail/PostHeader";
import TocContent from "@/components/toc/TocContentSidebar";
import {
    getPostDetail,
    getPostPaths,
    parsePostAbstract,
    parseToc,
} from "@/lib/post";

type Props = {
    params: {
        category: string;
        slug: string;
    };
};

const PostDetail = async ({ params }: Props) => {
    const param = await params;
    const category = param.category;
    const slug = param.slug;

    const post = await getPostDetail(category, slug);
    const toc = parseToc(post.content);
    return (
        <div className="prose mx-auto w-full max-w-[750px] px-5 dark:prose-invert sm:px-6">
            <PostHeader post={post} />
            <article className="relative">
                <PostBody post={post} />
                <TocContent toc={toc} />
            </article>
        </div>
    );
};

export default PostDetail;
