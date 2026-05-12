import { Metadata } from 'next';

import PostListPage from '@/components/post_list/PostListPage';
import { baseDomain, blogName, blogThumbnailURL } from '@/config/const';
import { getCategoryList } from '@/lib/supabase-function';

type Props = Promise<{ category: string }>;

// 허용된 param 외 접근시 404
export const dynamicParams = false;

export async function generateStaticParams() {
  const categoryList = await getCategoryList();
  const paramList = categoryList.map((category) => ({ category }));
  return paramList;
}

export async function generateMetadata({ params }: { params: Props }): Promise<Metadata> {
  const { category } = await params;

  const decodedCategory = decodeURIComponent(category);
  const title = `${decodedCategory} | ${blogName}`;
  const url = `${baseDomain}/${decodedCategory}`;

  return {
    title,
    openGraph: {
      title,
      url,
      images: [blogThumbnailURL],
    },
    twitter: {
      title,
      images: [blogThumbnailURL],
    },
  };
}

type SearchParams = Promise<{ page?: string }>;

const CategoryPage = async ({ params, searchParams }: { params: Props; searchParams: SearchParams }) => {
  const { category } = await params;
  const sp = await searchParams;
  const page = sp.page ? Number(sp.page) : 1;
  const decodedCategory = decodeURIComponent(category);
  return <PostListPage category={decodedCategory} page={Number.isFinite(page) ? page : 1} />;
};

export default CategoryPage;
