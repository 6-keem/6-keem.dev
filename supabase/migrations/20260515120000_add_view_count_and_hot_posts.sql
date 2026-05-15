-- view_count column + HOT posts RPC + per-post view increment RPC.
-- HOT is currently lifetime-count based; layer a recency window later if
-- old posts dominate the ranking.

alter table public.post
  add column if not exists view_count bigint not null default 0;

create index if not exists post_view_count_idx
  on public.post (view_count desc, date desc, id desc);

create or replace function public.increment_post_view(p_post_id bigint)
returns void
language sql
volatile
as $$
  update public.post
  set view_count = view_count + 1
  where id = p_post_id and published = true;
$$;

grant execute on function public.increment_post_view(bigint) to anon, authenticated;

create or replace function public.get_hot_posts(p_limit int default 5)
returns table (
  post jsonb,
  post_detail jsonb
)
language sql
stable
as $$
  select
    to_jsonb(p) as post,
    to_jsonb(pd) as post_detail
  from public.post p
  left join public.post_detail pd on pd.post_id = p.id
  where p.published = true
  order by p.view_count desc, p.date desc, p.id desc
  limit greatest(coalesce(p_limit, 5), 0);
$$;

grant execute on function public.get_hot_posts(int) to anon, authenticated;
