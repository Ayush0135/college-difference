import smtplib
import random
import os
import datetime
import jwt
from email.mime.text import MIMEText
from fastapi import APIRouter, HTTPException, Response
from pydantic import BaseModel
from supabase import create_client, Client
from typing import Optional

router = APIRouter()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) if SUPABASE_URL else None

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_EMAIL = os.environ.get("SMTP_EMAIL")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD")
JWT_SECRET = os.environ.get("JWT_SECRET", "super-secret-jwt-key")

class OTPRequest(BaseModel):
    email: str

class OTPVerify(BaseModel):
    email: str
    code: str

class OnboardingRequest(BaseModel):
    email: str
    phone: str

@router.post("/auth/send-otp")
async def send_otp(request: OTPRequest):
    if not supabase: return {"error": "DB not configured"}
    
    # Rate Limiting
    thirty_seconds_ago = (datetime.datetime.utcnow() - datetime.timedelta(seconds=60)).isoformat()
    recent = supabase.table("otps").select("*").eq("email", request.email).gte("created_at", thirty_seconds_ago).execute()
    if recent.data:
        raise HTTPException(status_code=429, detail="Please wait 60 seconds before requesting another OTP")
        
    otp = "".join([str(random.randint(0, 9)) for _ in range(6)])
    
    email_content = f"""
    Hello,

    Your verification code for the Degree Difference platform is:

    {otp}

    This code will expire in 5 minutes. If you did not request this, please ignore this email.

    Best regards,
    Degree Difference Team
    """
    
    msg = MIMEText(email_content)
    msg["Subject"] = f"{otp} is your verification code"
    msg["From"] = f"Degree Difference <{SMTP_EMAIL}>"
    msg["To"] = request.email
    
    try:
        if SMTP_EMAIL and SMTP_PASSWORD and SMTP_PASSWORD != 'your_gmail_app_password':
            with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
                server.starttls()
                server.login(SMTP_EMAIL, SMTP_PASSWORD)
                server.send_message(msg)
        else:
            print(f"⚠️ SMTP MOCKED: OTP for {request.email} is {otp}")
            
        supabase.table("otps").insert({
            "email": request.email,
            "otp": otp,
            "expires_at": (datetime.datetime.utcnow() + datetime.timedelta(minutes=5)).isoformat()
        }).execute()
        
        return {"message": "OTP sent successfully"}
    except smtplib.SMTPAuthenticationError:
        raise HTTPException(status_code=500, detail="Identity verification service is temporarily unavailable (Auth Error).")
    except Exception as e:
        print(f"❌ SMTP ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/auth/verify-otp")
async def verify_otp(request: OTPVerify, response: Response):
    if not supabase: return {"error": "DB not configured"}
    
    res = supabase.table("otps").select("*").eq("email", request.email).eq("otp", request.code).order("created_at", desc=True).limit(1).execute()
    
    if not res.data:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
        
    profile_res = supabase.table("profiles").select("*").eq("email", request.email).execute()
    
    needs_onboarding = False
    profile_id = None
    
    if not profile_res.data:
        role = "admin" if request.email == "ayush.kashyap7155@gmail.com" else "user"
        new_prof = supabase.table("profiles").insert({"email": request.email, "role": role}).execute()
        profile_id = new_prof.data[0]["id"]
        needs_onboarding = True
        profile_role = role
    else:
        profile = profile_res.data[0]
        profile_id = profile["id"]
        profile_role = profile.get("role", "user")
        if request.email == "ayush.kashyap7155@gmail.com" and profile_role != "admin":
            supabase.table("profiles").update({"role": "admin"}).eq("id", profile_id).execute()
            profile_role = "admin"
            profile["role"] = "admin"
            
        if not profile.get("phone"):
            needs_onboarding = True

    if needs_onboarding:
        return {"message": "OTP Verified", "requires_phone": True, "email": request.email}
        
    token = jwt.encode({
        "sub": profile_id,
        "email": request.email,
        "role": profile_role,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }, JWT_SECRET, algorithm="HS256")
    
    # Refresh profile data to send complete obj
    profile_res = supabase.table("profiles").select("*").eq("id", profile_id).execute()
    return {"message": "Login Successful", "token": token, "user": profile_res.data[0]}

