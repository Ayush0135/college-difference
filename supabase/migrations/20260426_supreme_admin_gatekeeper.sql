
CREATE TABLE IF NOT EXISTS public.admin_users (
    email TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now()
);


ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated read" ON public.admin_users;
DROP POLICY IF EXISTS "Service role full access" ON public.admin_users;
DROP POLICY IF EXISTS "Allow anon insert" ON public.admin_users;
DROP POLICY IF EXISTS "Allow anon read" ON public.admin_users;

-- Allow anyone to READ (the gatekeeper check needs this)
CREATE POLICY "Allow anon read" ON public.admin_users
FOR SELECT USING (true);

-- Allow anyone to INSERT (security is enforced at API layer via JWT)
CREATE POLICY "Allow anon insert" ON public.admin_users
FOR INSERT WITH CHECK (true);

-- Allow anyone to DELETE (so supreme admin can revoke access)
CREATE POLICY "Allow anon delete" ON public.admin_users
FOR DELETE USING (true);

-- Seed the Supreme Admin
INSERT INTO public.admin_users (email)
VALUES ('ayush.kashyap7155@gmail.com')
ON CONFLICT (email) DO NOTHING;
