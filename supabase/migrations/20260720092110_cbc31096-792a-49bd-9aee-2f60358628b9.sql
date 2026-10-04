DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.leads;

CREATE POLICY "Anyone can submit a lead"
ON public.leads
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(btrim(name)) BETWEEN 1 AND 200
  AND length(btrim(email)) BETWEEN 3 AND 320
  AND email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
  AND length(btrim(message)) BETWEEN 1 AND 5000
  AND (company IS NULL OR length(company) <= 200)
  AND (phone IS NULL OR length(phone) <= 40)
  AND (source_page IS NULL OR length(source_page) <= 200)
  AND status = 'new'::lead_status
  AND read_at IS NULL
  AND notes IS NULL
);