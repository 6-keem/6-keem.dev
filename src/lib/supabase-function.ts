import { Post, SeriesInfo } from '@/config/types';
import { createClient } from '@supabase/supabase-js';
import { getBaseUrl } from './base-url';
import { internalGet } from '@/lib/internal-fetch';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function getCategoryList() {
  const { data, error } = await supabase.rpc('get_category_list');
  if (error) throw error;
  return data;
}

function mapPosts(data: any[]): Post[] {
  return (data ?? []).map((item: any) => ({
    id: item.post.id,
    title: item.post.title,
    category: item.post.category,
    description: item.post.description,
    date: new Date(item.post.date).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replaceAll('/', '-'),
    series_id: item.post.series_id,
    thumbnail: item.post.thumbnail,
    content: item.post_detail?.content ?? '',
    tag: item.post_detail?.tag ?? [],
    post_id: item.post_detail?.post_id ?? item.post.id,
  }));
}

export async function getPosts(filter_category?: string) {
  const qs = new URLSearchParams();
  if (filter_category) qs.set('category', filter_category);

  const path = qs.toString() ? `/api/posts?${qs.toString()}` : `/api/posts`;

  const res = await internalGet(path);
  if (!res.ok) throw new Error(await res.text());

  const json = await res.json();
  return mapPosts(json.data ?? []);
}

export async function getPostsLazy(filter_category?: string, limit: number = 12, offset: number = 0) {
  const BASE_URL = getBaseUrl();
  const qs = new URLSearchParams();
  if (filter_category) qs.set('category', filter_category);
  qs.set('limit', String(limit));
  qs.set('offset', String(offset));

  const url = `${BASE_URL}/api/posts?${qs.toString()}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(await res.text());

  const json = await res.json();
  return mapPosts(json.data ?? []);
}

export async function getPostDetail(filter_category: string, filter_date: string) {
  const BASE_URL = getBaseUrl();
  const date = filter_date ? filter_date.split('T')[0] : '';
  const qs = new URLSearchParams({ category: filter_category, date });

  const url = `${BASE_URL}/api/posts/detail?${qs.toString()}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(await res.text());

  const json = await res.json();
  const item = json.data;

  return [
    {
      id: item.post.id,
      title: item.post.title,
      category: item.post.category,
      description: item.post.description,
      date: new Date(item.post.date)
        .toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })
        .replaceAll('/', '-'),
      series_id: item.post.series_id,
      thumbnail: item.post.thumbnail,
      content: item.post_detail?.content ?? '',
      tag: item.post_detail?.tag ?? [],
      post_id: item.post_detail?.post_id ?? item.post.id,
    },
  ] as Post[];
}

export async function getSeriesInfo(series_id: number) {
  const { data, error } = await supabase.rpc('get_series_name', { series_id });
  if (error) console.error(error);

  const series_info: SeriesInfo = {
    id: data.id,
    series_name: data.series_name,
  };
  return series_info;
}

export async function getVariables(p_key: string): Promise<string | undefined> {
  const { data, error } = await supabase.rpc('get_variables', { p_key });
  if (error) console.error(error);

  if (Array.isArray(data) && data.length > 0) return data[0];
  return undefined;
}
