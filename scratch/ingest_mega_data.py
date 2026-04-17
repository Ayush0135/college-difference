import os
import requests
import json
from dotenv import load_dotenv

load_dotenv("backend/.env")

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

# Comprehensive Data for 4 Hubs
colleges_data = [
    # --- DELHI NCR ---
    {
        "name": "IIT Delhi", "slug": "iit-delhi", "location": "Hauz Khas, New Delhi", "nirf_rank": "2", "stream": "Engineering",
        "cutoff": "JEE Adv < 100", "deadline": "May 20, 2024", "fees": "₹2,20,000", "agency": "NIRF",
        "description": "Ranked among the top engineering institutes globally, IIT Delhi is known for its research excellence and elite faculty.",
        "avg_package": "₹20.0 LPA", "logo": "D", "status": "published",
        "brochure_url": "https://home.iitd.ac.in/pdf/IITD-Brochure.pdf",
        "courses": [
            {"name": "B.Tech Computer Science", "duration": "4 Years", "seats": 100, "fees": "₹2,20,000", "eligibility": "JEE Advanced"},
            {"name": "B.Tech Electrical Engineering", "duration": "4 Years", "seats": 120, "fees": "₹2,20,000", "eligibility": "JEE Advanced"},
            {"name": "B.Tech Mechanical Engineering", "duration": "4 Years", "seats": 90, "fees": "₹2,20,000", "eligibility": "JEE Advanced"}
        ]
    },
    {
        "name": "Delhi Technological University (DTU)", "slug": "dtu-delhi", "location": "Shahbad Daulatpur, Delhi", "nirf_rank": "29", "stream": "Engineering",
        "cutoff": "98.5%", "deadline": "June 10, 2024", "fees": "₹2,10,000", "agency": "NIRF",
        "description": "Formerly known as Delhi College of Engineering, it is a premier public technical university known for massive placements.",
        "avg_package": "₹16.5 LPA", "logo": "DTU", "status": "published"
    },
    {
        "name": "MDI Gurgaon", "slug": "mdi-gurgaon", "location": "Sukhrali, Gurgaon", "nirf_rank": "13", "stream": "Management",
        "cutoff": "98% CAT", "deadline": "Nov 25, 2024", "fees": "₹12,50,000", "agency": "NIRF",
        "description": "Management Development Institute is one of India's top-tier business schools known for industry interaction.",
        "avg_package": "₹26.7 LPA", "logo": "MDI", "status": "published"
    },
    
    # --- BENGALURU ---
    {
        "name": "IIIT Bangalore", "slug": "iiit-bangalore", "location": "Electronic City, Bengaluru", "nirf_rank": "74", "stream": "Engineering",
        "cutoff": "99.2%", "deadline": "June 15, 2024", "fees": "₹4,80,000", "agency": "NIRF",
        "description": "A premier research institution focused on Information Technology, with record-breaking placement stats every year.",
        "avg_package": "₹30.5 LPA", "logo": "IIITB", "status": "published"
    },
    {
        "name": "RV College of Engineering (RVCE)", "slug": "rvce-bengaluru", "location": "Mysuru Road, Bengaluru", "nirf_rank": "96", "stream": "Engineering",
        "cutoff": "97.8%", "deadline": "May 30, 2024", "fees": "₹2,50,000", "agency": "COMEDK",
        "description": "The most sought-after private engineering college in Karnataka, known for top-tier recruitment from tech giants.",
        "avg_package": "₹11.2 LPA", "logo": "RV", "status": "published"
    },
    {
        "name": "IIM Bangalore", "slug": "iim-bangalore", "location": "Bannerghatta Road, Bengaluru", "nirf_rank": "2", "stream": "Management",
        "cutoff": "99.5% CAT", "deadline": "Jan 20, 2024", "fees": "₹24,50,000", "agency": "EQUIS",
        "description": "One of the world's best management schools, offering a global perspective and elite networking opportunities.",
        "avg_package": "₹35.3 LPA", "logo": "IIMB", "status": "published"
    },

    # --- MUMBAI ---
    {
        "name": "IIT Bombay", "slug": "iit-bombay", "location": "Powai, Mumbai", "nirf_rank": "3", "stream": "Engineering",
        "cutoff": "JEE Adv < 50", "deadline": "May 25, 2024", "fees": "₹2,15,000", "agency": "NIRF",
        "description": "The dream destination for engineering aspirants, located in the heart of Mumbai's tech ecosystem.",
        "avg_package": "₹22.5 LPA", "logo": "IITB", "status": "published"
    },
    {
        "name": "S. P. Jain Institute of Management (SPJIMR)", "slug": "spjimr-mumbai", "location": "Andheri West, Mumbai", "nirf_rank": "20", "stream": "Management",
        "cutoff": "99% CAT", "deadline": "Nov 30, 2024", "fees": "₹20,50,000", "agency": "AMBA",
        "description": "Consistently ranked among the top 5 B-Schools in India, known for social sensitivity and values-based leadership.",
        "avg_package": "₹33.0 LPA", "logo": "SPJ", "status": "published"
    },
    {
        "name": "VJTI Mumbai", "slug": "vjti-mumbai", "location": "Matunga, Mumbai", "nirf_rank": "82", "stream": "Engineering",
        "cutoff": "99.4%", "deadline": "June 20, 2024", "fees": "₹85,000", "agency": "UGC",
        "description": "One of the oldest and most prestigious engineering institutes in Asia, offering low fees and high ROI.",
        "avg_package": "₹11.5 LPA", "logo": "VJTI", "status": "published"
    },

    # --- PUNE ---
    {
        "name": "COEP Technological University", "slug": "coep-pune", "location": "Shivajinagar, Pune", "nirf_rank": "73", "stream": "Engineering",
        "cutoff": "99.1% CET", "deadline": "June 15, 2024", "fees": "₹90,500", "agency": "UGC",
        "description": "The pride of Pune, COEP is a legacy institution known for its technical precision and strong industry ties.",
        "avg_package": "₹9.5 LPA", "logo": "COEP", "status": "published"
    },
    {
        "name": "SIBM Pune", "slug": "sibm-pune", "location": "Lavale, Pune", "nirf_rank": "17", "stream": "Management",
        "cutoff": "98% SNAP", "deadline": "Dec 10, 2024", "fees": "₹11,50,000", "agency": "NAAC",
        "description": "Symbiosis Institute of Business Management is the flagship brand of Symbiosis, offering world-class infrastructure.",
        "avg_package": "₹26.7 LPA", "logo": "SIBM", "status": "published"
    },
    {
        "name": "Pune Institute of Computer Technology (PICT)", "slug": "pict-pune", "location": "Dhankawadi, Pune", "nirf_rank": "201", "stream": "Engineering",
        "cutoff": "99.3%", "deadline": "July 01, 2024", "fees": "₹1,15,000", "agency": "UGC",
        "description": "Often called the 'IIT of the East', PICT is legendary for its computer science department and coding culture.",
        "avg_package": "₹12.0 LPA", "logo": "PICT", "status": "published"
    }
]

def ingest():
    headers = {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
    }
    
    for c in colleges_data:
        # Import College
        url = f"{SUPABASE_URL}/rest/v1/colleges"
        # Extract courses out for separate ingestion
        courses = c.pop("courses", []) if "courses" in c else []
        
        res = requests.post(url, headers=headers, json=c)
        if res.status_code in [201, 200, 204]:
            print(f"Ingested: {c['name']}")
            # Get ID (Supabase returns empty by default on POST unless specified in Prefer)
            # We'll fetch it back by slug
            fetch_res = requests.get(f"{url}?slug=eq.{c['slug']}", headers=headers)
            if fetch_res.status_code == 200 and fetch_res.json():
                cid = fetch_res.json()[0]['id']
                # Ingest Courses
                if courses:
                    for crs in courses:
                        crs['college_id'] = cid
                        requests.post(f"{SUPABASE_URL}/rest/v1/courses", headers=headers, json=crs)
                    print(f"  + Added {len(courses)} courses")
        else:
            print(f"Err: {c['name']} - {res.text}")

if __name__ == "__main__":
    ingest()
