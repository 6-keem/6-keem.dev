import React from 'react';
import CategoryList from './CategoryList';
import PostCard from './PostCard';
import { auth } from '@/lib/auth';
import { Post } from '@/config/types';
import { Session } from 'next-auth';
import { getCategoryList, getPosts } from '@/lib/supabase-function';

interface PostListProps {
  category?: string;
}

const PostListPage = async ({ category }: PostListProps) => {
  const postList: Post[] = await getPosts(category);
  const categoryList: string[] = await getCategoryList();

  const allPostCount = postList.length;

  const mainPost = postList.length > 0 ? postList[0] : null;
  const subPosts = postList.length > 1 ? postList.slice(1, 4) : [];
  const remainingPosts = postList.length > 4 ? postList.slice(4) : [];

  return (
    <section className="mx-auto mt-12 w-full max-w-[1440px] px-4 md:px-12 flex flex-col gap-y-10">
      <div className="flex justify-between">
        <CategoryList allPostCount={allPostCount} categoryList={categoryList} currentCategory={category} />
      </div>

      <section>
        {mainPost && (
          <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-x-2 w-full">
            <div className="lg:col-span-3 lg:sticky top-4 self-start mb-8 lg:-mb-0.5">
              <PostCard post={mainPost} isMain={true} />
            </div>

            <div className="lg:col-span-1 flex flex-col gap-y-8">
              {subPosts.map((post, index) => (
                <PostCard key={index} post={post} />
              ))}
            </div>
          </div>
        )}

        {remainingPosts.length > 0 && (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-2 mt-16">
            {remainingPosts.map((post, index) => (
              <PostCard key={index} post={post} />
            ))}
          </ul>
        )}
      </section>
    </section>
  );
};

export default PostListPage;
