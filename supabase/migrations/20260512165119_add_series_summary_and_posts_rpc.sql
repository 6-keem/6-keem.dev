-- Series summary for the home page series section.
-- One row per series with aggregated post count and a representative first
-- post (chronologically earliest) used for the card href and thumbnail/desc
-- fallback when the series row's own fields are null.
create or replace function public.get_series_summary()
returns table (
  id bigint,
  series_name text,
  description text,
  thumbnail_url text,
  post_count bigint,
  first_post_category text,
  first_post_date timestamptz,
  first_post_thumbnail text,
  first_post_description text
)
language sql
stable
as $$
  with ranked as (
    select
      p.series_id,
      p.category,
      p.date,
      p.thumbnail,
      p.description,
      row_number() over (partition by p.series_id order by p.date asc, p.id asc) as rn,
      count(*) over (partition by p.series_id) as cnt
    from public.post p
    where p.series_id is not null and p.published = true
  )
  select
    s.id,
    s.series_name,
    s.description,
    s.thumbnail_url,
    r.cnt as post_count,
    r.category as first_post_category,
    r.date as first_post_date,
    r.thumbnail as first_post_thumbnail,
    r.description as first_post_description
  from public.series s
  join ranked r on r.series_id = s.id and r.rn = 1
  order by r.cnt desc, s.id asc;
$$;

grant execute on function public.get_series_summary() to anon, authenticated;

-- Posts belonging to a single series, used by the post detail page's series
-- navigator. Mirrors the shape returned by get_posts so the front-end can
-- reuse the same mapping code.
create or replace function public.get_series_posts(series_id bigint)
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
  where p.series_id = get_series_posts.series_id
    and p.published = true
  order by p.date asc, p.id asc;
$$;

grant execute on function public.get_series_posts(bigint) to anon, authenticated;
