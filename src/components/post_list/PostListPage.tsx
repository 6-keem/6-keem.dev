import React from 'react';
import CategoryList from './CategoryList';
import PostCard from './PostCard';
import { Post } from '@/config/types';
import { getCategoryList, getPosts } from '@/lib/supabase-function';

interface PostListProps {
  category?: string;
}

const PostListPage = async ({ category }: PostListProps) => {
  const postList: Post[] = await getPosts(category);
  const categoryList: string[] = await getCategoryList();

  const allPostCount = postList.length;

  return (
    <section className="mx-auto mt-12 w-full max-w-[1130px] px-4 md:px-12 flex flex-col gap-y-2">
      <div className="flex justify-between">
        <CategoryList allPostCount={allPostCount} categoryList={categoryList} currentCategory={category} />
      </div>

      <section>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-4 mt-8">
          {postList.map((post, index) => (
            <PostCard key={index} post={post} />
          ))}
        </ul>
      </section>
    </section>
  );
};

export default PostListPage;
