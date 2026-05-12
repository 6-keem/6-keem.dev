import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  const supabase = supabaseAdmin();
  const session = await auth();
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || session?.user?.email !== adminEmail) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const form = await req.formData();

    const metaRaw = form.get('meta');
    const content = String(form.get('content') ?? '');
    const published = String(form.get('published') ?? 'false') === 'true';

    if (!metaRaw || typeof metaRaw !== 'string') {
      return NextResponse.json({ message: 'meta is required' }, { status: 400 });
    }

    const meta = JSON.parse(metaRaw) as {
      title: string;
      desc: string;
      tags: string[];
      seriesId?: number | null;
      thumbnailUrl?: string;
      category?: string;
      isHero?: boolean;
    };

    if (!meta.title?.trim()) {
      return NextResponse.json({ message: 'title is required' }, { status: 400 });
    }

    const seriesId = meta.seriesId ?? null;

    const { data, error } = await supabase.rpc('create_post', {
      title: meta.title,
      description: meta.desc ?? '',
      category: meta.category ?? 'Daily',
      date: new Date().toISOString(),
      series_id: seriesId,
      thumbnail: meta.thumbnailUrl ?? '',
      content,
      tag: (meta.tags ?? []).join(','),
      published,
    });

    if (error) throw error;

    const newPostId = (data as any)?.id ?? (data as any)?.post_id ?? null;
    if (newPostId && meta.isHero) {
      const { error: heroErr } = await supabase
        .from('hero_post')
        .upsert({ post_id: newPostId }, { onConflict: 'post_id' });
      if (heroErr) console.error('hero_post insert failed', heroErr);
    }

    return NextResponse.json({ ok: true, data }, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ ok: false, message: e?.message ?? 'Internal Server Error' }, { status: 500 });
  }
}
