-- Tail end of the Series → Track rename. Application code already calls
-- everything "track"; the DB still carried the series naming. This brings
-- the schema in line: table series → track, series.series_name → track_name,
-- post.series_id → post.track_id, and the dependent RPCs are recreated
-- with track-flavoured names + parameters.

alter table public.post rename column series_id to track_id;
alter table public.series rename column series_name to track_name;
alter table public.series rename to track;

-- Drop the old series RPCs so we can recreate them under track names.
drop function if exists public.get_series_summary();
drop function if exists public.get_series_posts(bigint);
drop function if exists public.get_series_name(bigint);

create or replace function public.get_track_summary()
returns table (
  id bigint,
  track_name text,
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
      p.track_id,
      p.category,
      p.date,
      p.thumbnail,
      p.description,
      row_number() over (partition by p.track_id order by p.date asc, p.id asc) as rn,
      count(*) over (partition by p.track_id) as cnt
    from public.post p
    where p.track_id is not null and p.published = true
  )
  select
    t.id,
    t.track_name,
    t.description,
    t.thumbnail_url,
    r.cnt as post_count,
    r.category as first_post_category,
    r.date as first_post_date,
    r.thumbnail as first_post_thumbnail,
    r.description as first_post_description
  from public.track t
  join ranked r on r.track_id = t.id and r.rn = 1
  order by r.cnt desc, t.id asc;
$$;

grant execute on function public.get_track_summary() to anon, authenticated;

create or replace function public.get_track_posts(track_id bigint)
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
  where p.track_id = get_track_posts.track_id
    and p.published = true
  order by p.date asc, p.id asc;
$$;

grant execute on function public.get_track_posts(bigint) to anon, authenticated;
