-- Run in Supabase Dashboard -> SQL Editor (project: dsbrzllslpbqynuoivqx)
-- Idempotent: safe to run multiple times. Recreates the admin-only
-- upload/replace/delete policies on the public "images" bucket.
-- Public read needs no policy (bucket is public).

drop policy if exists "admin uploads to images" on storage.objects;
drop policy if exists "admin updates to images" on storage.objects;
drop policy if exists "admin deletes from images" on storage.objects;
drop policy if exists "authenticated uploads to images" on storage.objects;
drop policy if exists "authenticated updates to images" on storage.objects;
drop policy if exists "authenticated deletes from images" on storage.objects;

create policy "admin uploads to images" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'images' and (auth.jwt() ->> 'email') = 'info@amitrajbanshi.com.np'
  );

create policy "admin updates to images" on storage.objects
  for update to authenticated using (
    bucket_id = 'images' and (auth.jwt() ->> 'email') = 'info@amitrajbanshi.com.np'
  );

create policy "admin deletes from images" on storage.objects
  for delete to authenticated using (
    bucket_id = 'images' and (auth.jwt() ->> 'email') = 'info@amitrajbanshi.com.np'
  );
