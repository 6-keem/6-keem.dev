import { cn } from '@/lib/utils';
import React from 'react';

export interface YouTubeProps {
  id: string;
  title?: string;
  start?: number;
  className?: string;
}

const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

const extractId = (raw: string): string | null => {
  if (YOUTUBE_ID_PATTERN.test(raw)) return raw;
  try {
    const url = new URL(raw);
    if (url.hostname === 'youtu.be') {
      const id = url.pathname.slice(1);
      return YOUTUBE_ID_PATTERN.test(id) ? id : null;
    }
    if (url.hostname.endsWith('youtube.com') || url.hostname.endsWith('youtube-nocookie.com')) {
      const v = url.searchParams.get('v');
      if (v && YOUTUBE_ID_PATTERN.test(v)) return v;
      const parts = url.pathname.split('/').filter(Boolean);
      const last = parts[parts.length - 1];
      if (last && YOUTUBE_ID_PATTERN.test(last)) return last;
    }
  } catch {
    return null;
  }
  return null;
};

const YouTubeImpl: React.FC<YouTubeProps> = ({ id, title, start, className }) => {
  const videoId = extractId(id);
  if (!videoId) return null;

  const params = new URLSearchParams();
  if (start && Number.isFinite(start) && start > 0) {
    params.set('start', String(Math.floor(start)));
  }
  const query = params.toString();
  const src = `https://www.youtube-nocookie.com/embed/${videoId}${query ? `?${query}` : ''}`;

  return (
    <div className={cn('my-6 aspect-video w-full overflow-hidden rounded-2xl', className)}>
      <iframe
        src={src}
        title={title ?? 'YouTube video player'}
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        referrerPolicy="strict-origin-when-cross-origin"
        loading="lazy"
        allowFullScreen
        className="h-full w-full border-0"
      />
    </div>
  );
};

export const YouTube = React.memo(YouTubeImpl);
