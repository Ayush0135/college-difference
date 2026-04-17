import os
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from supabase import create_client, Client
from admin import get_admin_user

router = APIRouter()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) if SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY else None

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

class LeadCreate(BaseModel):
    name: str
    email: str
    phone: str
    college_id: Optional[str] = None
    degree: Optional[str] = None
    course_name: Optional[str] = None

def notify_admin(lead: LeadCreate, college_name: str = "Unknown"):
    smtp_email = os.environ.get("SMTP_EMAIL")
    smtp_pass = os.environ.get("SMTP_PASSWORD")
    if not smtp_email or not smtp_pass:
        return

    admin_email = "pathakayush715@gmail.com" # Admin destination
    
    msg = MIMEMultipart()
    msg['From'] = f"Degree Difference Lead <{smtp_email}>"
    msg['To'] = admin_email
    msg['Subject'] = f"🔥 NEW LEAD: {lead.name} - {college_name}"

    body = f"""
    <html>
    <body style="font-family: sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #0d9488;">New Student Inquiry Received</h2>
        <div style="background: #f1f5f9; padding: 20px; border-radius: 10px;">
            <p><strong>Student Name:</strong> {lead.name}</p>
            <p><strong>Email:</strong> {lead.email}</p>
            <p><strong>Phone:</strong> {lead.phone}</p>
            <p><strong>Intended Degree:</strong> {lead.degree or lead.course_name or 'N/A'}</p>
            <p><strong>College/Service:</strong> {college_name}</p>
        </div>
        <p style="margin-top: 20px;">Please contact the student as soon as possible to resolve their query.</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="font-size: 12px; color: #64748b;">Degree Difference Administrative Notification System</p>
    </body>
    </html>
    """
    msg.attach(MIMEText(body, 'html'))

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(smtp_email, smtp_pass)
            server.send_message(msg)
    except Exception as e:
        print(f"Admin Notification Error: {e}")

@router.post("/leads")
async def create_lead(payload: LeadCreate):
    if not supabase: return {"error": "DB not configured"}
    try:
        # Sanitize college_id for UUID column
        c_id = payload.college_id
        if not c_id or c_id in ["None", "null", "general-counseling", ""]:
            c_id = None

        # Get college name for better email
        college_name = "General Counseling"
        if c_id:
            c_res = supabase.table("colleges").select("name").eq("id", c_id).execute()
            if c_res.data:
                college_name = c_res.data[0]["name"]

        res = supabase.table("leads").insert({
            "name": payload.name,
            "email": payload.email,
            "phone": payload.phone,
            "college_id": c_id,
            "course_name": payload.degree or payload.course_name,
            "status": "new"
        }).execute()
        
        # Trigger Admin Alert
        notify_admin(payload, college_name)
        
        lead_id = res.data[0]["id"] if res.data else None
        return {"success": True, "lead_id": lead_id}
    except Exception as e:
        print(f"Lead Creation Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/admin/leads")
async def get_leads(user: dict = Depends(get_admin_user)):
    if not supabase: return {"error": "DB not configured"}
    try:
        # Fetch leads with joined college names
        res = supabase.table("leads").select("*, colleges(name)").order("created_at", desc=True).execute()
        return res.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/admin/leads/{lead_id}")
async def update_lead_status(lead_id: str, status: str, user: dict = Depends(get_admin_user)):
    if not supabase: return {"error": "DB not configured"}
    try:
        res = supabase.table("leads").update({"status": status}).eq("id", lead_id).execute()
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class CounsellingCreate(BaseModel):
    name: str
    email: str
    phone: str
    stream: str

@router.post("/counselling")
async def create_counselling_request(payload: CounsellingCreate):
    if not supabase: return {"error": "DB not configured"}
    try:
        res = supabase.table("counselling_requests").insert({
            "name": payload.name,
            "email": payload.email,
            "phone": payload.phone,
            "stream": payload.stream,
            "status": "new"
        }).execute()
        
        # Notify Admin (Reuse logic)
        fake_lead = LeadCreate(
            name=payload.name,
            email=payload.email,
            phone=payload.phone,
            college_id="general",
            course_name=payload.stream
        )
        notify_admin(fake_lead, "Expert Counselling Requested")
        
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/admin/counselling")
async def get_counselling_requests(user: dict = Depends(get_admin_user)):
    if not supabase: return {"error": "DB not configured"}
    try:
        res = supabase.table("counselling_requests").select("*").order("created_at", desc=True).execute()
        return res.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class StudyApplicationCreate(BaseModel):
    name: str
    email: str
    phone: str
    college_choices: List[str]

@router.post("/study-applications")
async def create_study_application(payload: StudyApplicationCreate):
    if not supabase: return {"error": "DB not configured"}
    try:
        res = supabase.table("study_applications").insert({
            "name": payload.name,
            "email": payload.email,
            "phone": payload.phone,
            "college_choices": payload.college_choices,
            "status": "new"
        }).execute()
        
        # Notify Admin
        fake_lead = LeadCreate(
            name=payload.name,
            email=payload.email,
            phone=payload.phone,
            college_id="multi",
            course_name=f"Top 5: {', '.join(payload.college_choices)}"
        )
        notify_admin(fake_lead, "Multi-College Application Starter")
        
        return {"success": True}
    except Exception as e:
        print(f"Study App Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/admin/study-applications")
async def get_study_applications(user: dict = Depends(get_admin_user)):
    if not supabase: return {"error": "DB not configured"}
    try:
        res = supabase.table("study_applications").select("*").order("created_at", desc=True).execute()
        return res.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
