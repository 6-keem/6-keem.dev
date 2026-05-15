import { createHash } from 'crypto';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const BOT_UA = /bot|crawler|spider|crawling|preview|slurp|fetch|monitor/i;
const COOKIE_MAX_AGE = 60 * 60 * 24;
const IP_WINDOW_HOURS = 24;

function clientIp(req: NextRequest): string | null {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() || null;
  return req.headers.get('x-real-ip') || null;
}

function hashIp(ip: string): string | null {
  const salt = process.env.VIEW_IP_SALT;
  if (!salt) return null;
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex');
}

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

  const ip = clientIp(req);
  const ipHash = ip ? hashIp(ip) : null;

  const { data, error } = await supabase.rpc('increment_post_view', {
    p_post_id: postId,
    p_ip_hash: ipHash,
    p_window_hours: IP_WINDOW_HOURS,
  });
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  // Always set the cookie — even when the DB skipped (data === false) — so
  // subsequent requests from the same browser hit the fast path.
  cookieStore.set(cookieName, '1', {
    maxAge: COOKIE_MAX_AGE,
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });

  return NextResponse.json({ ok: true, counted: data === true });
}
