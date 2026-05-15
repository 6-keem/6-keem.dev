-- Daily view bucket for windowed HOT ranking. post.view_count stays as the
-- lifetime counter (used for display); HOT ranking now uses a SUM over the
-- last N days from this table so old posts don't dominate forever.

create table if not exists public.post_view_daily (
  post_id bigint not null references public.post(id) on delete cascade,
  day date not null,
  count int not null default 0,
  primary key (post_id, day)
);

create index if not exists post_view_daily_day_idx
  on public.post_view_daily (day desc);

alter table public.post_view_daily enable row level security;

drop policy if exists "post_view_daily is readable by anyone" on public.post_view_daily;
create policy "post_view_daily is readable by anyone"
  on public.post_view_daily
  for select
  to anon, authenticated
  using (true);

-- Replace increment_post_view: bump lifetime counter AND upsert today's bucket.
create or replace function public.increment_post_view(p_post_id bigint)
returns void
language plpgsql
volatile
as $$
begin
  update public.post
  set view_count = view_count + 1
  where id = p_post_id and published = true;

  if not found then
    return;
  end if;

  insert into public.post_view_daily (post_id, day, count)
  values (p_post_id, current_date, 1)
  on conflict (post_id, day)
  do update set count = public.post_view_daily.count + 1;
end;
$$;

grant execute on function public.increment_post_view(bigint) to anon, authenticated;

-- Replace get_hot_posts: rank by SUM of daily counts within the window.
-- Posts with zero views in the window fall back to date desc so the slot
-- isn't empty for fresh content.
drop function if exists public.get_hot_posts(int);

create or replace function public.get_hot_posts(
  p_limit int default 5,
  p_window_days int default 7
)
returns table (
  post jsonb,
  post_detail jsonb
)
language sql
stable
as $$
  with windowed as (
    select post_id, sum(count)::bigint as views
    from public.post_view_daily
    where day >= current_date - greatest(coalesce(p_window_days, 7) - 1, 0)
    group by post_id
  )
  select
    to_jsonb(p) as post,
    to_jsonb(pd) as post_detail
  from public.post p
  left join public.post_detail pd on pd.post_id = p.id
  left join windowed w on w.post_id = p.id
  where p.published = true
  order by coalesce(w.views, 0) desc, p.date desc, p.id desc
  limit greatest(coalesce(p_limit, 5), 0);
$$;

grant execute on function public.get_hot_posts(int, int) to anon, authenticated;
