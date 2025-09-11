'use client';

import { Post } from '@/config/types';
import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function SeriesList({ slug, seriesList }: { slug: string; seriesList: Post[] }) {
  const [isListVisible, setIsListVisible] = useState(false);

  const toggleList = () => {
    setIsListVisible(!isListVisible);
  };

  return (
    <div className="mb-3">
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out mb-0 pb-0 ${
          isListVisible ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ol className="list-decimal list-inside space-y-1 p-0 pr-4 mt-2 mb-0 pb-0" id="series-list">
          {seriesList.map((post, index) => {
            const isCurrent = post.date.toString() === slug;
            return (
              <li
                key={post.id}
                className={`m-0 overflow-hidden text-ellipsis whitespace-nowrap ${isCurrent ? 'text-black dark:text-white' : 'text-zinc-600 dark:text-zinc-400'}`}
              >
                <Link
                  href={`/blog/${post.category}/${post.date}`}
                  className={`no-underline hover:underline ${isCurrent ? 'text-black dark:text-white font-semibold' : 'text-zinc-600 dark:text-zinc-400 font-extralight'}`}
                >
                  <span className="pl-1">{post.title}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
      <button onClick={toggleList} className={`flex items-center mt-3`} aria-expanded={isListVisible} aria-controls="series-list">
        {isListVisible ? (
          <>
            <ChevronUp className="w-4 h-4 mr-1" />
            숨기기
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4 mr-1" />
            목록보기
          </>
        )}
      </button>
    </div>
  );
}
