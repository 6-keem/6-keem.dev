-- create_post RPC was missed by the earlier series → track rename:
-- its parameter is still `series_id` and its body still INSERTs into the
-- non-existent `series_id` column. Drop + recreate with `track_id`.

drop function if exists public.create_post(text, text, text, text, text, text, integer, timestamp, boolean);

create or replace function public.create_post(
  title text,
  description text,
  category text,
  thumbnail text,
  content text,
  tag text,
  track_id integer,
  date timestamp,
  published boolean
)
returns json
language plpgsql
as $$
declare
  new_post_id bigint;
  result json;
begin
  insert into public.post(title, description, category, date, track_id, thumbnail, published)
  values (title, description, category, date, track_id, thumbnail, published)
  returning id into new_post_id;

  insert into public.post_detail(post_id, content, tag)
  values (new_post_id, content, string_to_array(tag, ','));

  select json_build_object(
    'post', row_to_json(p),
    'post_detail', (
      select row_to_json(d)
      from public.post_detail d
      where d.post_id = new_post_id
      limit 1
    )
  )
  into result
  from public.post p
  where p.id = new_post_id;

  return result;
end;
$$;
