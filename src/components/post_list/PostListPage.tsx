import React from 'react';
import CategoryList from './CategoryList';
import PostCard from './PostCard';
import { getAllPostCount, getCategoryDetailList, getSortedPostList } from '@/lib/post';
import { auth } from '@/lib/auth';
import { Post } from '@/config/types';
import { Session } from 'next-auth';

interface PostListProps {
  category?: string;
}

export interface PostWithVisibility extends Post {
  visibility: 'public' | 'private';
}

export const PRIVATE_CATEGORY = ['日本生活🔰'];

const getIsAuthorized = (session: Session | null): boolean => {
  if (!session) return false;

  if (session.user?.email === '6ukeem@gmail.com') return true;

  const follwers = session.user?.followers;
  if (!follwers || follwers.length === 0) return false;

  follwers.map((follwer) => {
    if (follwer.login === '6-keem') return true;
  });
  return false;
};

const getIsPrivate = (categoryName: string) => {
  return PRIVATE_CATEGORY.includes(categoryName);
};

const PostListPage = async ({ category }: PostListProps) => {
  const postList: Post[] = await getSortedPostList(category);
  const categoryList = await getCategoryDetailList();
  const allPostCount = await getAllPostCount();
  const session = await auth();
  const isAuthorized = getIsAuthorized(session);
  const visibilityPostList: PostWithVisibility[] = postList.map((post) => {
    const visibilityPost: PostWithVisibility = {
      ...post,
      visibility: isAuthorized ? 'public' : getIsPrivate(post.categoryPublicName) ? 'private' : 'public',
    };
    return visibilityPost;
  });

  const mainPost = visibilityPostList.length > 0 ? visibilityPostList[0] : null;
  const subPosts = visibilityPostList.length > 1 ? visibilityPostList.slice(1, 4) : [];
  const remainingPosts = visibilityPostList.length > 4 ? visibilityPostList.slice(4) : [];

  return (
    <section className="mx-auto mt-12 w-full max-w-[1440px] px-12 flex flex-col gap-y-10">
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
              {subPosts.map((post) => (
                <PostCard key={post.uniqueKey} post={post} />
              ))}
            </div>
          </div>
        )}

        {remainingPosts.length > 0 && (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-2 mt-16">
            {remainingPosts.map((post) => (
              <PostCard key={post.uniqueKey} post={post} />
            ))}
          </ul>
        )}
      </section>
    </section>
  );
};

export default PostListPage;
