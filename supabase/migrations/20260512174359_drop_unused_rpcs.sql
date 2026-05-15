-- Drop RPCs that are no longer referenced from any branch's app code.
-- Uses a DO block so we don't have to know each function's exact signature
-- (and it handles overloaded names safely).
do $$
declare r record;
begin
  for r in
    select 'drop function if exists ' || oid::regprocedure as cmd
    from pg_proc
    where proname in (
      'create_post_d',
      'create_post_t',
      'get_or_create_series',
      'get_post_detail_by_filter'
    )
      and pronamespace = 'public'::regnamespace
  loop
    execute r.cmd;
  end loop;
end$$;
