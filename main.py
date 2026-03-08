from datetime import datetime, timezone, timedelta
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import pandas as pd
import io
import os
import shutil
import time

app = FastAPI(title="BLW Admin API")

# --- CORS Configuration ---
# This allows your HTML frontend to talk to this Python backend safely
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- FOLDER SETUP FOR IMAGES ---
# Create a folder to store the uploaded banners if it doesn't exist
if not os.path.exists("uploads"):
    os.makedirs("uploads")

# Tell FastAPI to make this folder publicly accessible via the web
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# --- IN-MEMORY DATABASE ---
# For tomorrow's presentation, we will hold the data in memory.
# Next week, you can easily swap this out for SQLite or PostgreSQL.
employee_data = []

@app.get("/")
def read_root():
    return {"status": "BLW Server is actively running"}

@app.post("/api/upload-excel/")
async def upload_excel(file: UploadFile = File(...)):
    # 1. Security check: Ensure it's an Excel or CSV file
    if not file.filename.endswith(('.xlsx', '.xls', '.csv')):
        raise HTTPException(status_code=400, detail="Invalid format. Please upload an Excel or CSV file.")
    
    try:
        # 2. Read the file into memory
        contents = await file.read()
        
        # 3. Parse it with Pandas
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(contents))
        else:
            df = pd.read_excel(io.BytesIO(contents))
            
        # 4. Verify Teertha's required columns exist
        required_columns = ['Name', 'Department', 'DOB']
        if not all(col in df.columns for col in required_columns):
            raise HTTPException(status_code=400, detail=f"File must contain exact columns: {', '.join(required_columns)}")
            
        # 5. Clean the dates and save to our "database"
        df['DOB'] = df['DOB'].astype(str)
        
        global employee_data
        employee_data = df.to_dict(orient="records")
        
        return {
            "message": "Database successfully synchronized!", 
            "total_records": len(employee_data),
            "preview": employee_data[:3] # Send back a 3-row preview as proof
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")


@app.get("/api/birthdays/today/")
def get_todays_birthdays():
    # 1. Force the server to use Indian Standard Time (UTC + 5:30)
    ist_tz = timezone(timedelta(hours=5, minutes=30))
    today_str = datetime.now(ist_tz).strftime("%m-%d") 
    
    celebrants = []
    # 2. Search the database
    for emp in employee_data:
        dob = str(emp.get("DOB", ""))
        # Using 'in' instead of 'endswith' makes it bulletproof just in case 
        # Excel tries to add hidden timestamps (like 00:00:00) to the dates!
        if today_str in dob:
            celebrants.append(f"{emp['Name']} ({emp['Department']})")
            
    return {"birthdays": celebrants}

# --- NEW: BANNER UPLOAD ENDPOINTS ---

@app.post("/api/upload-banner/")
async def upload_banner(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        raise HTTPException(status_code=400, detail="Only JPEG or PNG images are allowed.")

    # Always overwrite the exact same file to keep the server clean
    file_location = "uploads/emergency_banner.jpg"
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)

    return {"message": "Emergency banner updated successfully!"}

@app.get("/api/get-banner/")
def get_banner():
    # Check if a custom banner has been uploaded
    if os.path.exists("uploads/emergency_banner.jpg"):
        # The ?t= timestamp is a "Cache Buster". It forces the browser to 
        # download the new image instead of using an old saved version.
        return {
            "has_custom": True, 
            "url": f"http://127.0.0.1:8000/uploads/emergency_banner.jpg?t={int(time.time())}"
        }
    return {"has_custom": False}