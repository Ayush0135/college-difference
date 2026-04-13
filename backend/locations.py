import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from supabase import create_client, Client

router = APIRouter()

# Supabase setup
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) if SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY != "your_service_role_key_here" else None

class LocationSave(BaseModel):
    city: str
    goal: str
    email: str = None

@router.get("/locations/cities")
async def get_cities():
    if not supabase:
        return {"error": "DB not configured"}
    
    res = supabase.table("cities").select("*").execute()
    return res.data

@router.get("/locations/goals")
async def get_goals():
    if not supabase:
        return {"error": "DB not configured"}
    
    res = supabase.table("study_goals").select("*").execute()
    return res.data

@router.post("/locations/save-preference")
async def save_preference(data: LocationSave):
    if not supabase:
        # Mock success if not configured
        return {"message": "Saved locally (DB not configured)"}
    
    try:
        # Update user profile if exists, or just log the selection
        # For now, we'll upsert into a user_preferences table
        res = supabase.table("user_preferences").upsert({
            "email": data.email,
            "city": data.city,
            "goal": data.goal,
            "updated_at": "now()"
        }).execute()
        
        return {"message": "Preference saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
