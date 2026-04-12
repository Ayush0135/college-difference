import requests
import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from supabase import create_client, Client

router = APIRouter()

# Supabase setup
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

class SyncRequest(BaseModel):
    url: str

@router.post("/sync/map-server")
async def sync_data(request: SyncRequest):
    try:
        response = requests.get(request.url)
        response.raise_for_status()
        data = response.json()
        
        # Expecting data format: [{"name": "...", "slug": "...", "courses": [{"name": "...", ...}]}]
        for item in data:
            college_data = {
                "name": item.get("name"),
                "slug": item.get("slug"),
                "nirf_rank": item.get("nirf_rank"),
                "location": item.get("location"),
                "accreditation": item.get("accreditation"),
                "status": "published"
            }
            
            # Upsert college
            res = supabase.table("colleges").upsert(college_data, on_conflict="slug").execute()
            college_id = res.data[0]["id"]
            
            # Upsert courses
            if "courses" in item:
                for course in item["courses"]:
                    course_data = {
                        "college_id": college_id,
                        "name": course.get("name"),
                        "duration": course.get("duration"),
                        "seats": course.get("seats"),
                        "eligibility": course.get("eligibility")
                    }
                    # We might need a unique constraint on (college_id, name) to prevent duplicate courses
                    supabase.table("courses").upsert(course_data).execute()
        
        return {"message": "Sync completed", "count": len(data)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
