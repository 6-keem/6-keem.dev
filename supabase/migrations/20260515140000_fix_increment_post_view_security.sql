-- increment_post_view runs from an anon API route; under invoker rights the
-- UPDATE on public.post and the upsert on public.post_view_daily get filtered
-- out by RLS (no write policy for anon) and the function silently does
-- nothing. Switch to SECURITY DEFINER so it runs with the function owner's
-- rights and bypasses RLS for the increment path only.

create or replace function public.increment_post_view(p_post_id bigint)
returns void
language plpgsql
volatile
security definer
set search_path = public
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

revoke all on function public.increment_post_view(bigint) from public;
grant execute on function public.increment_post_view(bigint) to anon, authenticated;
