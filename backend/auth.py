import smtplib
import random
import os
from email.mime.text import MIMEText
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from supabase import create_client, Client

router = APIRouter()

# Supabase setup
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

# SMTP setup (Gmail App Password)
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_EMAIL = os.environ.get("SMTP_EMAIL")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD")

class OTPRequest(BaseModel):
    email: str

class OTPVerify(BaseModel):
    email: str
    code: str

@router.post("/auth/send-otp")
async def send_otp(request: OTPRequest):
    otp = "".join([str(random.randint(0, 9)) for _ in range(6)])
    
    # Send email
    msg = MIMEText(f"Your College Discovery Platform verification code is: {otp}")
    msg["Subject"] = "Your Verification Code"
    msg["From"] = SMTP_EMAIL
    msg["To"] = request.email
    
    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.send_message(msg)
            
        # Store OTP in Supabase (you'd need a table for this or use a cache)
        # For simplicity, we'll upsert into a table 'otps'
        supabase.table("otps").upsert({
            "email": request.email,
            "code": otp,
            "created_at": "now()"
        }).execute()
        
        return {"message": "OTP sent successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/auth/verify-otp")
async def verify_otp(request: OTPVerify):
    # Verify OTP
    res = supabase.table("otps").select("*").eq("email", request.email).eq("code", request.code).order("created_at", desc=True).limit(1).execute()
    
    if not res.data:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    
    # In a real app, check expiration (e.g., 5 mins)
    
    # Sign in user via Supabase Admin
    # This part depends on how you want to handle the session.
    # Usually, we'd use supabase.auth.admin.generate_link(type='magiclink') or similar
    # or just create a user and manual JWT if needed.
    # Here, we'll ensure user exists and return their info.
    
    user_res = supabase.auth.admin.get_user_by_email(request.email)
    if not user_res:
        user = supabase.auth.admin.create_user({
            "email": request.email,
            "email_confirm": True
        })
    else:
        user = user_res
        
    # Generate a magic link or just return success and let frontend handle Supabase auth?
    # Actually, to "issue JWT", we can use create_session or similar.
    # For now, let's return success and the user object.
    
    return {"message": "Verified", "user": user}
