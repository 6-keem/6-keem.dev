import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AdminActions from '@/components/admin/AdminActions';
import { PostBody } from '@/components/post_detail/PostBody';
import { PostFooter } from '@/components/post_detail/PostFooter';
import { PostHeader } from '@/components/post_detail/PostHeader';
import ViewTracker from '@/components/post_detail/ViewTracker';
import { TocRegistrar } from '@/components/post_list/TocRegister';
import { baseDomain, blogName, blogThumbnailURL } from '@/config/const';
import { parseToc } from '@/lib/post';
import {
  getHeroPosts,
  getHotPosts,
  getPostDetail,
  getPostsIndex,
} from '@/lib/supabase-function';

type Props = Promise<{
  category: string;
  slug: string;
}>;

export const revalidate = 3600;

export async function generateStaticParams() {
  const idx = await getPostsIndex();
  return idx.map((p) => ({ category: p.category, slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Props }): Promise<Metadata> {
  const { category, slug } = await params;
  const decodedCategory = decodeURIComponent(category);
  const decodedSlug = decodeURIComponent(slug);
  const detail = await getPostDetail(decodedCategory, decodedSlug);
  const post = detail[0];
  if (!post) {
    return { title: blogName };
  }

  const url = `${baseDomain}/blog/${decodedCategory}/${decodedSlug}`;
  const image = post.thumbnail || blogThumbnailURL;
  const description = post.description || undefined;
  const title = `${post.title} | ${blogName}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

const PostDetail = async ({ params }: { params: Props }) => {
  const category = decodeURIComponent((await params).category);
  const slug = decodeURIComponent((await params).slug);

  const [detail, heroPosts, hotPosts] = await Promise.all([
    getPostDetail(category, slug),
    getHeroPosts(),
    getHotPosts(5),
  ]);
  const currentPost = detail[0];
  if (!currentPost) notFound();

  const isRecommended = heroPosts.some((h) => h.id === currentPost.id);
  const isHot = hotPosts.some((h) => h.id === currentPost.id);
  const toc = parseToc(currentPost.content);

  return (
    <div className="prose mx-auto w-full px-5 dark:prose-invert sm:px-6 max-w-[750px]">
      <ViewTracker postId={currentPost.id} />
      <TocRegistrar toc={toc} />
      <div className=" mx-auto w-full">
        <PostHeader post={currentPost} isRecommended={isRecommended} isHot={isHot} />
        <article className="relative">
          <PostBody currentPost={currentPost} />
        </article>
      </div>
      <PostFooter currentPost={currentPost} />
      <AdminActions postId={currentPost.id} />
    </div>
  );
};

export default PostDetail;
