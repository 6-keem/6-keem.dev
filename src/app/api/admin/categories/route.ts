import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

function unauthorized() {
  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}

async function requireAdmin() {
  const session = await auth();
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || session?.user?.email !== adminEmail) return false;
  return true;
}

export async function GET() {
  if (!(await requireAdmin())) return unauthorized();

  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from('category')
    .select('id, name, description, thumbnail_url')
    .order('name', { ascending: true });

  if (error) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, data: data ?? [] }, { status: 200 });
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) return unauthorized();

  let body: { name?: string; description?: string | null; thumbnail_url?: string | null };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }

  const name = body.name?.trim();
  if (!name) return NextResponse.json({ message: 'name is required' }, { status: 400 });

  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from('category')
    .insert({
      name,
      description: body.description?.trim() || null,
      thumbnail_url: body.thumbnail_url?.trim() || null,
    })
    .select('id, name, description, thumbnail_url')
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, data }, { status: 201 });
}