@router.post("/auth/complete-onboarding")
async def complete_onboarding(request: OnboardingRequest):
    if not supabase: return {"error": "DB not configured"}
    
    res = supabase.table("profiles").update({"phone": request.phone}).eq("email", request.email).execute()
    
    if not res.data:
        raise HTTPException(status_code=404, detail="Profile not found")
        
    token = jwt.encode({
        "sub": res.data[0]["id"],
        "email": request.email,
        "role": res.data[0].get("role", "user"),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }, JWT_SECRET, algorithm="HS256")
    
    return {"message": "Onboarding Complete", "token": token, "user": res.data[0]}

@router.post("/admin/auth/send-otp")
async def admin_send_otp(request: OTPRequest):
    if not supabase: return {"error": "DB not configured"}
    
    is_admin = False
    if request.email == "ayush.kashyap7155@gmail.com":
        is_admin = True
    else:
        admin_check = supabase.table("admin_users").select("*").eq("email", request.email).execute()
        if admin_check.data:
            is_admin = True
            
    if not is_admin:
        raise HTTPException(status_code=403, detail="You are not authorized for Administrative Access.")
        
    thirty_seconds_ago = (datetime.datetime.utcnow() - datetime.timedelta(seconds=60)).isoformat()
    recent = supabase.table("otps").select("*").eq("email", request.email).gte("created_at", thirty_seconds_ago).execute()
    if recent.data:
        raise HTTPException(status_code=429, detail="Please wait 60 seconds before requesting another OTP")
        
    otp = "".join([str(random.randint(0, 9)) for _ in range(6)])
    
    msg = MIMEText(f"Your Secure Admin Verification Code is: {otp}")
    msg["Subject"] = "Admin Verification Code"
    msg["From"] = SMTP_EMAIL
    msg["To"] = request.email
    
    try:
        if SMTP_EMAIL and SMTP_PASSWORD and SMTP_PASSWORD != 'your_gmail_app_password':
            with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
                server.starttls()
                server.login(SMTP_EMAIL, SMTP_PASSWORD)
                server.send_message(msg)
        else:
            print(f"SMTP Mock (ADMIN): OTP for {request.email} is {otp}")
            
        supabase.table("otps").insert({
            "email": request.email,
            "otp": otp,
            "expires_at": (datetime.datetime.utcnow() + datetime.timedelta(minutes=5)).isoformat()
        }).execute()
        
        return {"message": "Admin OTP sent successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/admin/auth/verify-otp")
async def admin_verify_otp(request: OTPVerify):
    if not supabase: return {"error": "DB not configured"}
    
    is_admin = False
    if request.email == "ayush.kashyap7155@gmail.com":
        is_admin = True
    else:
        admin_check = supabase.table("admin_users").select("*").eq("email", request.email).execute()
        if admin_check.data:
            is_admin = True
            
    if not is_admin:
        raise HTTPException(status_code=403, detail="You are not authorized for Administrative Access.")
        
    res = supabase.table("otps").select("*").eq("email", request.email).eq("otp", request.code).order("created_at", desc=True).limit(1).execute()
    
    if not res.data:
        raise HTTPException(status_code=400, detail="Invalid or expired Admin OTP")
        
    profile_res = supabase.table("profiles").select("*").eq("email", request.email).execute()
    
    if not profile_res.data:
        new_prof = supabase.table("profiles").insert({"email": request.email, "role": "admin"}).execute()
        profile_id = new_prof.data[0]["id"]
        user_data = new_prof.data[0]
    else:
        profile_id = profile_res.data[0]["id"]
        supabase.table("profiles").update({"role": "admin"}).eq("id", profile_id).execute()
        user_data = profile_res.data[0]
        user_data["role"] = "admin"
        
    token = jwt.encode({
        "sub": profile_id,
        "email": request.email,
        "role": "admin",
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }, JWT_SECRET, algorithm="HS256")
    
    return {"message": "Admin Login Successful", "token": token, "user": user_data}
