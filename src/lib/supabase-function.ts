import { Post } from '@/config/types';
import { supabase, supabaseAdmin } from './supabase';

type AdminOpts = { includeUnpublished?: boolean };

function mapJoinedRow(row: any): Post {
  const { post_detail, ...post } = row;
  const detail = Array.isArray(post_detail) ? post_detail[0] : post_detail;
  return mapPostRow({ post, post_detail: detail });
}

interface PostRow {
  id: number;
  title: string;
  category: string;
  description: string | null;
  date: string;
  track_id: number | null;
  thumbnail: string | null;
  published?: boolean;
}

interface PostDetailRow {
  post_id: number;
  content: string | null;
  tag: string[] | null;
}

interface PostRpcRow {
  post: PostRow;
  post_detail: PostDetailRow | null;
}

interface PostsIndexRow {
  category: string;
  post_date: string;
}

interface TrackSummaryRow {
  id: number;
  track_name: string;
  description: string | null;
  thumbnail_url: string | null;
  post_count: number | string;
  first_post_category: string;
  first_post_date: string;
  first_post_thumbnail: string;
  first_post_description: string;
}

interface TrackRow {
  id: number;
  track_name: string;
  description: string | null;
  thumbnail_url: string | null;
}

export async function getCategoryList(): Promise<string[]> {
  const { data, error } = await supabase.rpc('get_category_list');
  if (error) throw error;
  return (data ?? []) as string[];
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

function mapPostRow(item: PostRpcRow): Post {
  return {
    id: item.post.id,
    title: item.post.title,
    category: item.post.category,
    description: item.post.description ?? '',
    date: formatPostDate(item.post.date),
    trackId: item.post.track_id ?? null,
    thumbnail: item.post.thumbnail ?? '',
    published: item.post.published,
    content: item.post_detail?.content ?? '',
    tag: item.post_detail?.tag ?? [],
    post_id: item.post_detail?.post_id ?? item.post.id,
  };
}

export async function getPosts(filter_category?: string): Promise<Post[]> {
  const { data, error } = await supabase.rpc('get_posts', {
    filter_category: filter_category ?? null,
  });
  if (error) throw error;
  return ((data ?? []) as PostRpcRow[]).map(mapPostRow);
}

export async function getPostsCount(filter_category?: string, opts?: AdminOpts): Promise<number> {
  if (opts?.includeUnpublished) {
    const sb = supabaseAdmin();
    let q = sb.from('post').select('id', { count: 'exact', head: true });
    if (filter_category) q = q.eq('category', filter_category);
    const { count, error } = await q;
    if (error) throw error;
    return count ?? 0;
  }

  const { data, error } = await supabase.rpc('get_posts_count', {
    filter_category: filter_category ?? null,
  });
  if (error) throw error;
  return typeof data === 'number' ? data : Number(data ?? 0);
}

export async function getPostsLazy(
  filter_category?: string,
  limit: number = 12,
  offset: number = 0,
  opts?: AdminOpts,
): Promise<Post[]> {
  if (opts?.includeUnpublished) {
    const sb = supabaseAdmin();
    let q = sb
      .from('post')
      .select('*, post_detail:post_detail!post_detail_post_id_fkey(*)')
      .order('date', { ascending: false })
      .order('id', { ascending: false })
      .range(offset, offset + limit - 1);
    if (filter_category) q = q.eq('category', filter_category);
    const { data, error } = await q;
    if (error) throw error;
    return (data ?? []).map(mapJoinedRow);
  }

  const { data, error } = await supabase.rpc('get_posts_lazy', {
    filter_category: filter_category ?? null,
    p_limit: limit,
    p_offset: offset,
  });
  if (error) throw error;
  return ((data ?? []) as PostRpcRow[]).map(mapPostRow);
}

export async function getHeroPosts(): Promise<Post[]> {
  const { data, error } = await supabase.rpc('get_hero_posts');
  if (error) throw error;
  return ((data ?? []) as PostRpcRow[]).map(mapPostRow);
}

export async function getHotPosts(p_limit: number = 5, p_window_days: number = 7): Promise<Post[]> {
  const { data, error } = await supabase.rpc('get_hot_posts', { p_limit, p_window_days });
  if (error) throw error;
  return ((data ?? []) as PostRpcRow[]).map(mapPostRow);
}

export async function getPostsIndex(): Promise<{ category: string; slug: string }[]> {
  const { data, error } = await supabase.rpc('get_posts_index');
  if (error) throw error;
  return ((data ?? []) as PostsIndexRow[]).map((row) => ({
    category: row.category,
    slug: formatPostDate(row.post_date),
  }));
}

export async function getPostDetail(
  filter_category: string,
  filter_date: string,
  opts?: AdminOpts,
): Promise<Post[]> {
  const normalizedDate = filter_date ? filter_date.split('T')[0] : '';

  if (opts?.includeUnpublished) {
    const sb = supabaseAdmin();
    const { data, error } = await sb
      .from('post')
      .select('*, post_detail:post_detail!post_detail_post_id_fkey(*)')
      .eq('category', filter_category);
    if (error) throw error;
    const matched = (data ?? []).find((row: any) => formatPostDate(row.date) === normalizedDate);
    return matched ? [mapJoinedRow(matched)] : [];
  }

  const { data, error } = await supabase.rpc('get_post_detail', {
    filter_category,
    filter_date: normalizedDate || null,
  });
  if (error) throw error;
  return ((data ?? []) as PostRpcRow[]).map(mapPostRow);
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

  return ((data ?? []) as TrackSummaryRow[]).map((row) => ({
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
  return ((data ?? []) as PostRpcRow[]).map(mapPostRow);
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
    .single<TrackRow>();
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
