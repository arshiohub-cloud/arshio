CREATE TABLE public.audit_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  requested_slot TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ,
  timezone TEXT,
  notes TEXT,
  source TEXT NOT NULL DEFAULT 'aria_voice',
  confirmed BOOLEAN NOT NULL DEFAULT true
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.audit_bookings TO authenticated;
GRANT ALL ON public.audit_bookings TO service_role;

ALTER TABLE public.audit_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view bookings" ON public.audit_bookings
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage bookings" ON public.audit_bookings
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX audit_bookings_created_at_idx ON public.audit_bookings (created_at DESC);