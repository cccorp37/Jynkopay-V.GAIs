
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS maplerad_customer_id text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS maplerad_tier integer DEFAULT 0;

-- Table for tracking webhook events (idempotence)
CREATE TABLE IF NOT EXISTS public.maplerad_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id text UNIQUE NOT NULL,
  event_type text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  processed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.maplerad_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "System can manage maplerad events" ON public.maplerad_events FOR ALL USING (true);
