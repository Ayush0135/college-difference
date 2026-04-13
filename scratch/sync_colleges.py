import os
import csv
from supabase import create_client, Client

SUPABASE_URL = "https://tzzcxtyhucaqyohxiysk.supabase.co"
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

def sync_colleges():
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    csv_file = "scratch/colleges.csv"
    if not os.path.exists(csv_file):
        print(f"Error: {csv_file} not found.")
        return

    colleges_data = []
    with open(csv_file, mode='r', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader) # skip headers or handle them
        
        for row in reader:
            if len(row) < 8: continue
            
            # CSV structure from previous head:
            # col 1 (idx 0): empty
            # col 2 (idx 1): City & State
            # col 3 (idx 2): College Name
            # col 4 (idx 3): Stream
            # col 5 (idx 4): Course
            # col 6 (idx 5): Specializations
            # col 7 (idx 6): Semester Fee
            # col 8 (idx 7): Fee (Annual)
            
            name = row[2].strip()
            location = row[1].strip()
            stream = row[3].strip()
            course = row[4].strip()
            specializations = row[5].strip()
            annual_fee = row[7].strip()
            
            if name and name != "College Name":
                colleges_data.append({
                    "name": name,
                    "location": location,
                    "stream": stream,
                    "course": course,
                    "specializations": specializations,
                    "annual_fee": annual_fee
                })

    print(f"Seeding {len(colleges_data)} course entries into 'colleges' table...")
    
    # Chunk the upload if necessary (Supabase limits)
    chunk_size = 50
    for i in range(0, len(colleges_data), chunk_size):
        chunk = colleges_data[i:i + chunk_size]
        try:
            res = supabase.table("colleges").upsert(chunk).execute()
            print(f"Synced chunk {i//chunk_size + 1}")
        except Exception as e:
            print(f"Error syncing chunk {i//chunk_size + 1}: {e}")

    print("College sync completed!")

if __name__ == "__main__":
    sync_colleges()
