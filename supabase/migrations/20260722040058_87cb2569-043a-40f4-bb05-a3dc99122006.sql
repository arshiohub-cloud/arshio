
CREATE TYPE public.service_type AS ENUM ('audit','consulting','rag','automation','agent','custom');
CREATE TYPE public.engagement_status AS ENUM ('pending','active','delivered','closed');

CREATE TABLE public.engagements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_type public.service_type NOT NULL,
  title text NOT NULL,
  summary text,
  status public.engagement_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.engagements TO authenticated;
GRANT ALL ON public.engagements TO service_role;
ALTER TABLE public.engagements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own engagements" ON public.engagements
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage engagements" ON public.engagements
  FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.engagement_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id uuid NOT NULL REFERENCES public.engagements(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.engagement_updates TO authenticated;
GRANT ALL ON public.engagement_updates TO service_role;
ALTER TABLE public.engagement_updates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View updates own" ON public.engagement_updates
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.engagements e WHERE e.id = engagement_id AND (e.user_id = auth.uid() OR public.has_role(auth.uid(),'admin')))
  );
CREATE POLICY "Admins manage updates" ON public.engagement_updates
  FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.engagement_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id uuid NOT NULL REFERENCES public.engagements(id) ON DELETE CASCADE,
  label text NOT NULL,
  done boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.engagement_milestones TO authenticated;
GRANT ALL ON public.engagement_milestones TO service_role;
ALTER TABLE public.engagement_milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View milestones own" ON public.engagement_milestones
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.engagements e WHERE e.id = engagement_id AND (e.user_id = auth.uid() OR public.has_role(auth.uid(),'admin')))
  );
CREATE POLICY "Admins manage milestones" ON public.engagement_milestones
  FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.engagement_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id uuid NOT NULL REFERENCES public.engagements(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body text NOT NULL,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.engagement_messages TO authenticated;
GRANT ALL ON public.engagement_messages TO service_role;
ALTER TABLE public.engagement_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View messages own" ON public.engagement_messages
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.engagements e WHERE e.id = engagement_id AND (e.user_id = auth.uid() OR public.has_role(auth.uid(),'admin')))
  );
CREATE POLICY "Send message on own engagement" ON public.engagement_messages
  FOR INSERT TO authenticated WITH CHECK (
    author_id = auth.uid() AND
    EXISTS (SELECT 1 FROM public.engagements e WHERE e.id = engagement_id AND (e.user_id = auth.uid() OR public.has_role(auth.uid(),'admin')))
  );
CREATE POLICY "Admins manage messages" ON public.engagement_messages
  FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.engagement_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id uuid NOT NULL REFERENCES public.engagements(id) ON DELETE CASCADE,
  uploaded_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  filename text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.engagement_files TO authenticated;
GRANT ALL ON public.engagement_files TO service_role;
ALTER TABLE public.engagement_files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View files own" ON public.engagement_files
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.engagements e WHERE e.id = engagement_id AND (e.user_id = auth.uid() OR public.has_role(auth.uid(),'admin')))
  );
CREATE POLICY "Admins manage files" ON public.engagement_files
  FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS converted_engagement_id uuid REFERENCES public.engagements(id) ON DELETE SET NULL;

CREATE POLICY "Users read own engagement storage" ON storage.objects
  FOR SELECT TO authenticated USING (
    bucket_id = 'engagement-files' AND (
      public.has_role(auth.uid(),'admin') OR
      EXISTS (SELECT 1 FROM public.engagement_files f JOIN public.engagements e ON e.id = f.engagement_id
              WHERE f.storage_path = name AND e.user_id = auth.uid())
    )
  );
CREATE POLICY "Admins manage engagement storage" ON storage.objects
  FOR ALL TO authenticated USING (bucket_id='engagement-files' AND public.has_role(auth.uid(),'admin'))
  WITH CHECK (bucket_id='engagement-files' AND public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;
CREATE TRIGGER engagements_touch BEFORE UPDATE ON public.engagements
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
