DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.leads;

CREATE POLICY "Anyone can submit a lead"
ON public.leads
FOR INSERT
TO anon, authenticated
WITH CHECK (
  name IS NOT NULL AND length(btrim(name)) > 0 AND length(name) <= 200
  AND email IS NOT NULL AND length(email) BETWEEN 3 AND 320
  AND message IS NOT NULL AND length(btrim(message)) > 0 AND length(message) <= 5000
  AND (company IS NULL OR length(company) <= 200)
  AND (phone IS NULL OR length(phone) <= 40)
);