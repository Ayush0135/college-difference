from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth import router as auth_router
from sync import router as sync_router
from locations import router as locations_router
from banners import router as banner_router
from colleges import router as colleges_router
from admin import router as admin_router

app = FastAPI(title="Degree Difference API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(sync_router)
app.include_router(banner_router)
app.include_router(locations_router)
app.include_router(colleges_router)
app.include_router(admin_router)

@app.get("/")
async def root():
    return {"status": "ok", "message": "College Discovery Platform API is running"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
