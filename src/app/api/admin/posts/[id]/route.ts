import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

function unauthorized() {
  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}

function badRequest(message: string) {
  return NextResponse.json({ message }, { status: 400 });
}

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || session?.user?.email !== adminEmail) return unauthorized();

  const { id: idRaw } = await context.params;
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
    track_id,
    published,
    post_detail:post_detail!post_detail_post_id_fkey (
      content,
      tag,
      created_at,
      updated_at
    ),
    track:track_id (
      id,
      track_name
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

  const { data: heroRow } = await sb.from('hero_post').select('id').eq('post_id', id).maybeSingle();

  const meta = {
    title: data.title ?? '',
    desc: data.description ?? '',
    category: data.category ?? '',
    tags: detail?.tag ?? [],
    trackId: data.track_id ?? null,
    trackName: (data.track as any)?.track_name ?? '',
    thumbnailUrl: data.thumbnail ?? '',
    isHero: !!heroRow,
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
        trackId: data.track_id,
      },
    },
    { status: 200 }
  );
}

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || session?.user?.email !== adminEmail) return unauthorized();

  const { id: idRaw } = await context.params;
  const id = Number(idRaw);
  if (!Number.isFinite(id)) return badRequest('Invalid id');

  const sb = supabaseAdmin();

  const { error: detailErr } = await sb.from('post_detail').delete().eq('post_id', id);
  if (detailErr) {
    console.error(detailErr);
    return NextResponse.json({ message: detailErr.message }, { status: 500 });
  }

  const { error: postErr } = await sb.from('post').delete().eq('id', id);
  if (postErr) {
    console.error(postErr);
    return NextResponse.json({ message: postErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || session?.user?.email !== adminEmail) return unauthorized();

  const { id: idRaw } = await context.params;
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
      trackId?: number | null;
      thumbnailUrl?: string;
      isHero?: boolean;
    };

    const sb = supabaseAdmin();
    const trackId = meta.trackId ?? null;

    const { error: postErr } = await sb
      .from('post')
      .update({
        title: meta.title ?? '',
        description: meta.desc ?? '',
        category: meta.category?.trim() || 'Daily',
        thumbnail: meta.thumbnailUrl ?? '',
        track_id: trackId,
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

    if (meta.isHero) {
      const { error: heroErr } = await sb
        .from('hero_post')
        .upsert({ post_id: id }, { onConflict: 'post_id' });
      if (heroErr) throw heroErr;
    } else {
      const { error: heroErr } = await sb.from('hero_post').delete().eq('post_id', id);
      if (heroErr) throw heroErr;
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ ok: false, message: e?.message ?? 'Internal Server Error' }, { status: 500 });
  }
}
