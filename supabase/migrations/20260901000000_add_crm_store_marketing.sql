-- Create crm_contacts table
CREATE TABLE IF NOT EXISTS public.crm_contacts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text,
  phone text,
  company text,
  city text,
  country text,
  tags text[] DEFAULT '{}',
  total_spent numeric DEFAULT 0,
  currency text DEFAULT 'XOF',
  orders integer DEFAULT 0,
  last_contact timestamp with time zone,
  status text DEFAULT 'active',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create store_products table
CREATE TABLE IF NOT EXISTS public.store_products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  price numeric NOT NULL,
  currency text DEFAULT 'XOF',
  stock integer DEFAULT 0,
  category text,
  image text,
  status text DEFAULT 'draft',
  sales integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create marketing_campaigns table
CREATE TABLE IF NOT EXISTS public.marketing_campaigns (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL,
  status text DEFAULT 'draft',
  sent integer DEFAULT 0,
  opened integer DEFAULT 0,
  clicked integer DEFAULT 0,
  spent numeric DEFAULT 0,
  currency text DEFAULT 'XOF',
  date timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security
ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Users can manage their own contacts" ON public.crm_contacts FOR ALL USING (auth.uid() IN (SELECT firebase_uid FROM public.profiles WHERE id = profile_id));
CREATE POLICY "Users can manage their own products" ON public.store_products FOR ALL USING (auth.uid() IN (SELECT firebase_uid FROM public.profiles WHERE id = profile_id));
CREATE POLICY "Users can manage their own campaigns" ON public.marketing_campaigns FOR ALL USING (auth.uid() IN (SELECT firebase_uid FROM public.profiles WHERE id = profile_id));

