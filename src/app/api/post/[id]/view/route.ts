import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const BOT_UA = /bot|crawler|spider|crawling|preview|slurp|fetch|monitor/i;
const COOKIE_MAX_AGE = 60 * 60 * 24;

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postId = Number(id);
  if (!Number.isFinite(postId) || postId <= 0) {
    return NextResponse.json({ ok: false, error: 'invalid id' }, { status: 400 });
  }

  const ua = req.headers.get('user-agent') ?? '';
  if (!ua || BOT_UA.test(ua)) {
    return NextResponse.json({ ok: true, skipped: 'bot' });
  }

  const cookieStore = await cookies();
  const cookieName = `vp_${postId}`;
  if (cookieStore.get(cookieName)) {
    return NextResponse.json({ ok: true, skipped: 'cookie' });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const { error } = await supabase.rpc('increment_post_view', { p_post_id: postId });
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  cookieStore.set(cookieName, '1', {
    maxAge: COOKIE_MAX_AGE,
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });

  return NextResponse.json({ ok: true });
}
