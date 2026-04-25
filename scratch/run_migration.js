const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = 'https://zmsqbysmpxkqeoapxnbo.supabase.co'
// Using the anon key — we'll use service role via REST API
// First let's just verify the table exists by calling the management API

const sql = `
CREATE TABLE IF NOT EXISTS public.admin_users (
    email TEXT PRIMARY KEY,
    authorized_by TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='admin_users' AND policyname='Service role full access') THEN
    EXECUTE 'CREATE POLICY "Service role full access" ON public.admin_users FOR ALL TO service_role USING (true) WITH CHECK (true)';
  END IF;
END$$;

INSERT INTO public.admin_users (email, authorized_by)
VALUES ('ayush.kashyap7155@gmail.com', 'system')
ON CONFLICT (email) DO NOTHING;
`

console.log('SQL to run in your Supabase Dashboard > SQL Editor:')
console.log('===================================================')
console.log(sql)
console.log('===================================================')
console.log('After running, the admin_users table will exist with the Supreme Admin seeded.')
