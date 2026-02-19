import DockSection from '@/components/dock/DockSection';
import PostListPage from '@/components/post_list/PostListPage';
import { baseDomain, blogName, blogThumbnailURL } from '@/config/const';
import { checkPermission } from '@/lib/auth';
import { Metadata } from 'next';

const Blog = async () => {
  const isAdmin = await checkPermission();

  return (
    <div>
      <PostListPage />
      {isAdmin && (
        <section className="fixed left-1/2 bottom-8 -translate-x-1/2 w-max">
          <DockSection />
        </section>
      )}
    </div>
  );
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
