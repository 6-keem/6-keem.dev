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
      seriesName?: string;
      thumbnailUrl?: string;
      category?: string;
    };

    if (!meta.title?.trim()) {
      return NextResponse.json({ message: 'title is required' }, { status: 400 });
    }

    let seriesId: number | null = null;
    const seriesName = meta.seriesName?.trim();
    if (seriesName) {
      const { data: series, error: seriesErr } = await supabase.rpc('get_or_create_series', {
        series_name: seriesName,
      });
      if (seriesErr) throw seriesErr;
      seriesId = series?.id ?? null;
    }

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

    return NextResponse.json({ ok: true, data }, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ ok: false, message: e?.message ?? 'Internal Server Error' }, { status: 500 });
  }
}
