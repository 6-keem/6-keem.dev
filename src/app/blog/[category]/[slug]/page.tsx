import { PostBody } from '@/components/post_detail/PostBody';
import { PostFooter } from '@/components/post_detail/PostFooter';
import { PostHeader } from '@/components/post_detail/PostHeader';
import { TocRegistrar } from '@/components/post_list/TocRegister';
import { parseToc } from '@/lib/post';
import { getHeroPosts, getPosts } from '@/lib/supabase-function';

type Props = Promise<{
  category: string;
  slug: string;
}>;

const PostDetail = async ({ params }: { params: Props }) => {
  const category = decodeURIComponent((await params).category);
  const slug = decodeURIComponent((await params).slug);

  const [post, heroPosts] = await Promise.all([getPosts(category), getHeroPosts()]);
  const currentPost = post.find((post) => {
    return post.date === slug;
  })!;
  const isRecommended = heroPosts.some((h) => h.id === currentPost.id);
  const toc = parseToc(currentPost.content);
  return (
    <div className="prose mx-auto w-full px-5 dark:prose-invert sm:px-6 max-w-[750px]">
      <TocRegistrar toc={toc} />
      <div className=" mx-auto w-full">
        <PostHeader post={currentPost} isRecommended={isRecommended} />
        <article className="relative">
          <PostBody currentPost={currentPost} />
        </article>
      </div>
      <PostFooter post={currentPost} posts={post} />
    </div>
  );
};

export default PostDetail;
