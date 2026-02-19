import DockSection from '@/components/dock/DockSection';
import { PostBody } from '@/components/post_detail/PostBody';
import { PostFooter } from '@/components/post_detail/PostFooter';
import { PostHeader } from '@/components/post_detail/PostHeader';
import { TocRegistrar } from '@/components/post_list/TocRegister';
import { checkPermission } from '@/lib/auth';
import { parseToc } from '@/lib/post';
import { getPosts } from '@/lib/supabase-function';

type Props = Promise<{
  category: string;
  slug: string;
}>;

const PostDetail = async ({ params }: { params: Props }) => {
  const category = decodeURIComponent((await params).category);
  const slug = decodeURIComponent((await params).slug);

  const post = await getPosts(category);
  const currentPost = post.find((post) => {
    return post.date === slug;
  })!;
  const toc = parseToc(currentPost.content);

  const isAdmin = await checkPermission();
  return (
    <div className="prose mx-auto w-full px-5 dark:prose-invert sm:px-6 max-w-[750px]">
      <TocRegistrar toc={toc} />
      <div className=" mx-auto w-full">
        <PostHeader post={currentPost} />
        <article className="relative">
          <PostBody currentPost={currentPost} posts={post} />
        </article>
      </div>
      <PostFooter post={currentPost} posts={post} />
      {isAdmin && (
        <section className="fixed left-1/2 bottom-8 -translate-x-1/2 w-max">
          <DockSection postId={currentPost.id} />
        </section>
      )}
    </div>
  );
};

export default PostDetail;
