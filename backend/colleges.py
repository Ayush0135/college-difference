import os
import re
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from supabase import create_client, Client
from typing import Optional, List

router = APIRouter()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) if SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY else None

class CourseParams(BaseModel):
    name: str
    duration: str
    seats: str
    eligibility: str
    total_year_1: str

class ReviewParams(BaseModel):
    rating: float
    comment: str
    pros: str
    cons: str

class CollegeParams(BaseModel):
    name: str
    slug: str
    location: str
    nirf_rank: str
    accreditation: str
    stream: str
    cutoff: str
    deadline: str
    description: str
    courses: List[CourseParams]
    reviews: List[ReviewParams]

@router.get("/colleges")
async def get_colleges(
    city: Optional[str] = None,
    goal: Optional[str] = None,
    search: Optional[str] = None
):
    if not supabase: return {"error": "DB not configured"}
    query = supabase.table("colleges").select("*, courses(*), fees(*)")
    if city and city != "Select City": query = query.ilike("location", f"%{city}%")
    if goal and goal != "Select Goal": query = query.ilike("stream", f"%{goal}%")
    if search: query = query.ilike("name", f"%{search}%")
    query = query.order("rank", desc=False)
    
    try:
        res = query.execute()
        return res.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/colleges/{slug}")
async def get_college_detail(slug: str):
    if not supabase: return {"error": "DB not configured"}
    res = supabase.table("colleges").select("*, courses(*), fees(*), reviews(*)").eq("slug", slug).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="College not found")
    return res.data[0]

from admin import get_admin_user
from fastapi import Depends

@router.post("/admin/colleges")
async def create_college(payload: CollegeParams, user: dict = Depends(get_admin_user)):
    if not supabase: return {"error": "DB not configured"}
    try:
        # Auto-sanitize slug to prevent 404 router crashes
        raw_slug = payload.slug.strip() if payload.slug else payload.name
        safe_slug = re.sub(r'[^a-z0-9]+', '-', raw_slug.lower()).strip('-')
        if not safe_slug: safe_slug = "college-unknown"

        # Insert College
        college_res = supabase.table("colleges").insert({
            "name": payload.name,
            "slug": safe_slug,
            "location": payload.location,
            "stream": payload.stream,
            "nirf_rank": int(payload.nirf_rank) if payload.nirf_rank.isdigit() else None,
            "rank": int(payload.nirf_rank) if payload.nirf_rank.isdigit() else 999,
            "accreditation": payload.accreditation,
            "agency": payload.accreditation.split()[0] if payload.accreditation else "UGC",
            "description": payload.description,
            "cutoff": payload.cutoff,
            "deadline": payload.deadline,
            "fees": payload.courses[0].total_year_1 if payload.courses else "NA",
            "logo": payload.name[0].upper() if payload.name else "?",
            "status": "published"
        }).execute()
        
        college_id = college_res.data[0]["id"]
        
        # Insert Courses & Fees
        for course in payload.courses:
            if course.name:
                supabase.table("courses").insert({
                    "college_id": college_id,
                    "name": course.name,
                    "duration": course.duration,
                    "seats": int(course.seats) if course.seats.isdigit() else None,
                    "eligibility": course.eligibility,
                    "fees": course.total_year_1
                }).execute()
                
        # Insert Reviews
        for review in payload.reviews:
            if review.comment:
                supabase.table("reviews").insert({
                    "college_id": college_id,
                    "rating": review.rating,
                    "comment": review.comment,
                    "pros": [p.strip() for p in review.pros.split(",") if p.strip()],
                    "cons": [c.strip() for c in review.cons.split(",") if c.strip()],
                    "is_verified": True
                }).execute()
                
        return {"success": True, "college_id": college_id, "slug": payload.slug}
    except Exception as e:
        print(f"FAILED TO INSERT COLLEGE: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
