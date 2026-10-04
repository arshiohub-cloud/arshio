GRANT INSERT ON public.leads TO anon, authenticated;

CREATE POLICY "Anyone can submit a lead"
ON public.leads
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(trim(name)) BETWEEN 1 AND 200
  AND length(trim(email)) BETWEEN 3 AND 320
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(trim(message)) BETWEEN 1 AND 5000
  AND (company IS NULL OR length(company) <= 200)
  AND (phone IS NULL OR length(phone) <= 40)
  AND (source_page IS NULL OR length(source_page) <= 200)
  AND status = 'new'
  AND read_at IS NULL
  AND notes IS NULL
);