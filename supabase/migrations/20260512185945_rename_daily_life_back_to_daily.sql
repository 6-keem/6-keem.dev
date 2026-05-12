-- Revert the Daily Life rename: stick with the shorter "Daily" label.
begin;

update public.post set category = 'Daily' where category = 'Daily Life';
update public.category set name = 'Daily' where name = 'Daily Life';

commit;
