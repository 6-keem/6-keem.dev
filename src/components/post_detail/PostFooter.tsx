import { Post } from '@/config/types';
import Track from '../mdx/Track';
import { getTrackDetail, getTrackPosts } from '@/lib/supabase-function';
import { Giscus } from './Giscus';

interface Props {
  currentPost: Post;
}

export const PostFooter = async ({ currentPost }: Props) => {
  let trackPosts: Post[] = [];
  let trackName: string | null = null;
  let trackDescription: string | null = null;
  if (currentPost.trackId) {
    const [posts, detail] = await Promise.all([
      getTrackPosts(currentPost.trackId),
      getTrackDetail(currentPost.trackId),
    ]);
    trackPosts = posts;
    trackName = detail?.trackName ?? null;
    trackDescription = detail?.description ?? null;
  }

  return (
    <footer className="mt-8">
      <hr className="pt-0 mt-0 border-t border-gray-200 dark:border-gray-700" />
      {trackName && currentPost.trackId ? (
        <div className="mt-8">
          <Track
            trackId={currentPost.trackId}
            trackName={trackName}
            description={trackDescription}
            slug={currentPost.date}
            posts={trackPosts}
          />
        </div>
      ) : null}
      <div className="mt-8 mb-16" />
      <Giscus />
    </footer>
  );
};
