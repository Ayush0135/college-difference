import os
import asyncio
from supabase import create_client, Client

# Hardcoded data from constants.ts to ensure sync
INDIAN_CITIES = [
  "Agartala", "Agra", "Ahmedabad", "Ahmednagar", "Aizawl", "Ajmer", "Akola", "Aligarh", "Allahabad", 
  "Amravati", "Ambattur", "Amritsar", "Asansol", "Aurangabad", "Avadi", "Bareilly", "Belgaum", 
  "Bellary", "Bengaluru", "Berhampur", "Bhagalpur", "Bhatpara", "Bhilai", "Bhilwara", "Bhopal", 
  "Bhubaneswar", "Bhiwandi", "Bikaner", "Bilaspur", "Bokaro", "Chandigarh", "Chennai", "Coimbatore", 
  "Cuttack", "Daman", "Davanagere", "Dehradun", "Delhi", "Dhanbad", "Dhule", "Durgapur", "Faridabad", 
  "Firozabad", "Gandhinagar", "Gangtok", "Gaya", "Ghaziabad", "Gopalpur", "Gorakhpur", "Gulbarga", 
  "Guntur", "Gurgaon", "Guwahati", "Gwalior", "Howrah", "Hubli-Dharwad", "Hyderabad", "Imphal", 
  "Indore", "Itanagar", "Jabalpur", "Jaipur", "Jalandhar", "Jalgaon", "Jamnagar", "Jammu", 
  "Jamshedpur", "Jhansi", "Jodhpur", "Kadapa", "Kalyan-Dombivli", "Kanpur", "Kochi", "Kohima", 
  "Kolhapur", "Kolkata", "Kollam", "Korba", "Kota", "Kozhikode", "Kurnool", "Latur", "Loni", 
  "Lucknow", "Ludhiana", "Madurai", "Maheshtala", "Malegaon", "Mangalore", "Mathura", "Meerut", 
  "Mira-Bhayandar", "Moradabad", "Mumbai", "Muzaffarnagar", "Muzaffarpur", "Mysore", "Nagpur", 
  "Nanded", "Nashik", "Navi Mumbai", "Nellore", "Noida", "Panaji", "Panihat", "Patiala", "Patna", 
  "Pimpri-Chinchwad", "Pondicherry", "Pune", "Rajahmundry", "Rajkot", "Rajpur Sonarpur", "Rampur", 
  "Ranchi", "Rohtak", "Raipur", "Saharanpur", "Salem", "Sangli-Miraj & Kupwad", "Shahjahanpur", 
  "Shimla", "Siliguri", "Silvassa", "Solapur", "South Dumdum", "Srinagar", "Surat", "Thane", 
  "Tiruchirappalli", "Tirunelveli", "Tirupati", "Tirupur", "Udaipur", "Ujjain", "Ulhasnagar", 
  "Vadodara", "Varanasi", "Vasai-Virar", "Vijayawada", "Visakhapatnam", "Warangal"
]

STUDY_GOALS = [
  "Architecture", "Arts", "Commerce", "Design", "Education", "Engineering", 
  "Hotel Management", "Law", "Management", "Medical", "Pharmacy", "Science"
]

SUPABASE_URL = "https://tzzcxtyhucaqyohxiysk.supabase.co"
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

async def sync():
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("Connected to Supabase. Starting sync...")

        # Create tables using RPC or simple execution if allowed
        # But wait, create_client.table().insert() is for data.
        # For DDL (CREATE TABLE), we usually need to use the SQL API.
        # Since I can't use the MCP SQL tool, I'll try to use the raw SQL endpoint if possible,
        # but usually postgrest doesn't allow random DDL.
        
        # ACTUALLY, if I have the service role key, I can try to use it to push data
        # but I still need the table to exist.
        
        # I'll try a "hack": Use rpc('exec_sql', {'sql': ...}) if it exists (some projects have it)
        # But most don't.
        
        # IF I CAN'T CREATE TABLES VIA SCRIPT, I'LL TELL THE USER.
        # BUT WAIT! Maybe I can use the 'supabase-py' to just test if 'cities' exists now.
        
        print("Checking if 'cities' table exists...")
        try:
            supabase.table("cities").select("*").limit(1).execute()
            print("'cities' table found.")
        except Exception:
            print("'cities' table not found. Attempting to create via custom RPC if available...")
            # If this fails, I'll have to ask the user to run the SQL in the dashboard.
            pass

        # Pushing data for Cities
        print(f"Syncing {len(INDIAN_CITIES)} cities...")
        city_data = [{"name": city} for city in INDIAN_CITIES]
        res = supabase.table("cities").upsert(city_data, on_conflict="name").execute()
        print(f"Synced cities: {len(res.data)}")

        # Pushing data for Goals
        print(f"Syncing {len(STUDY_GOALS)} goals...")
        goal_data = [{"name": goal, "slug": goal.lower().replace(" ", "-")} for goal in STUDY_GOALS]
        res = supabase.table("study_goals").upsert(goal_data, on_conflict="name").execute()
        print(f"Synced goals: {len(res.data)}")

        print("Sync completed successfully!")
    except Exception as e:
        print(f"Sync failed: {str(e)}")

if __name__ == "__main__":
    asyncio.run(sync())
