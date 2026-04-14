import os
import csv
import io
import jwt
from fastapi import APIRouter, HTTPException, UploadFile, File, Depends, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from supabase import create_client, Client
from typing import List

router = APIRouter(prefix="/admin")
security = HTTPBearer()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) if SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY else None
JWT_SECRET = os.environ.get("JWT_SECRET", "super-secret-jwt-key")

def get_admin_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=["HS256"])
        if payload.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Forbidden: Admin access only.")
        return payload
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authorization token")

# --- 1. Analytics Dashboard ---
@router.get("/stats")
async def get_stats(user: dict = Depends(get_admin_user)):
    if not supabase: return {"error": "DB not configured"}
    try:
        colleges = supabase.table("colleges").select("id", count="exact").execute()
        leads = supabase.table("leads").select("id", count="exact").execute()
        pending_reviews = supabase.table("reviews").select("id", count="exact").eq("is_verified", False).execute()
        verified_colleges = supabase.table("colleges").select("id", count="exact").neq("status", "draft").execute()
        
        return {
            "total_colleges": colleges.count,
            "new_leads": leads.count,
            "pending_reviews": pending_reviews.count,
            "verified_colleges": verified_colleges.count
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- 2. Lead CRM ---
class LeadUpdate(BaseModel):
    status: str

@router.get("/leads")
async def get_leads(user: dict = Depends(get_admin_user)):
    if not supabase: return {"error": "DB not configured"}
    res = supabase.table("leads").select("*, colleges(name)").order("created_at", desc=True).execute()
    return res.data

@router.patch("/leads/{lead_id}/status")
async def update_lead_status(lead_id: str, payload: LeadUpdate, user: dict = Depends(get_admin_user)):
    if not supabase: return {"error": "DB not configured"}
    res = supabase.table("leads").update({"status": payload.status}).eq("id", lead_id).execute()
    return res.data


# --- 3. Review Moderation Queue ---
@router.get("/reviews/pending")
async def get_pending_reviews(user: dict = Depends(get_admin_user)):
    if not supabase: return {"error": "DB not configured"}
    res = supabase.table("reviews").select("*, colleges(name), profiles(email)").eq("is_verified", False).order("created_at", desc=True).execute()
    return res.data

@router.post("/reviews/{review_id}/approve")
async def approve_review(review_id: str, user: dict = Depends(get_admin_user)):
    if not supabase: return {"error": "DB not configured"}
    res = supabase.table("reviews").update({"is_verified": True}).eq("id", review_id).execute()
    return res.data

@router.delete("/reviews/{review_id}")
async def reject_review(review_id: str, user: dict = Depends(get_admin_user)):
    if not supabase: return {"error": "DB not configured"}
    res = supabase.table("reviews").delete().eq("id", review_id).execute()
    return {"success": True}


# --- 4. Bulk CSV Importer (Colleges) ---
@router.post("/colleges/bulk")
async def bulk_upload_colleges(file: UploadFile = File(...), user: dict = Depends(get_admin_user)):
    if not supabase: return {"error": "DB not configured"}
    try:
        content = await file.read()
        decoded = content.decode('utf-8')
        reader = csv.DictReader(io.StringIO(decoded))
        count = 0
        for row in reader:
            supabase.table("colleges").insert({
                "name": row.get("name", "Unknown College"),
                "slug": row.get("slug", row.get("name", "").lower().replace(" ", "-")),
                "location": row.get("location", ""),
                "nirf_rank": int(row["nirf_rank"]) if row.get("nirf_rank") and str(row["nirf_rank"]).isdigit() else None,
                "accreditation": row.get("accreditation", ""),
                "description": row.get("description", ""),
                "status": "published"
            }).execute()
            count += 1
            
        return {"success": True, "inserted": count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- 5. Team Access Control ---
class TeamAuthRequest(BaseModel):
    email: str
    
@router.post("/team")
async def authorize_team_member(payload: TeamAuthRequest, user: dict = Depends(get_admin_user)):
    if not supabase: return {"error": "DB not configured"}
    
    granted_by = user.get("email") or "system"
    
    # Register explicitly into the isolated admin table
    existing = supabase.table("admin_users").select("*").eq("email", payload.email).execute()
    if not existing.data:
        try:
            supabase.table("admin_users").insert({
                "email": payload.email,
                "granted_by": granted_by
            }).execute()
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to add to admin directory: " + str(e))
            
    # Keep the profile logic as a backup for users who are already onboarded, ensuring token consistency
    res = supabase.table("profiles").select("*").eq("email", payload.email).execute()
    if not res.data:
        supabase.table("profiles").insert({"email": payload.email, "role": "admin"}).execute()
    else:
        supabase.table("profiles").update({"role": "admin"}).eq("email", payload.email).execute()
        
    return {"success": True, "message": f"Successfully authorized {payload.email} as Admin"}
