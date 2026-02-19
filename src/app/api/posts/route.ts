import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');

  const session = await auth();
  const adminEmail = process.env.ADMIN_EMAIL;

  const isAdmin = !!(adminEmail && session?.user?.email === adminEmail);

  const sb = supabaseAdmin();

  const { data, error } = await sb.rpc('get_posts', {
    filter_category: category ?? null,
  });

  if (error) {
    console.error(error);
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }
  const rows = (data ?? []).filter((item: any) => isAdmin || item?.post?.published === true);

  return NextResponse.json({ ok: true, data: rows, isAdmin }, { status: 200 });
}
