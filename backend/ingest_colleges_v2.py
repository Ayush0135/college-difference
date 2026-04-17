import os
import csv
import re
import requests
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

CSV_PATH = "scratch/colleges.csv"

def sanitize_slug(name):
    return re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')

def ingest():
    colleges_data = {}

    with open(CSV_PATH, mode='r', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = None
        for i, row in enumerate(reader):
            # Skip empty or very short rows
            if not row or len(row) < 5:
                continue
            
            # Detect header rows
            if "College Name" in row:
                header = row
                continue
            
            if not header:
                continue
            
            # Map row to indices based on header
            try:
                city_state = row[header.index("City & State") if "City & State" in header else 1]
                college_name = row[header.index("College Name")]
                stream = row[header.index("Stream")]
                course_name = row[header.index("Course")]
                specialization = row[header.index("Specializations")]
                fee_annual = row[header.index("Fee (Annual)") if "Fee (Annual)" in header else header.index("Total Fee")]
                duration = row[header.index("Duration")]
                note = row[header.index("Special Note") if "Special Note" in header else -1]
            except (ValueError, IndexError):
                continue

            if not college_name or "College Name" in college_name:
                continue

            key = (college_name, city_state)
            if key not in colleges_data:
                colleges_data[key] = {
                    "name": college_name,
                    "location": city_state,
                    "stream": stream,
                    "courses": []
                }
            
            full_course_name = f"{course_name} {specialization}".strip()
            colleges_data[key]["courses"].append({
                "name": full_course_name,
                "duration": duration,
                "fees": fee_annual,
                "eligibility": note if note else "10+2 with relevant subjects"
            })

    print(f"Found {len(colleges_data)} unique colleges. Ingesting...")

    for key, data in colleges_data.items():
        slug = sanitize_slug(data["name"])
        
        # Check if exists
        check = supabase.table("colleges").select("id").eq("slug", slug).execute()
        if check.data:
            print(f"Skipping {data['name']} (already exists)")
            continue
        
        # Insert College
        try:
            res = supabase.table("colleges").insert({
                "name": data["name"],
                "slug": slug,
                "location": data["location"],
                "stream": data["stream"],
                "rank": 999,
                "accreditation": "UGC Approved",
                "agency": "UGC",
                "description": f"{data['name']} is a premier institution located in {data['location']}, offering specialized programs in {data['stream']}.",
                "cutoff": "75",
                "deadline": "30 May 2026",
                "fees": data["courses"][0]["fees"] if data["courses"] else "NA",
                "brochure_url": "",
                "logo": data["name"][0].upper(),
                "status": "published"
            }).execute()
            
            if not res.data:
                continue
                
            college_id = res.data[0]["id"]
            
            # Insert Courses
            for course in data["courses"]:
                supabase.table("courses").insert({
                    "college_id": college_id,
                    "name": course["name"],
                    "duration": course["duration"],
                    "fees": course["fees"],
                    "eligibility": course["eligibility"]
                }).execute()
                
            print(f"✅ Ingested {data['name']}")
        except Exception as e:
            print(f"❌ Error ingesting {data['name']}: {e}")

if __name__ == "__main__":
    ingest()
