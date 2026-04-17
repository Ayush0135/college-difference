import os
from dotenv import load_dotenv

# Test with current .env (I just edited it to remove quotes)
load_dotenv(".env")
pwd = os.environ.get("SMTP_PASSWORD")
print(f"PWD: [{pwd}]")

# Let's see if it's the mock value
MOCK_VAL = 'your_gmail_app_password'
if pwd == MOCK_VAL:
    print("MATCHES MOCK")
else:
    print("DOES NOT MATCH MOCK")
