import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Lazy singleton: Next collects API-route module info during build before
// .env is available, so eagerly constructing the client at import time
// throws "supabaseUrl is required" and breaks the build. Defer creation
// until first use via a Proxy that proxies every access to the real client.
let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (_client) return _client;
  _client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  return _client;
}

export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return Reflect.get(getClient() as unknown as object, prop, getClient());
  },
});

export const supabaseAdmin = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
};
