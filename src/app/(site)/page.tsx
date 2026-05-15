import { Metadata } from 'next';
import AdminActions from '@/components/admin/AdminActions';
import PostListPage from '@/components/post_list/PostListPage';
import { baseDomain, blogName, blogThumbnailURL } from '@/config/const';

type SearchParams = Promise<{ page?: string }>;

const Home = async ({ searchParams }: { searchParams: SearchParams }) => {
  const sp = await searchParams;
  const page = sp.page ? Number(sp.page) : 1;

  return (
    <>
      <PostListPage page={Number.isFinite(page) ? page : 1} />
      <AdminActions />
    </>
  );
};

export async function generateMetadata(): Promise<Metadata> {
  const title = blogName;
  return {
    title,
    alternates: { canonical: baseDomain },
    openGraph: {
      title,
      url: baseDomain,
      images: [blogThumbnailURL],
    },
    twitter: {
      title,
      images: [blogThumbnailURL],
    },
  };
}

export default Home;
