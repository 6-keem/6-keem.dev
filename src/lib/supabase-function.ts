import { Post } from '@/config/types';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function getCategoryList() {
  const { data, error } = await supabase.rpc('get_category_list');
  if (error) throw error;
  return data;
}

function formatPostDate(raw: string): string {
  return new Date(raw)
    .toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'Asia/Seoul',
    })
    .replaceAll('/', '-');
}

function mapPostRow(item: any): Post {
  return {
    id: item.post.id,
    title: item.post.title,
    category: item.post.category,
    description: item.post.description,
    date: formatPostDate(item.post.date),
    trackId: item.post.track_id ?? null,
    thumbnail: item.post.thumbnail,
    content: item.post_detail?.content ?? '',
    tag: item.post_detail?.tag ?? [],
    post_id: item.post_detail?.post_id ?? item.post.id,
  };
}

export async function getPosts(filter_category?: string) {
  const { data, error } = await supabase.rpc('get_posts', {
    filter_category: filter_category ?? null,
  });
  if (error) throw error;
  return (data ?? []).map(mapPostRow);
}

export async function getPostsCount(filter_category?: string): Promise<number> {
  const { data, error } = await supabase.rpc('get_posts_count', {
    filter_category: filter_category ?? null,
  });
  if (error) throw error;
  return typeof data === 'number' ? data : Number(data ?? 0);
}

export async function getPostsLazy(filter_category?: string, limit: number = 12, offset: number = 0) {
  const { data, error } = await supabase.rpc('get_posts_lazy', {
    filter_category: filter_category ?? null,
    p_limit: limit,
    p_offset: offset,
  });
  if (error) throw error;
  return (data ?? []).map(mapPostRow);
}

export async function getHeroPosts(): Promise<Post[]> {
  const { data, error } = await supabase.rpc('get_hero_posts');
  if (error) throw error;
  return (data ?? []).map(mapPostRow);
}

export async function getHotPosts(p_limit: number = 5, p_window_days: number = 7): Promise<Post[]> {
  const { data, error } = await supabase.rpc('get_hot_posts', { p_limit, p_window_days });
  if (error) throw error;
  return (data ?? []).map(mapPostRow);
}

export async function getPostsIndex(): Promise<{ category: string; slug: string }[]> {
  const { data, error } = await supabase.rpc('get_posts_index');
  if (error) throw error;
  return (data ?? []).map((row: { category: string; post_date: string }) => ({
    category: row.category,
    slug: formatPostDate(row.post_date),
  }));
}

export async function getPostDetail(filter_category: string, filter_date: string) {
  const { data, error } = await supabase.rpc('get_post_detail', {
    filter_category,
    filter_date: filter_date ? filter_date.split('T')[0] : null,
  });
  if (error) throw error;
  return (data ?? []).map(mapPostRow);
}

export interface TrackSummary {
  id: number;
  trackName: string;
  description: string | null;
  thumbnailUrl: string | null;
  postCount: number;
  firstPostCategory: string;
  firstPostDate: string;
  firstPostThumbnail: string;
  firstPostDescription: string;
}

export async function getTrackSummary(): Promise<TrackSummary[]> {
  const { data, error } = await supabase.rpc('get_track_summary');
  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    id: row.id,
    trackName: row.track_name,
    description: row.description,
    thumbnailUrl: row.thumbnail_url,
    postCount: Number(row.post_count),
    firstPostCategory: row.first_post_category,
    firstPostDate: row.first_post_date,
    firstPostThumbnail: row.first_post_thumbnail,
    firstPostDescription: row.first_post_description,
  }));
}

export async function getTrackPosts(trackId: number): Promise<Post[]> {
  const { data, error } = await supabase.rpc('get_track_posts', { track_id: trackId });
  if (error) throw error;
  return (data ?? []).map(mapPostRow);
}

export interface TrackDetail {
  id: number;
  trackName: string;
  description: string | null;
  thumbnailUrl: string | null;
}

export async function getTrackDetail(trackId: number): Promise<TrackDetail | null> {
  const { data, error } = await supabase
    .from('track')
    .select('id, track_name, description, thumbnail_url')
    .eq('id', trackId)
    .single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return {
    id: data.id,
    trackName: data.track_name,
    description: data.description,
    thumbnailUrl: data.thumbnail_url,
  };
}

