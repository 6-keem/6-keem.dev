import Image from 'next/image';
import Link from 'next/link';

import { Post } from '@/config/types';
interface Props {
  post: Post;
  isMain?: boolean;
}

const PostCard = ({ post, isMain }: Props) => {
  return (
    <Link href={`/blog/${post.category}/${post.date.toString()}`} className={`${!isMain && 'mb-4'}`}>
      <li className="flex flex-col w-full gap-3 overflow-hidden rounded-md transition py-2 px-2">
        <div className={`relative w-full rounded-md overflow-hidden aspect-square ${isMain ? 'lg:aspect-[7/4]' : 'aspect-square'}`}>
          <Image src={post.thumbnail} alt={`thumbnail for ${post.title}`} fill style={{ objectFit: 'cover' }} priority />
        </div>
        <div className="w-full flex flex-col justify-between overflow-hidden gap-1">
          <div className="flex-1">
            <p className={`mt-1 mb-2 font-medium ${isMain ? 'text-3xl lg:text-5xl' : 'text-lg'}`}>{post.title}</p>
          </div>
          <div className="flex text-sm gap-3 text-gray-500 dark:text-gray-400">
            <div className="flex items-center text-sm font-normal text-foreground">{post.category}</div>
            <div className="flex items-center text-sm font-normal text-foreground-500">{post.date.toString()}</div>
          </div>
        </div>
      </li>
    </Link>
  );
};

export default PostCard;
