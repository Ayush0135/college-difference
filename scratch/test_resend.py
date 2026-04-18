import requests
import os
from dotenv import load_dotenv

load_dotenv("../backend/.env")

def test_resend():
    api_key = os.getenv("RESEND_API_KEY")
    from_email = os.getenv("RESEND_FROM_EMAIL")
    test_to = "23csa2bc322@vgu.ac.in"

    print(f"Testing Resend API with Key: {api_key[:5]}...")
    
    res = requests.post(
        "https://api.resend.com/emails",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        },
        json={
            "from": f"Degree Difference <{from_email}>",
            "to": [test_to],
            "subject": "Test: Resend API Integration",
            "html": "<strong>Your Resend API is working perfectly for Degree Difference!</strong>"
        }
    )
    
    if res.status_code == 200:
        print("✅ SUCCESS: Test email sent!")
        print(f"Response: {res.json()}")
    else:
        print(f"❌ FAILED: {res.status_code}")
        print(f"Error: {res.text}")

if __name__ == "__main__":
    test_resend()
