-- Run in Supabase Dashboard -> SQL Editor (project: dsbrzllslpbqynuoivqx)
-- Allows the authenticated admin to upload, replace, and delete objects
-- in the public "images" bucket. Public read needs no policy (bucket is public).

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
