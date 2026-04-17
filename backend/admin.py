import os
import csv
import io
import jwt
from fastapi import APIRouter, HTTPException, UploadFile, File, Depends, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from supabase import create_client, Client
from typing import List, Optional, Union

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
        new_leads = supabase.table("leads").select("id", count="exact").eq("status", "new").execute()
        resolved_leads = supabase.table("leads").select("id", count="exact").neq("status", "new").execute()
        
        new_counselling = supabase.table("counselling_requests").select("id", count="exact").eq("status", "new").execute()
        new_study_apps = supabase.table("study_applications").select("id", count="exact").eq("status", "new").execute()
        
        return {
            "total_colleges": colleges.count,
            "new_leads": new_leads.count,
            "new_counselling": new_counselling.count,
            "new_study_apps": new_study_apps.count,
            "resolved_requests": resolved_leads.count,
            "verified_colleges": colleges.count # Fallback or keep as requested
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

@router.patch("/leads/{lead_id}")
async def update_lead_status(lead_id: str, status: str, user: dict = Depends(get_admin_user)):
    if not supabase: return {"error": "DB not configured"}
    res = supabase.table("leads").update({"status": status}).eq("id", lead_id).execute()
    return {"success": True}


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
# --- 6. Individual College Management ---
class CourseCreate(BaseModel):
    name: str
    duration: Optional[str] = None
    seats: Optional[Union[str, int]] = None
    eligibility: Optional[str] = None
    total_year_1: Optional[str] = None

class ReviewCreate(BaseModel):
    rating: int
    comment: str
    pros: Optional[str] = None
    cons: Optional[str] = None

class HostelCreate(BaseModel):
    room_type: str
    fee: str
    description: Optional[str] = None
    is_ac: bool = False

class CollegeCreate(BaseModel):
    name: str
    slug: str
    location: str
    nirf_rank: Optional[Union[str, int]] = None
    accreditation: Optional[str] = None
    stream: str
    cutoff: Optional[str] = None
    deadline: Optional[str] = None
    description: str
    brochure_url: Optional[str] = None
    # New Placement Fields
    avg_package: Optional[str] = None
    highest_package: Optional[str] = None
    median_package: Optional[str] = None
    placement_highlights: List[str] = []
    # Nested Entities
    courses: List[CourseCreate] = []
    reviews: List[ReviewCreate] = []
    hostels: List[HostelCreate] = []

@router.post("/colleges")
async def create_college(payload: CollegeCreate, user: dict = Depends(get_admin_user)):
    if not supabase: return {"error": "DB not configured"}
    try:
        # 1. Create College
        college_res = supabase.table("colleges").insert({
            "name": payload.name,
            "slug": payload.slug,
            "location": payload.location,
            "nirf_rank": int(payload.nirf_rank) if payload.nirf_rank and str(payload.nirf_rank).isdigit() else None,
            "rank": int(payload.nirf_rank) if payload.nirf_rank and str(payload.nirf_rank).isdigit() else None,
            "accreditation": payload.accreditation,
            "stream": payload.stream,
            "cutoff": payload.cutoff,
            "deadline": payload.deadline,
            "description": payload.description,
            "brochure_url": payload.brochure_url,
            "avg_package": payload.avg_package,
            "highest_package": payload.highest_package,
            "median_package": payload.median_package,
            "placement_highlights": payload.placement_highlights,
            "status": "published"
        }).execute()
        
        if not college_res.data:
            raise HTTPException(status_code=500, detail="Failed to create college profile.")
            
        college_id = college_res.data[0]["id"]
        
        # 2. Batch Create Courses
        course_data = []
        for course in payload.courses:
            if course.name:
                course_data.append({
                    "college_id": college_id,
                    "name": course.name,
                    "duration": course.duration,
                    "seats": int(course.seats) if course.seats and str(course.seats).isdigit() else 60,
                    "fees": course.total_year_1,
                    "eligibility": course.eligibility
                })
        
        if course_data:
            supabase.table("courses").insert(course_data).execute()
        
        # 3. Batch Create Reviews
        review_data = []
        for review in payload.reviews:
            if review.comment:
                review_data.append({
                    "college_id": college_id,
                    "rating": review.rating,
                    "comment": review.comment,
                    "pros": review.pros.split(',') if isinstance(review.pros, str) else review.pros,
                    "cons": review.cons.split(',') if isinstance(review.cons, str) else review.cons,
                    "is_verified": True
                })
        
        if review_data:
            supabase.table("reviews").insert(review_data).execute()

        # 4. Batch Create Hostels
        hostel_data = []
        for hostel in payload.hostels:
            if hostel.room_type:
                hostel_data.append({
                    "college_id": college_id,
                    "room_type": hostel.room_type,
                    "fee": hostel.fee,
                    "description": hostel.description,
                    "is_ac": hostel.is_ac
                })
        
        if hostel_data:
            supabase.table("hostels").insert(hostel_data).execute()
                
        return {"success": True, "slug": payload.slug}
    except Exception as e:
        print(f"Error Creating College: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/colleges/{college_id}")
async def update_college(college_id: str, payload: CollegeCreate, user: dict = Depends(get_admin_user)):
    if not supabase: return {"error": "DB not configured"}
    try:
        # 1. Update College Base Info
        supabase.table("colleges").update({
            "name": payload.name,
            "location": payload.location,
            "nirf_rank": int(payload.nirf_rank) if payload.nirf_rank and str(payload.nirf_rank).isdigit() else None,
            "rank": int(payload.nirf_rank) if payload.nirf_rank and str(payload.nirf_rank).isdigit() else None,
            "accreditation": payload.accreditation,
            "stream": payload.stream,
            "cutoff": payload.cutoff,
            "deadline": payload.deadline,
            "description": payload.description,
            "brochure_url": payload.brochure_url,
            "avg_package": payload.avg_package,
            "highest_package": payload.highest_package,
            "median_package": payload.median_package,
            "placement_highlights": payload.placement_highlights
        }).eq("id", college_id).execute()

        # 2. Reset and Re-insert Courses
        supabase.table("courses").delete().eq("college_id", college_id).execute()
        course_data = [{
            "college_id": college_id,
            "name": c.name,
            "duration": c.duration,
            "seats": int(c.seats) if c.seats and str(c.seats).isdigit() else 60,
            "fees": c.total_year_1,
            "eligibility": c.eligibility
        } for c in payload.courses if c.name]
        if course_data:
            supabase.table("courses").insert(course_data).execute()

        # 3. Reset and Re-insert Hostels
        supabase.table("hostels").delete().eq("college_id", college_id).execute()
        hostel_data = [{
            "college_id": college_id,
            "room_type": h.room_type,
            "fee": h.fee,
            "description": h.description,
            "is_ac": h.is_ac
        } for h in payload.hostels if h.room_type]
        if hostel_data:
            supabase.table("hostels").insert(hostel_data).execute()
        
        # 4. Reset and Re-insert Reviews
        supabase.table("reviews").delete().eq("college_id", college_id).execute()
        review_data = [{
            "college_id": college_id,
            "rating": r.rating,
            "comment": r.comment,
            "pros": r.pros.split(',') if r.pros else [],
            "cons": r.cons.split(',') if r.cons else [],
            "is_verified": True
        } for r in payload.reviews if r.comment]
        if review_data:
            supabase.table("reviews").insert(review_data).execute()

        return {"success": True}
    except Exception as e:
        print(f"Error Updating College: {e}")
        raise HTTPException(status_code=500, detail=str(e))
