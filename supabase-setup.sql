-- ============================================================
-- Supabase setup for Mahmoud Faisal portfolio
-- نفّذ هذا الملف في Supabase > SQL Editor > New query ثم Run
-- ============================================================

-- 1) جدول المحتوى (صف واحد فقط id='main')
create table if not exists public.site_content (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

-- قراءة عامة (الزائر)
drop policy if exists "Public read site content" on public.site_content;
create policy "Public read site content"
  on public.site_content for select
  using (true);

-- كتابة للمدير فقط (استبدل UID أدناه بـ UID حساب المدير)
drop policy if exists "Admin insert site content" on public.site_content;
create policy "Admin insert site content"
  on public.site_content for insert
  to authenticated
  with check (auth.uid() = 'PASTE_ADMIN_UID_HERE'::uuid);

drop policy if exists "Admin update site content" on public.site_content;
create policy "Admin update site content"
  on public.site_content for update
  to authenticated
  using (auth.uid() = 'PASTE_ADMIN_UID_HERE'::uuid)
  with check (auth.uid() = 'PASTE_ADMIN_UID_HERE'::uuid);

drop policy if exists "Admin delete site content" on public.site_content;
create policy "Admin delete site content"
  on public.site_content for delete
  to authenticated
  using (auth.uid() = 'PASTE_ADMIN_UID_HERE'::uuid);

-- 2) تفعيل Realtime على الجدول
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'site_content'
  ) then
    alter publication supabase_realtime add table public.site_content;
  end if;
end $$;

-- 3) Bucket للصور
insert into storage.buckets (id, name, public)
values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do update set public = excluded.public;

-- سياسات Storage: قراءة عامة، رفع/تعديل/حذف للمدير فقط
drop policy if exists "Public read portfolio images" on storage.objects;
create policy "Public read portfolio images"
  on storage.objects for select
  using (bucket_id = 'portfolio-images');

drop policy if exists "Admin upload portfolio images" on storage.objects;
create policy "Admin upload portfolio images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'portfolio-images'
    and auth.uid() = 'PASTE_ADMIN_UID_HERE'::uuid
  );

drop policy if exists "Admin update portfolio images" on storage.objects;
create policy "Admin update portfolio images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'portfolio-images' and auth.uid() = 'PASTE_ADMIN_UID_HERE'::uuid)
  with check (bucket_id = 'portfolio-images' and auth.uid() = 'PASTE_ADMIN_UID_HERE'::uuid);

drop policy if exists "Admin delete portfolio images" on storage.objects;
create policy "Admin delete portfolio images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'portfolio-images' and auth.uid() = 'PASTE_ADMIN_UID_HERE'::uuid);
