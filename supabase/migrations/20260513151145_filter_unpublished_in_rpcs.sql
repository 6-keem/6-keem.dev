-- The existing get_posts / get_posts_count / get_posts_lazy RPCs predate
-- this repo's migration tracking and return unpublished posts. Rebuild
-- them with `where p.published = true` and keep the same call signatures
-- the front-end uses.
--
-- get_post_detail is intentionally left alone here: it depends on the
-- post.date timezone-matching logic that we don't fully know yet, and
-- since it always targets a single known slug the risk of leakage is low.
-- A follow-up will tighten it after we confirm the matching rule.

do $$
declare r record;
begin
  for r in
    select 'drop function if exists ' || oid::regprocedure as cmd
    from pg_proc
    where proname in ('get_posts', 'get_posts_count', 'get_posts_lazy')
      and pronamespace = 'public'::regnamespace
  loop
    execute r.cmd;
  end loop;
end$$;

create or replace function public.get_posts(filter_category text default null)
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
    and (filter_category is null or p.category = filter_category)
  order by p.date desc, p.id desc;
$$;

create or replace function public.get_posts_count(filter_category text default null)
returns bigint
language sql
stable
as $$
  select count(*)::bigint
  from public.post p
  where p.published = true
    and (filter_category is null or p.category = filter_category);
$$;

create or replace function public.get_posts_lazy(
  filter_category text default null,
  p_limit int default 12,
  p_offset int default 0
)
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
    and (filter_category is null or p.category = filter_category)
  order by p.date desc, p.id desc
  limit greatest(coalesce(p_limit, 12), 0)
  offset greatest(coalesce(p_offset, 0), 0);
$$;

grant execute on function public.get_posts(text) to anon, authenticated;
grant execute on function public.get_posts_count(text) to anon, authenticated;
grant execute on function public.get_posts_lazy(text, int, int) to anon, authenticated;
