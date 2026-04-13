import os
import csv
from supabase import create_client, Client

SUPABASE_URL = "https://tzzcxtyhucaqyohxiysk.supabase.co"
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

def sync_colleges_dynamic():
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # 1. Detect columns via a dry-run insert or just a select
    try:
        # Get one row to see columns
        res = supabase.table("colleges").select("*").limit(1).execute()
        if hasattr(res, 'data') and len(res.data) > 0:
            available_cols = list(res.data[0].keys())
        else:
            # Fallback: parse from a failed select error if we could, 
            # but let's just try to push and catch.
            # Actually, I Design the data based on the most common columns.
            available_cols = ['name', 'location', 'stream', 'course', 'specializations', 'annual_fee']
    except Exception as e:
        print(f"Column detection failed: {e}")
        available_cols = ['name', 'location']

    print(f"Available columns detected: {available_cols}")

    csv_file = "scratch/colleges.csv"
    colleges_data = []
    with open(csv_file, mode='r', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader)
        for row in reader:
            if len(row) < 8: continue
            
            entry = {}
            if 'name' in available_cols: entry['name'] = row[2].strip()
            if 'location' in available_cols: entry['location'] = row[1].strip()
            if 'stream' in available_cols: entry['stream'] = row[3].strip()
            if 'course' in available_cols: entry['course'] = row[4].strip()
            if 'specializations' in available_cols: entry['specializations'] = row[5].strip()
            if 'annual_fee' in available_cols: entry['annual_fee'] = row[7].strip()
            
            if entry.get('name') and entry['name'] != "College Name":
                colleges_data.append(entry)

    print(f"Pusing {len(colleges_data)} entries...")
    chunk_size = 50
    for i in range(0, len(colleges_data), chunk_size):
        chunk = colleges_data[i:i + chunk_size]
        try:
            supabase.table("colleges").upsert(chunk).execute()
            print(f"Chunk {i//chunk_size + 1} synced")
        except Exception as e:
            print(f"Error in chunk {i//chunk_size + 1}: {e}")

if __name__ == "__main__":
    sync_colleges_dynamic()
