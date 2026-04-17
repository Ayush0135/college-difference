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
    brochure_url: Optional[str] = None
    courses: List[CourseParams]
    reviews: List[ReviewParams]

@router.get("/colleges")
async def get_colleges(
    city: Optional[str] = None,
    goal: Optional[str] = None,
    search: Optional[str] = None
):
    if not supabase: return {"error": "DB not configured"}
    query = supabase.table("colleges").select("*, courses(*), fees(*), hostels(*)")
    
    if city and city != "Select City":
        if city == "Delhi NCR":
            query = query.or_("location.ilike.%Delhi%,location.ilike.%Noida%,location.ilike.%Gurgaon%,location.ilike.%Ghaziabad%,location.ilike.%Faridabad%")
        elif city == "Mumbai":
            query = query.or_("location.ilike.%Mumbai%,location.ilike.%Thane%,location.ilike.%Navi%")
        elif city == "Bengaluru":
            query = query.or_("location.ilike.%Bangalore%,location.ilike.%Bengaluru%")
        else:
            query = query.ilike("location", f"%{city}%")
    
    if goal and goal != "Select Goal": 
        query = query.ilike("stream", f"%{goal}%")
        
    if search: 
        query = query.ilike("name", f"%{search}%")
    query = query.order("rank", desc=False)
    
    try:
        res = query.execute()
        return res.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/colleges/{slug}")
async def get_college_detail(slug: str):
    if not supabase: return {"error": "DB not configured"}
    res = supabase.table("colleges").select("*, courses(*), fees(*), reviews(*), hostels(*)").eq("slug", slug).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="College not found")
    return res.data[0]
