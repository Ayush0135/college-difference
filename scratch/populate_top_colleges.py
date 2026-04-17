import os
import requests
import json
from dotenv import load_dotenv

load_dotenv("backend/.env")

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

colleges_to_import = [
    {
        "name": "Indian Institute of Science (IISc)",
        "slug": "iisc-bengaluru",
        "location": "Bengaluru, Karnataka",
        "nirf_rank": "1",
        "accreditation": "NAAC A++",
        "stream": "Engineering",
        "cutoff": "99.8",
        "deadline": "May 30, 2024",
        "description": "Ranked #1 in University category. IISc is the premier institute for advanced scientific and technological research and education in India.",
        "logo": "https://api.dicebear.com/7.x/initials/svg?seed=IISc",
        "fees": "₹45,000",
        "agency": "NIRF"
    },
    {
        "name": "Hindu College",
        "slug": "hindu-college-delhi",
        "location": "New Delhi, Delhi",
        "nirf_rank": "1",
        "accreditation": "UGC",
        "stream": "Arts",
        "cutoff": "98.5",
        "deadline": "June 15, 2024",
        "description": "Ranked #1 in College category. Established in 1899, it is one of the oldest and most prestigious constituent colleges of the University of Delhi.",
        "logo": "https://api.dicebear.com/7.x/initials/svg?seed=HC",
        "fees": "₹25,000",
        "agency": "UGC"
    },
    {
        "name": "Manipal Academy of Higher Education",
        "slug": "mahe-manipal",
        "location": "Manipal, Karnataka",
        "nirf_rank": "4",
        "accreditation": "NAAC A++",
        "stream": "Medical",
        "cutoff": "92.0",
        "deadline": "April 20, 2024",
        "description": "A premier private university offering world-class medical and engineering education with global recognition.",
        "logo": "https://api.dicebear.com/7.x/initials/svg?seed=MAHE",
        "fees": "₹6,50,000",
        "agency": "NIRF"
    },
    {
        "name": "St. Xavier's College",
        "slug": "st-xaviers-kolkata",
        "location": "Kolkata, West Bengal",
        "nirf_rank": "6",
        "accreditation": "UGC",
        "stream": "Commerce",
        "cutoff": "95.0",
        "deadline": "June 10, 2024",
        "description": "Renowned for its excellence in commerce and arts, producing some of the finest professionals in India.",
        "logo": "https://api.dicebear.com/7.x/initials/svg?seed=SXC",
        "fees": "₹82,000",
        "agency": "UGC"
    },
    {
        "name": "Indian Institute of Management (IIM) Ahmedabad",
        "slug": "iim-ahmedabad",
        "location": "Ahmedabad, Gujarat",
        "nirf_rank": "1",
        "accreditation": "EQUIS",
        "stream": "Management",
        "cutoff": "99.9",
        "deadline": "Jan 15, 2024",
        "description": "The peak of management education in India. Consistently ranked #1 for its MBA programs.",
        "logo": "https://api.dicebear.com/7.x/initials/svg?seed=IIMA",
        "fees": "₹28,00,000",
        "agency": "NIRF"
    },
    {
        "name": "Miranda House",
        "slug": "miranda-house-delhi",
        "location": "New Delhi, Delhi",
        "nirf_rank": "2",
        "accreditation": "UGC",
        "stream": "Arts",
        "cutoff": "97.5",
        "deadline": "June 20, 2024",
        "description": "Top-ranked women's college by the University of Delhi, known for academic rigor and empowering atmosphere.",
        "logo": "https://api.dicebear.com/7.x/initials/svg?seed=MH",
        "fees": "₹18,000",
        "agency": "UGC"
    },
    {
        "name": "Anna University",
        "slug": "anna-university-chennai",
        "location": "Chennai, Tamil Nadu",
        "nirf_rank": "13",
        "accreditation": "NAAC A++",
        "stream": "Engineering",
        "cutoff": "195/200",
        "deadline": "July 12, 2024",
        "description": "State university focused on quality engineering education and research. Gateway to top TNEA colleges.",
        "logo": "https://api.dicebear.com/7.x/initials/svg?seed=AU",
        "fees": "₹65,000",
        "agency": "NIRF"
    },
    {
        "name": "XLRI Jamshedpur",
        "slug": "xlri-jamshedpur",
        "location": "Jamshedpur, Jharkhand",
        "nirf_rank": "9",
        "accreditation": "AACSB",
        "stream": "Management",
        "cutoff": "96.0",
        "deadline": "Nov 30, 2023",
        "description": "India's oldest management institute, legendary for its Human Resource Management program.",
        "logo": "https://api.dicebear.com/7.x/initials/svg?seed=XLRI",
        "fees": "₹25,80,000",
        "agency": "NIRF"
    }
]

def sync():
    headers = {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
    }
    
    for college in colleges_to_import:
        # Simple UPSERT via REST API
        url = f"{SUPABASE_URL}/rest/v1/colleges"
        # We use slug as unique key
        res = requests.post(url, headers=headers, json=college)
        if res.status_code in [201, 200, 204]:
            print(f"Synced: {college['name']}")
        else:
            print(f"Failed: {college['name']} - {res.text}")

if __name__ == "__main__":
    sync()
