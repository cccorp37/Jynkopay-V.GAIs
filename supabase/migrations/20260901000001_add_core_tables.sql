CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    firebase_uid text UNIQUE,
    email text,
    display_name text,
    first_name text,
    last_name text,
    phone text,
    company_name text,
    siret text,
    account_type text,
    kyc_level integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.wallets (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    wallet_id text UNIQUE,
    currency text DEFAULT 'XOF',
    balance numeric DEFAULT 0,
    max_balance numeric DEFAULT 100000,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.support_tickets (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text,
    email text,
    message text,
    status text DEFAULT 'open',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.social_boost_orders (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    platform text NOT NULL,
    package_type text NOT NULL,
    quantity integer NOT NULL,
    target_url text NOT NULL,
    price numeric NOT NULL,
    status text DEFAULT 'pending',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: RLS disabled or policies need to be generous for signup insert.
-- We will enable RLS but add an insert policy that allows authenticated and anon to insert, 
-- or we can just disable RLS on profiles to avoid signup issues in this demo.
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_boost_orders DISABLE ROW LEVEL SECURITY;
