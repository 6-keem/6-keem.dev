import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const date = searchParams.get('date');

  if (!category || !date) {
    return NextResponse.json({ ok: false, message: 'category and date are required' }, { status: 400 });
  }

  const session = await auth();
  const adminEmail = process.env.ADMIN_EMAIL;
  const isAdmin = !!(adminEmail && session?.user?.email === adminEmail);

  const sb = supabaseAdmin();

  const { data, error } = await sb.rpc('get_post_detail', {
    filter_category: category,
    filter_date: date,
  });

  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 });

  const item = (data ?? [])[0];
  if (!item) return NextResponse.json({ ok: false, message: 'Not found' }, { status: 404 });

  if (!isAdmin && item?.post?.published === false) {
    return NextResponse.json({ ok: false, message: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, data: item }, { status: 200 });
}
