CREATE TABLE public.sms_credits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid text NOT NULL UNIQUE,
  total_credits integer NOT NULL DEFAULT 0,
  used_credits integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.sms_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own credits" ON public.sms_credits
  FOR SELECT TO public USING (firebase_uid IN (SELECT profiles.firebase_uid FROM profiles));

CREATE POLICY "Users can insert their own credits" ON public.sms_credits
  FOR INSERT TO public WITH CHECK (firebase_uid IN (SELECT profiles.firebase_uid FROM profiles));

CREATE POLICY "Users can update their own credits" ON public.sms_credits
  FOR UPDATE TO public USING (firebase_uid IN (SELECT profiles.firebase_uid FROM profiles));

CREATE TABLE public.sms_pack_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid text NOT NULL,
  pack_name text NOT NULL,
  sms_count integer NOT NULL,
  price_per_sms numeric NOT NULL DEFAULT 125,
  total_price numeric NOT NULL,
  currency text NOT NULL DEFAULT 'XOF',
  status text NOT NULL DEFAULT 'pending',
  payment_reference text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.sms_pack_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own purchases" ON public.sms_pack_purchases
  FOR SELECT TO public USING (firebase_uid IN (SELECT profiles.firebase_uid FROM profiles));

CREATE POLICY "Users can insert their own purchases" ON public.sms_pack_purchases
  FOR INSERT TO public WITH CHECK (firebase_uid IN (SELECT profiles.firebase_uid FROM profiles));

CREATE TRIGGER update_sms_credits_updated_at
  BEFORE UPDATE ON public.sms_credits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();