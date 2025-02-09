import { Post } from '@/config/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';
import Link from 'next/link';
import { Giscus } from './Giscus';

interface Prop {
  post: Post;
  posts: Post[];
}

export const PostFooter = ({ post, posts }: Prop) => {
  const currentIndex = posts.findIndex((p) => p.title === post.title);

  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  return (
    <footer className="mt-8">
      <hr className="pt-0 mt-0 border-t border-gray-200 dark:border-gray-700" />
      <div className="grid grid-cols-2 gap-4 mt-8 mb-16">
        {prevPost ? (
          <Link href={`/blog/${prevPost.categoryPublicName}/${prevPost.slug}`} className="col-start-1 no-underline">
            <Card className="h-full transition-all duration-300 ease-in-out shadow-none hover:shadow-md hover:-translate-y-1">
              <div className="flex items-center h-full overflow-hidden">
                <div className="flex-shrink-0 flex items-center justify-center p-4 ml-1">
                  <ArrowLeftCircle className="w-5 h-5" />
                </div>
                <div className="flex-grow min-w-0">
                  <CardHeader className="text-sm text-gray-500 dark:text-gray-400 pb-2 pl-1">이전 포스트</CardHeader>
                  <CardContent className="pt-0 truncate pl-1">
                    <span className="text-lg font-medium">{prevPost.title}</span>
                  </CardContent>
                </div>
              </div>
            </Card>
          </Link>
        ) : (
          <div className="col-start-1 flex items-center h-full text-gray-500 dark:text-gray-400">이전 글이 없습니다</div>
        )}

        {nextPost ? (
          <Link href={`/blog/${nextPost.categoryPublicName}/${nextPost.slug}`} className="col-start-2 no-underline">
            <Card className="h-full transition-all duration-300 ease-in-out shadow-none hover:shadow-md hover:-translate-y-1">
              <div className="flex items-center h-full overflow-hidden">
                <div className="flex-grow min-w-0">
                  <CardHeader className="text-sm text-gray-500 dark:text-gray-400 pb-2 text-right pr-1">다음 포스트</CardHeader>
                  <CardContent className="pt-0 truncate text-right pr-1">
                    <span className="text-lg font-medium">{nextPost.title}</span>
                  </CardContent>
                </div>
                <div className="flex-shrink-0 flex items-center justify-center p-4 mr-1">
                  <ArrowRightCircle className="w-5 h-5" />
                </div>
              </div>
            </Card>
          </Link>
        ) : (
          <div className="col-start-2 flex items-center justify-end h-full text-gray-500 dark:text-gray-400">다음 글이 없습니다</div>
        )}
      </div>
      <Giscus />
    </footer>
  );
};
