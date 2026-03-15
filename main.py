import os
import shutil
import pandas as pd # type: ignore
import jwt #type:ignore
from datetime import datetime, timezone, timedelta
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from passlib.context import CryptContext

# --- 1. CONFIGURATION & SETUP ---
SECRET_KEY = "BLW_SUPER_SECRET_SECURE_KEY_2026"
ALGORITHM = "HS256"

app = FastAPI()
# --- Updated CORS Middleware ---
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://indian-railways-six.vercel.app", # Your specific Vercel domain
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# --- 2. DATABASE ARCHITECTURE ---
# Securely fetch the database URL from Render's Environment Variables.
# If it doesn't exist (e.g., you are coding locally), it falls back to SQLite.
DATABASE_URL = os.environ.get("DATABASE_URL")

# SQLAlchemy requires 'postgresql://', but Supabase sometimes provides 'postgres://'
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

SQLALCHEMY_DATABASE_URL = DATABASE_URL or "sqlite:///./blw_database.db"

# SQLite requires a special argument, but PostgreSQL will crash if you include it.
# This dynamic check ensures the code works perfectly on both your laptop AND the cloud.
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Employee(Base):
    __tablename__ = "employees"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    department = Column(String)
    dob = Column(String)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- 3. SECURITY & AUTHENTICATION ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/login")

def create_access_token(data: dict):
    expire = datetime.utcnow() + timedelta(hours=12)
    to_encode = data.copy()
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def init_admin():
    db = SessionLocal()
    admin = db.query(User).filter(User.username == "admin").first()
    if not admin:
        hashed_pw = pwd_context.hash("blw@2026")
        new_admin = User(username="admin", hashed_password=hashed_pw)
        db.add(new_admin)
        db.commit()
    db.close()

init_admin()

@app.post("/api/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not pwd_context.verify(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    token = create_access_token(data={"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}

def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# --- 4. CORE API ENDPOINTS ---
@app.post("/api/upload-excel/")
async def upload_excel(file: UploadFile = File(...), db: Session = Depends(get_db), current_user: str = Depends(verify_token)):
    try:
        if file.filename.endswith('.csv'):
            df = pd.read_csv(file.file)
        else:
            df = pd.read_excel(file.file)

        required_cols = ["Name", "Department", "DOB"]
        if not all(col in df.columns for col in required_cols):
            raise HTTPException(status_code=400, detail="File must contain exact columns: Name, Department, DOB")

        db.query(Employee).delete()
        records_added = 0
        for _, row in df.iterrows():
            new_emp = Employee(
                name=str(row["Name"]),
                department=str(row["Department"]),
                dob=str(row["DOB"])
            )
            db.add(new_emp)
            records_added += 1
        
        db.commit()
        return {"status": "success", "total_records": records_added}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/birthdays/today/")
def get_todays_birthdays(db: Session = Depends(get_db)):
    ist_tz = timezone(timedelta(hours=5, minutes=30))
    today_str = datetime.now(ist_tz).strftime("%m-%d")
    
    employees = db.query(Employee).all()
    celebrants = [f"{emp.name} ({emp.department})" for emp in employees if today_str in str(emp.dob)]
            
    return {"birthdays": celebrants}

@app.post("/api/upload-banner/")
async def upload_banner(file: UploadFile = File(...), current_user: str = Depends(verify_token)):
    os.makedirs("uploads", exist_ok=True)
    file_path = "uploads/emergency_banner.jpg" 
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {"message": "Success", "url": "/uploads/emergency_banner.jpg"}

@app.get("/api/get-banner/")
async def get_banner():
    if os.path.exists("uploads/emergency_banner.jpg"):
        return {"url": "/uploads/emergency_banner.jpg"}
    return {"url": None}