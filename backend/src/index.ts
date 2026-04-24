import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import * as jose from 'jose'

type Bindings = {
  SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
  RESEND_API_KEY: string
  RESEND_FROM_EMAIL: string
  JWT_SECRET: string
}

const app = new Hono<{ Bindings: Bindings }>()

// Middleware
app.use('*', cors())

// Helper: Get Supabase Client
const getSupabase = (c: any) => createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)

// --- ROUTES ---

// Root
app.get('/', (c) => c.json({ status: 'ok', engine: 'Hono (Edge)' }))

// SEND OTP
app.post('/auth/send-otp', async (c) => {
  const { email } = await c.req.json()
  if (!email) return c.json({ error: 'Email required' }, 400)

  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  const resend = new Resend(c.env.RESEND_API_KEY)

  try {
    const supabase = getSupabase(c)
    
    // 1. Delete any existing OTPs for this email first (to prevent .single() errors)
    await supabase.from('otps').delete().eq('email', email)

    // 2. Save new OTP to Supabase
    const { error: dbError } = await supabase
      .from('otps')
      .insert({ email, otp, created_at: new Date().toISOString() })

    if (dbError) throw dbError

    // 2. Send via Resend
    const { data, error: mailError } = await resend.emails.send({
      from: c.env.RESEND_FROM_EMAIL || 'auth@degreedifference.com',
      to: [email],
      subject: 'Your Login OTP for Degree Difference',
      html: `<strong>Your OTP is: ${otp}</strong><p>This code expires in 10 minutes.</p>`,
    })

    if (mailError) throw mailError

    return c.json({ message: 'OTP sent successfully' })
  } catch (err: any) {
    return c.json({ error: err.message }, 500)
  }
})

// VERIFY OTP
app.post('/auth/verify-otp', async (c) => {
  const { email, code } = await c.req.json()
  const supabase = getSupabase(c)

  const { data, error } = await supabase
    .from('otps')
    .select('*')
    .eq('email', email)
    .single()

  if (error || data?.otp !== String(code).trim()) {
    return c.json({ error: 'Invalid OTP' }, 401)
  }

  const otpAgeMinutes = (new Date().getTime() - new Date(data.created_at).getTime()) / 60000;
  if (otpAgeMinutes > 3) {
    await supabase.from('otps').delete().eq('email', email)
    return c.json({ error: 'OTP has expired (valid for 3 minutes). Please request a new one.' }, 401)
  }

  // Delete OTP after successful verification
  await supabase.from('otps').delete().eq('email', email)

  // Generate JWT
  const secret = new TextEncoder().encode(c.env.JWT_SECRET || 'fallback-secret-change-me')
  const token = await new jose.SignJWT({ email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)

  return c.json({ token, user: { email } })
})

// COLLEGES (Explore)
app.get('/colleges', async (c) => {
  const supabase = getSupabase(c)
  const city = c.req.query('city')
  const goal = c.req.query('goal')

  let query = supabase.from('colleges').select('*')
  if (city) query = query.eq('city', city)
  // Add other filters as needed

  const { data, error } = await query
  if (error) return c.json({ error: error.message }, 500)
  return c.json(data)
})

// COLLEGE DETAIL (Slug)
app.get('/colleges/:slug', async (c) => {
  const slug = c.req.param('slug')
  const supabase = getSupabase(c)

  // 1. Get College
  const { data: college, error: collegeError } = await supabase
    .from('colleges')
    .select('*')
    .eq('slug', slug)
    .single()

  if (collegeError || !college) return c.json({ error: 'College not found' }, 404)

  // 2. Get Related Data in Parallel
  const [courses, hostels, reviews] = await Promise.all([
    supabase.from('courses').select('*').eq('college_id', college.id),
    supabase.from('hostels').select('*').eq('college_id', college.id),
    supabase.from('reviews').select('*').eq('college_id', college.id).eq('is_verified', true)
  ])

  return c.json({
    ...college,
    courses: courses.data || [],
    hostels: hostels.data || [],
    reviews: reviews.data || []
  })
})

// BANNERS
app.get('/banners', async (c) => {
  const supabase = getSupabase(c)
  const { data, error } = await supabase.from('banners').select('*').eq('is_active', true)
  if (error) return c.json({ error: error.message }, 500)
  return c.json(data)
})

// ADMIN: LEADS
app.get('/admin/leads', async (c) => {
  const supabase = getSupabase(c)
  const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false })
  if (error) return c.json({ error: error.message }, 500)
  return c.json(data)
})

// ADMIN: COUNSELLING
app.get('/admin/counselling', async (c) => {
  const supabase = getSupabase(c)
  const { data, error } = await supabase.from('counselling_requests').select('*').order('created_at', { ascending: false })
  if (error) return c.json({ error: error.message }, 500)
  return c.json(data)
})

// APPLY (LEAD CAPTURE)
app.post('/leads', async (c) => {
  const body = await c.req.json()
  // Ensure the degree field is mapped to the course_name column
  if (body.degree && !body.course_name) {
    body.course_name = body.degree;
    delete body.degree;
  }
  const supabase = getSupabase(c)
  const { data, error } = await supabase.from('leads').insert([body])
  if (error) return c.json({ error: error.message }, 500)
  return c.json({ message: 'Application submitted successfully', data })
})

export default app
