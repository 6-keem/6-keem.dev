-- IP-hash dedup so view counts survive cookie clearing. Cookie remains the
-- fast-path filter on the API route; this table is the durable backstop with
-- a 24h window. We never store raw IPs — the API hashes them with a salt
-- before passing the value.

create table if not exists public.post_view_ip (
  post_id bigint references public.post(id) on delete cascade,
  ip_hash text not null,
  last_viewed_at timestamptz not null default now(),
  primary key (post_id, ip_hash)
);

create index if not exists post_view_ip_recent_idx
  on public.post_view_ip (post_id, ip_hash, last_viewed_at desc);

alter table public.post_view_ip enable row level security;
-- No SELECT policy granted to anon: the table is service-only via the RPC.

create or replace function public.increment_post_view(
  p_post_id bigint,
  p_ip_hash text default null,
  p_window_hours int default 24
)
returns boolean
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  cutoff timestamptz := now() - make_interval(hours => greatest(coalesce(p_window_hours, 24), 1));
begin
  -- Bail early if this (post, ip) pair already counted within the window.
  if p_ip_hash is not null then
    if exists (
      select 1 from public.post_view_ip
      where post_id = p_post_id
        and ip_hash = p_ip_hash
        and last_viewed_at > cutoff
    ) then
      return false;
    end if;
  end if;

  update public.post
  set view_count = view_count + 1
  where id = p_post_id and published = true;

  if not found then
    return false;
  end if;

  insert into public.post_view_daily (post_id, day, count)
  values (p_post_id, current_date, 1)
  on conflict (post_id, day)
  do update set count = public.post_view_daily.count + 1;

  if p_ip_hash is not null then
    insert into public.post_view_ip (post_id, ip_hash, last_viewed_at)
    values (p_post_id, p_ip_hash, now())
    on conflict (post_id, ip_hash)
    do update set last_viewed_at = now();
  end if;

  return true;
end;
$$;

revoke all on function public.increment_post_view(bigint, text, int) from public;
grant execute on function public.increment_post_view(bigint, text, int) to anon, authenticated;

-- Drop the older 1-arg signature so callers can't accidentally fall back to
-- the unrestricted path.
drop function if exists public.increment_post_view(bigint);
