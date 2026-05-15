-- Drop RPCs that no longer have a client. get_random_posts was replaced by
-- get_hot_posts; get_variables had no live caller after the about page
-- stopped fetching resume_url through it.
drop function if exists public.get_random_posts(int);
drop function if exists public.get_variables(text);

-- Tighten get_post_detail: it previously returned rows regardless of
-- published flag, so a direct-URL hit could surface a draft. The slug-key
-- match (category + KST date) and now `published = true` collectively gate
-- the row to the same set the list pages expose.
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
    and to_char((p.date at time zone 'Asia/Seoul')::date, 'YYYY-MM-DD') = filter_date;
$$;

grant execute on function public.get_post_detail(text, text) to anon, authenticated;
