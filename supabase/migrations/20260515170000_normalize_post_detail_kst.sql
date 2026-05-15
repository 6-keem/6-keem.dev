-- Switch slug matching to Asia/Seoul so the displayed date and the URL slug
-- both reflect the author's local intent (e.g. a 2026-03-02 00:30 KST post
-- stays on 2026-03-02 instead of slipping to 2026-03-01 under UTC).

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
