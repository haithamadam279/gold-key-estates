-- Create storage bucket for property documents
insert into storage.buckets (id, name, public) values ('documents', 'documents', false);

-- Storage policies for documents bucket
create policy "Users can view their property documents"
on storage.objects for select
to authenticated
using (
    bucket_id = 'documents'
    and exists (
        select 1 from public.documents d
        join public.properties p on p.id = d.property_id
        where d.file_path = name
        and (p.assigned_user_id = auth.uid() or public.has_role(auth.uid(), 'admin'))
    )
);

create policy "Admins can upload documents"
on storage.objects for insert
to authenticated
with check (
    bucket_id = 'documents'
    and public.has_role(auth.uid(), 'admin')
);

create policy "Admins can update documents"
on storage.objects for update
to authenticated
using (
    bucket_id = 'documents'
    and public.has_role(auth.uid(), 'admin')
);

create policy "Admins can delete documents"
on storage.objects for delete
to authenticated
using (
    bucket_id = 'documents'
    and public.has_role(auth.uid(), 'admin')
);