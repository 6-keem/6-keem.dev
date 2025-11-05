import { Post, SeriesInfo } from '@/config/types';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function getCategoryList() {
  const { data, error } = await supabase.rpc('get_category_list');
  if (error) throw error;
  return data;
}

export async function getPosts(filter_category?: string) {
  const { data, error } = await supabase.rpc('get_posts', {
    filter_category: filter_category ?? null,
  });
  if (error) throw error;

  const mapped: Post[] = (data ?? []).map((item: any) => ({
    id: item.post.id,
    title: item.post.title,
    category: item.post.category,
    description: item.post.description,
    date: new Date(item.post.date)
      .toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .replaceAll('/', '-'),
    series_id: item.post.series_id,
    thumbnail: item.post.thumbnail,
    content: item.post_detail?.content ?? '',
    tag: item.post_detail?.tag ?? [],
    post_id: item.post_detail?.post_id ?? item.post.id,
  }));

  return mapped;
}

export async function getPostsLazy(filter_category?: string, limit: number = 12, offset: number = 0) {
  const { data, error } = await supabase.rpc('get_posts', {
    filter_category: filter_category ?? null,
    p_limit: limit,
    p_offset: offset,
  });
  if (error) throw error;

  const mapped: Post[] = (data ?? []).map((item: any) => ({
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

  return mapped;
}

export async function getPostDetail(filter_category: string, filter_date: string) {
  const { data, error } = await supabase.rpc('get_post_detail', {
    filter_category,
    filter_date: filter_date ? filter_date.split('T')[0] : null,
  });
  if (error) throw error;
  const mapped: Post[] = (data ?? []).map((item: any) => ({
    id: item.post.id,
    title: item.post.title,
    category: item.post.category,
    description: item.post.description,
    date: new Date(item.post.date)
      .toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .replaceAll('/', '-'),
    series_id: item.post.series_id,
    thumbnail: item.post.thumbnail,
    content: item.post_detail?.content ?? '',
    tag: item.post_detail?.tag ?? [],
    post_id: item.post_detail?.post_id ?? item.post.id,
  }));

  return mapped;
}

export async function getSeriesInfo(series_id: number) {
  const { data, error } = await supabase.rpc('get_series_name', {
    series_id,
  });
  if (error) console.error(error);

  const series_info: SeriesInfo = {
    id: data.id,
    series_name: data.series_name,
  };
  return series_info;
}

export async function getVariables(p_key: string): Promise<string | undefined> {
  const { data, error } = await supabase.rpc('get_variables', {
    p_key,
  });
  if (error) console.error(error);

  if (Array.isArray(data) && data.length > 0) {
    return data[0];
  }

  return undefined;
}
