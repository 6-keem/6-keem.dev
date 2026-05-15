-- get_post_detail's existing date matching used implicit session TZ which
-- diverged from the JS-formatted slug across environments (UTC on Vercel,
-- KST in local dev). Normalize both sides to UTC so the slug → row lookup
-- is environment-independent.

do $$
declare r record;
begin
  for r in
    select 'drop function if exists ' || oid::regprocedure as cmd
    from pg_proc
    where proname = 'get_post_detail'
      and pronamespace = 'public'::regnamespace
  loop
    execute r.cmd;
  end loop;
end$$;

create or replace function public.get_post_detail(
  filter_category text,
  filter_date text
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
    and p.category = filter_category
    and to_char((p.date at time zone 'UTC')::date, 'YYYY-MM-DD') = filter_date;
$$;

grant execute on function public.get_post_detail(text, text) to anon, authenticated;
