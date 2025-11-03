'use client';
import Link from 'next/link';
import type { Post } from '@/config/types';
import { useState, useRef, useEffect } from 'react';

interface Props {
  post: Post;
}

const darkenColor = (hexColor: string, factor = 0.6): string => {
  const hex = hexColor.replace('#', '');
  const r = Math.max(0, Math.round(Number.parseInt(hex.substring(0, 2), 16) * (1 - factor)));
  const g = Math.max(0, Math.round(Number.parseInt(hex.substring(2, 4), 16) * (1 - factor)));
  const b = Math.max(0, Math.round(Number.parseInt(hex.substring(4, 6), 16) * (1 - factor)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};

const PostCard = ({ post }: Props) => {
  const [dominantColor, setDominantColor] = useState<string>('#d4d4d8');
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const extractDominantColor = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        ctx.drawImage(img, 0, 0, 100, 100);
        const imageData = ctx.getImageData(0, 0, 100, 100);
        const data = imageData.data;

        let r = 0,
          g = 0,
          b = 0;
        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
        }

        const pixelCount = data.length / 4;
        r = Math.round(r / pixelCount);
        g = Math.round(g / pixelCount);
        b = Math.round(b / pixelCount);

        const hexColor = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        setDominantColor(hexColor);
      } catch (err) {
        console.error('Failed to extract dominant color:', err);
      }
    };

    if (img.complete) {
      extractDominantColor();
    } else {
      img.addEventListener('load', extractDominantColor);
      return () => img.removeEventListener('load', extractDominantColor);
    }
  }, []);

  return (
    <Link href={`/blog/${post.category}/${post.date.toString()}`} className="group">
      <li className="flex flex-col w-full gap-3 py-2 px-2">
        <div
          className="
            flex flex-col w-full aspect-square overflow-hidden rounded-2xl 
            shadow-md hover:shadow-2xl 
            transition-all duration-300 
            hover:-translate-y-2
          "
        >
          <div className="w-full h-[55%]">
            <img
              ref={imgRef}
              src={post.thumbnail || '/placeholder.svg'}
              alt={`thumbnail for ${post.title}`}
              style={{ objectFit: 'cover' }}
              className="w-full h-full"
              crossOrigin="anonymous"
            />
          </div>
          <div
            className="w-full h-[45%] p-4 text-foreground flex flex-col justify-between"
            style={{
              background: `linear-gradient(
                            0deg, 
                            ${darkenColor(dominantColor, 0.9)} 0%, 
                            ${darkenColor(dominantColor, 0.6)} 90%
                          )`,
            }}
          >
            <div className="flex flex-col space-y-1">
              <div className="flex items-center text-sm font-normal text-gray-200 dark:text-gray-300">{post.category}</div>
              <div className="line-clamp-2">
                <p className="font-bold text-lg text-gray-100 dark:text-gray-50 group-hover:text-blue-400 dark:group-hover:text-blue-500 transition-colors duration-300">
                  {post.title}
                </p>
              </div>
            </div>
            <div className="flex text-sm gap-3 text-gray-100 dark:text-gray-50">
              <div className="flex items-center text-sm font-normal text-foreground-500">{post.date.toString()}</div>
            </div>
          </div>
        </div>
      </li>
    </Link>
  );
};

export default PostCard;
