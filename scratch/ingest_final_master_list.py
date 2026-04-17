import os
import requests
import json
from dotenv import load_dotenv

load_dotenv("backend/.env")

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

# 40 Institutions (10 per hub)
data = [
    # --- DELHI NCR ---
    {"name": "IIT Delhi", "slug": "iit-delhi", "loc": "Hauz Khas, New Delhi", "rank": 2, "stream": "Engineering", "fees": "₹2,20,000", "pkg": "₹20.0 LPA"},
    {"name": "DTU Delhi", "slug": "dtu-delhi", "loc": "Shahbad Daulatpur, Delhi", "rank": 29, "stream": "Engineering", "fees": "₹2,10,000", "pkg": "₹16.5 LPA"},
    {"name": "NSUT Delhi", "slug": "nsut-delhi", "loc": "Dwarka, New Delhi", "rank": 60, "stream": "Engineering", "fees": "₹2,05,000", "pkg": "₹15.2 LPA"},
    {"name": "IIIT Delhi", "slug": "iiit-delhi-main", "loc": "Okhla, New Delhi", "rank": 75, "stream": "Engineering", "fees": "₹4,50,000", "pkg": "₹18.5 LPA"},
    {"name": "MDI Gurgaon", "slug": "mdi-gurgaon", "loc": "Sukhrali, Gurgaon", "rank": 13, "stream": "Management", "fees": "₹12,80,000", "pkg": "₹26.7 LPA"},
    {"name": "FMS Delhi", "slug": "fms-delhi", "loc": "North Campus, Delhi", "rank": 1, "stream": "Management", "fees": "₹10,500", "pkg": "₹32.4 LPA"},
    {"name": "Hindu College", "slug": "hindu-college-delhi", "loc": "North Campus, Delhi", "rank": 1, "stream": "Arts", "fees": "₹25,000", "pkg": "₹8.5 LPA"},
    {"name": "Shaheed Sukhdev College", "slug": "sscbbs-delhi", "loc": "Rohini, Delhi", "rank": 1, "stream": "Management", "fees": "₹25,000", "pkg": "₹12.0 LPA"},
    {"name": "JNU New Delhi", "slug": "jnu-delhi", "loc": "New Delhi", "rank": 2, "stream": "Arts", "fees": "₹1,200", "pkg": "₹6.5 LPA"},
    {"name": "Amity University Noida", "slug": "amity-noida", "loc": "Sector 125, Noida", "rank": 35, "stream": "Engineering", "fees": "₹3,20,000", "pkg": "₹7.5 LPA"},

    # --- BENGALURU ---
    {"name": "IISc Bengaluru", "slug": "iisc-bengaluru", "loc": "CV Raman Road, Bengaluru", "rank": 1, "stream": "Engineering", "fees": "₹45,000", "pkg": "₹25.0 LPA"},
    {"name": "IIM Bangalore", "slug": "iim-bangalore", "loc": "Bannerghatta Rd, Bengaluru", "rank": 2, "stream": "Management", "fees": "₹24,50,000", "pkg": "₹35.3 LPA"},
    {"name": "RVCE Bengaluru", "slug": "rvce-bengaluru", "loc": "Mysuru Rd, Bengaluru", "rank": 96, "stream": "Engineering", "fees": "₹2,50,000", "pkg": "₹11.2 LPA"},
    {"name": "PES University", "slug": "pes-bengaluru", "loc": "RR Nagar, Bengaluru", "rank": 100, "stream": "Engineering", "fees": "₹4,20,000", "pkg": "₹12.5 LPA"},
    {"name": "BMS College of Engineering", "slug": "bmsce-bengaluru", "loc": "Basavanagudi, Bengaluru", "rank": 73, "stream": "Engineering", "fees": "₹2,30,000", "pkg": "₹9.8 LPA"},
    {"name": "IIIT Bangalore", "slug": "iiit-bangalore", "loc": "Electronic City, Bengaluru", "rank": 74, "stream": "Engineering", "fees": "₹4,80,000", "pkg": "₹30.5 LPA"},
    {"name": "MSRIT Bengaluru", "slug": "msrit-bengaluru", "loc": "MSR Nagar, Bengaluru", "rank": 78, "stream": "Engineering", "fees": "₹2,20,000", "pkg": "₹9.2 LPA"},
    {"name": "St. Johns Medical College", "slug": "st-johns-medical", "loc": "Koramangala, Bengaluru", "rank": 13, "stream": "Medical", "fees": "₹7,50,000", "pkg": "₹10.5 LPA"},
    {"name": "Mount Carmel College", "slug": "mcc-bengaluru", "loc": "Vasanth Nagar, Bengaluru", "rank": 5, "stream": "Arts", "fees": "₹85,000", "pkg": "₹6.2 LPA"},
    {"name": "Christ University", "slug": "christ-bengaluru", "loc": "Hosur Rd, Bengaluru", "rank": 60, "stream": "Management", "fees": "₹2,50,000", "pkg": "₹8.5 LPA"},

    # --- MUMBAI ---
    {"name": "IIT Bombay", "slug": "iit-bombay", "loc": "Powai, Mumbai", "rank": 3, "stream": "Engineering", "fees": "₹2,15,000", "pkg": "₹22.5 LPA"},
    {"name": "ICT Mumbai", "slug": "ict-mumbai", "loc": "Matunga, Mumbai", "rank": 24, "stream": "Engineering", "fees": "₹85,000", "pkg": "₹10.5 LPA"},
    {"name": "VJTI Mumbai", "slug": "vjti-mumbai", "loc": "Matunga, Mumbai", "rank": 82, "stream": "Engineering", "fees": "₹85,000", "pkg": "₹11.5 LPA"},
    {"name": "SPJIMR Mumbai", "slug": "spjimr-mumbai", "loc": "Andheri West, Mumbai", "rank": 20, "stream": "Management", "fees": "₹20,50,000", "pkg": "₹33.0 LPA"},
    {"name": "JBIMS Mumbai", "slug": "jbims-mumbai", "loc": "Churchgate, Mumbai", "rank": 10, "stream": "Management", "fees": "₹3,00,000", "pkg": "₹28.2 LPA"},
    {"name": "NMIMS Mumbai", "slug": "nmims-mumbai", "loc": "Vile Parle, Mumbai", "rank": 21, "stream": "Management", "fees": "₹11,50,000", "pkg": "₹23.5 LPA"},
    {"name": "TISS Mumbai", "slug": "tiss-mumbai", "loc": "Deonar, Mumbai", "rank": 1, "stream": "Arts", "fees": "₹65,000", "pkg": "₹24.0 LPA"},
    {"name": "St. Xaviers College", "slug": "st-xaviers-mumbai", "loc": "Fort, Mumbai", "rank": 4, "stream": "Arts", "fees": "₹10,000", "pkg": "₹7.5 LPA"},
    {"name": "HR College of Commerce", "slug": "hr-college-mumbai", "loc": "Churchgate, Mumbai", "rank": 5, "stream": "Commerce", "fees": "₹12,000", "pkg": "₹6.8 LPA"},
    {"name": "KJ Somaiya", "slug": "kj-somaiya-mumbai", "loc": "Vidyavihar, Mumbai", "rank": 110, "stream": "Engineering", "fees": "₹4,10,000", "pkg": "₹8.2 LPA"},

    # --- PUNE ---
    {"name": "COEP Pune", "slug": "coep-pune", "loc": "Shivajinagar, Pune", "rank": 73, "stream": "Engineering", "fees": "₹90,500", "pkg": "₹9.5 LPA"},
    {"name": "PICT Pune", "slug": "pict-pune", "loc": "Dhankawadi, Pune", "rank": 201, "stream": "Engineering", "fees": "₹1,15,000", "pkg": "₹12.0 LPA"},
    {"name": "VIT Pune", "slug": "vit-pune", "loc": "Bibwewadi, Pune", "rank": 150, "stream": "Engineering", "fees": "₹1,90,000", "pkg": "₹8.5 LPA"},
    {"name": "MIT-WPU Pune", "slug": "mit-wpu-pune", "loc": "Kothrud, Pune", "rank": 115, "stream": "Engineering", "fees": "₹3,20,000", "pkg": "₹7.2 LPA"},
    {"name": "SIBM Pune", "slug": "sibm-pune", "loc": "Lavale, Pune", "rank": 17, "stream": "Management", "fees": "₹11,50,000", "pkg": "₹26.7 LPA"},
    {"name": "SCMHRD Pune", "slug": "scmhrd-pune", "loc": "Hinjewadi, Pune", "rank": 25, "stream": "Management", "fees": "₹12,00,000", "pkg": "₹24.5 LPA"},
    {"name": "Fergusson College", "slug": "fergusson-pune", "loc": "FC Road, Pune", "rank": 3, "stream": "Arts", "fees": "₹15,000", "pkg": "₹6.5 LPA"},
    {"name": "AFMC Pune", "slug": "afmc-pune", "loc": "Wanowrie, Pune", "rank": 1, "stream": "Medical", "fees": "₹50,000", "pkg": "₹15.0 LPA"},
    {"name": "Symbiosis Law School", "slug": "sls-pune", "loc": "Viman Nagar, Pune", "rank": 3, "stream": "Law", "fees": "₹3,50,000", "pkg": "₹10.5 LPA"},
    {"name": "AIT Pune", "slug": "ait-pune", "loc": "Dighi, Pune", "rank": 120, "stream": "Engineering", "fees": "₹2,10,000", "pkg": "₹13.5 LPA"}
]

def ingest():
    headers = {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
    }
    
    for c in data:
        payload = {
            "name": c["name"],
            "slug": c["slug"],
            "location": c["loc"],
            "rank": c["rank"],
            "nirf_rank": str(c["rank"]),
            "stream": c["stream"],
            "fees": c["fees"],
            "avg_package": c["pkg"],
            "cutoff": "Varies by Entrance",
            "deadline": "May - July 2024",
            "agency": "NIRF" if c["rank"] < 50 else "UGC",
            "logo": c["name"][0],
            "status": "published",
            "description": f"{c['name']} is a premier {c['stream']} institution located in {c['loc']}. It is consistently ranked among the top colleges in India."
        }
        res = requests.post(f"{SUPABASE_URL}/rest/v1/colleges", headers=headers, json=payload)
        if res.status_code < 300:
            print(f"OK: {c['name']}")
        else:
            print(f"SKIP (Exists or Error): {c['name']}")

if __name__ == "__main__":
    ingest()
