-- Consolidate the category taxonomy down to two buckets and drop the
-- chrome-extension posts entirely. Runs inside a single transaction so the
-- post.category text values and the category catalog rows stay consistent.

begin;

-- 1) Delete chrome-extension posts (and their detail rows) outright.
delete from public.post_detail
where post_id in (select id from public.post where category = 'chrome-extension');

delete from public.post where category = 'chrome-extension';

-- 2) Rename Daily -> Daily Life and merge AI/Backend/Frontend -> Engineering
--    on the post.category text values.
update public.post set category = 'Daily Life' where category = 'Daily';
update public.post set category = 'Engineering' where category in ('AI', 'Backend', 'Frontend');

-- 3) Sync the category catalog table.
delete from public.category where name = 'chrome-extension';

update public.category set name = 'Daily Life' where name = 'Daily';

-- Pick Backend as the survivor row to rename into Engineering (it has the
-- richest metadata if anything was filled in). Then drop the now-redundant
-- AI / Frontend rows.
update public.category set name = 'Engineering' where name = 'Backend';
delete from public.category where name in ('AI', 'Frontend');

commit;
