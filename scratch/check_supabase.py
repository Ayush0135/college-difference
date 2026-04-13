import os
import asyncio
from supabase import create_client, Client

url = "https://tzzcxtyhucaqyohxiysk.supabase.co"
key = "sb_publishable_wb1klnZK9W17p96Wk6fQkw_8B96Gneo"

async def check():
    try:
        supabase: Client = create_client(url, key)
        # Try to fetch something public
        res = supabase.table("cities").select("*").limit(1).execute()
        print(f"Connection successful: {res.data}")
    except Exception as e:
        print(f"Connection failed: {str(e)}")

if __name__ == "__main__":
    asyncio.run(check())
