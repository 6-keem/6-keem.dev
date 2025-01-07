import { PostBody } from "@/components/post_detail/PostBody";
import { PostHeader } from "@/components/post_detail/PostHeader";
import SidebarContent from "@/components/sidebar/interact/Sidebar";
import TocContent from "@/components/sidebar/toc/TocContentSidebar";
import { getPostDetail, parseToc } from "@/lib/post";

type Props = Promise<{
	category: string;
	slug: string;
}>;

const PostDetail = async ({ params }: { params: Props }) => {
	const category = (await params).category;
	const slug = (await params).slug;

	const post = await getPostDetail(category, slug);
	const toc = parseToc(post.content);
	return (
		<div className="prose mx-auto w-full max-w-[750px] px-5 dark:prose-invert sm:px-6">
			<PostHeader post={post} />
			<article className="relative">
				{/* <SidebarContent /> */}
				<PostBody post={post} />
				<TocContent toc={toc} />
			</article>
		</div>
	);
};

export default PostDetail;
