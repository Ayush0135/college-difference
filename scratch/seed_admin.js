// Run this script to seed the Supreme Admin into admin_users table
// Uses the service role key stored in wrangler secrets

const { createClient } = require('@supabase/supabase-js')

// These are the actual values from the project
const SUPABASE_URL = 'https://zmsqbysmpxkqeoapxnbo.supabase.co'

// NOTE: This script needs the real SERVICE ROLE KEY (starts with eyJ...)
// The anon key cannot write due to RLS
// Get it from: Supabase Dashboard > Settings > API > service_role key
const SERVICE_ROLE_KEY = process.argv[2]

if (!SERVICE_ROLE_KEY) {
  console.error('ERROR: Pass your Supabase service_role key as an argument:')
  console.error('  node scratch/seed_admin.js <your-service-role-key>')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

async function run() {
  console.log('Creating admin_users table if needed...')
  
  // Check if Supreme Admin is already in there
  const { data: existing } = await supabase
    .from('admin_users')
    .select('email')
    .eq('email', 'ayush.kashyap7155@gmail.com')
    .single()
  
  if (existing) {
    console.log('✅ Supreme Admin already exists in admin_users table:', existing.email)
    return
  }

  // Insert Supreme Admin
  const { data, error } = await supabase
    .from('admin_users')
    .insert({ email: 'ayush.kashyap7155@gmail.com', authorized_by: 'system' })
    .select()
    .single()

  if (error) {
    console.error('❌ Error inserting Supreme Admin:', error.message)
    process.exit(1)
  }

  console.log('✅ Supreme Admin seeded successfully:', data.email)
}

run()
