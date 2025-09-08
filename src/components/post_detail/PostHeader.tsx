import { Post } from '@/config/types';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  post: Post;
}

export const PostHeader = ({ post }: Props) => {
  return (
    <header className="my-14 text-center space-y-8">
      <div className="flex justify-center items-center gap-4 text-sm text-foreground">
        <div className="flex items-center gap-1 font-semibold">
          <span>{post.dateString}</span>
        </div>
        <div className="flex items-center text-base ">
          <Link
            href={`/blog/${post.categoryPath}`}
            className=" transition-colors duration-300 text-text-unselected hover:text-text-hovered no-underline"
          >
            {post.categoryPublicName}
          </Link>
        </div>
      </div>
      <p className="text-foreground font-medium mb-5 text-5xl">{post.title}</p>
      <div className="text-lg font-light text-foreground">{post.desc}</div>
      <div className="w-full py-4">
        <Image src={post.thumbnail} alt={post.title} width={1080} height={400} className="rounded-2xl object-cover" />
      </div>
    </header>
  );
};
