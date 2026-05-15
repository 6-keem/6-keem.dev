-- Lightweight (category, date) index for generateStaticParams.
-- Returning only the two fields needed for URL params keeps the payload
-- tiny vs. fetching full post rows at build/revalidate time.

create or replace function public.get_posts_index()
returns table (
  category text,
  post_date timestamptz
)
language sql
stable
as $$
  select p.category, p.date
  from public.post p
  where p.published = true;
$$;

grant execute on function public.get_posts_index() to anon, authenticated;
