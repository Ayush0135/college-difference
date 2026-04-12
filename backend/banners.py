import os
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from supabase import create_client, Client

router = APIRouter()

# Supabase setup
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

class BannerData(BaseModel):
    title: str
    image_url: str
    redirect_url: Optional[str]
    type: str # 'fair', 'alert', 'utility'
    expiry_date: Optional[datetime]

@router.get("/banners")
async def get_active_banners():
    now = datetime.utcnow().isoformat()
    res = supabase.table("banner_ads")\
        .select("*")\
        .eq("is_active", True)\
        .or_(f"expiry_date.gt.{now},expiry_date.is.null")\
        .execute()
    return res.data

@router.post("/banners")
async def create_banner(banner: BannerData):
    # In production, check for Admin role here
    res = supabase.table("banner_ads").insert(banner.dict()).execute()
    if not res.data:
        raise HTTPException(status_code=400, detail="Failed to create banner")
    return res.data[0]

@router.post("/banners/{banner_id}/click")
async def track_click(banner_id: str):
    # Atomic increment of click count
    res = supabase.rpc("increment_banner_click", {"banner_id": banner_id}).execute()
    return {"status": "success"}

# ROI Helper
@router.get("/calculate-roi")
async def get_college_roi(avg_package: float, total_fees: float):
    """
    ROI = (Average Package / Total Fees) * 100
    Higher is better.
    """
    if total_fees == 0:
        return 0
    roi = (avg_package / total_fees)
    return {"roi": round(roi, 2), "percentage": round(roi * 100, 2)}
