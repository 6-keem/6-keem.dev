import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

function unauthorized() {
  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}

function badRequest(message: string) {
  return NextResponse.json({ message }, { status: 400 });
}

export async function GET(_req: Request, ctx: { params: { id: string } }) {
  const session = await auth();
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || session?.user?.email !== adminEmail) return unauthorized();

  const { id: idRaw } = await ctx.params;
  const id = Number(idRaw);
  if (!Number.isFinite(id)) return badRequest('Invalid id');

  const sb = supabaseAdmin();

  const { data, error } = await sb
    .from('post')
    .select(
      `
    id,
    title,
    description,
    category,
    date,
    thumbnail,
    series_id,
    published,
    post_detail:post_detail!post_detail_post_id_fkey (
      content,
      tag,
      created_at,
      updated_at
    ),
    series:series_id (
      id,
      series_name
    )
  `
    )
    .eq('id', id)
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  if (!data) return NextResponse.json({ message: 'Not found' }, { status: 404 });

  const detail = Array.isArray(data.post_detail) ? data.post_detail[0] : data.post_detail;

  const meta = {
    title: data.title ?? '',
    desc: data.description ?? '',
    category: data.category ?? '',
    tags: detail?.tag ?? [],
    seriesName: (data.series as any)?.series_name ?? '',
    thumbnailUrl: data.thumbnail ?? '',
  };

  const content = detail?.content ?? '';

  return NextResponse.json(
    {
      ok: true,
      meta,
      content,
      post: {
        id: data.id,
        published: data.published,
        date: data.date,
        seriesId: data.series_id,
      },
    },
    { status: 200 }
  );
}

export async function PATCH(req: Request, ctx: { params: { id: string } }) {
  const session = await auth();
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || session?.user?.email !== adminEmail) return unauthorized();

  const { id: idRaw } = await ctx.params;
  const id = Number(idRaw);
  if (!Number.isFinite(id)) return badRequest('Invalid id');

  try {
    const form = await req.formData();
    const metaRaw = form.get('meta');
    const content = String(form.get('content') ?? '');
    const published = String(form.get('published') ?? 'false') === 'true';

    if (!metaRaw || typeof metaRaw !== 'string') return badRequest('meta is required');

    const meta = JSON.parse(metaRaw) as {
      title: string;
      desc: string;
      category: string;
      tags: string[];
      seriesName?: string;
      thumbnailUrl?: string;
    };

    const sb = supabaseAdmin();

    let seriesId: number | null = null;
    const seriesName = meta.seriesName?.trim();
    if (seriesName) {
      const { data: series, error: seriesErr } = await sb.rpc('get_or_create_series', {
        series_name: seriesName,
      });
      if (seriesErr) throw seriesErr;
      seriesId = series?.id ?? null;
    }

    const { error: postErr } = await sb
      .from('post')
      .update({
        title: meta.title ?? '',
        description: meta.desc ?? '',
        category: meta.category ?? '',
        thumbnail: meta.thumbnailUrl ?? '',
        series_id: seriesId,
        published,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (postErr) throw postErr;

    const { error: detailErr } = await sb.from('post_detail').upsert(
      {
        post_id: id,
        content,
        tag: meta.tags ?? [],
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'post_id' }
    );

    if (detailErr) throw detailErr;

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ ok: false, message: e?.message ?? 'Internal Server Error' }, { status: 500 });
  }
}
