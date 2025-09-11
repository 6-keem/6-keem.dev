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

const CategoryPage = async ({ params }: { params: Props }) => {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);
  return <PostListPage category={decodedCategory} />;
};

export default CategoryPage;
