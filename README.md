# BLW Centralized Digital Workspace

A centralized intranet portal designed for **Banaras Locomotive Works (BLW)** to streamline internal communication and provide employees with a unified digital workspace.

The platform brings together internal resources, tools, and information in a single interface, making it easier for employees to access services and updates without navigating multiple systems.

---

## Features

* Secure login system for restricted access
* Admin dashboard for managing internal resources
* Centralized access to employee tools and information
* Media handling and storage for internal assets
* Lightweight and responsive user interface

---

## Tech Stack

### Frontend

* HTML
* CSS
* JavaScript

### Backend

* Python
* FastAPI

### Database

* Supabase (PostgreSQL)

### Media Storage

* Cloudinary

---

## Project Structure

```
BLW-Centralized-Digital-Workspace
│
├── backend
│   ├── main.py                # FastAPI application entry point
│   ├── blw_database.db        # Local database (development/testing)
│   ├── __init__.py
│   └── __pycache__            # Python cache files
│
├── frontend
│   ├── admin.html             # Admin dashboard page
│   ├── admin.css              # Admin dashboard styles
│   ├── admin.js               # Admin dashboard logic
│   ├── index.html             # Main homepage
│   ├── login.html             # Login page
│   ├── style.css              # Global styles
│   └── script.js              # Frontend JavaScript logic
│
├── assets
│   ├── images                 # Static image assets
│   └── uploads                # Uploaded media files
│
├── data
│   └── test_employees.csv     # Sample employee dataset
│
├── venv                       # Python virtual environment
├── requirements.txt           # Python dependencies
├── .gitignore                 # Git ignore rules
└── README.md                  # Project documentation
```

---

## Environment Variables

Create a `.env` file inside the **backend** directory and configure the following variables.

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_api_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

SECRET_KEY=your_secret_key
BASE_URL=http://localhost:8000
```

---

## Running the Project Locally

### 1. Clone the repository

```
git clone <repository-url>
cd BLW-Centralized-Digital-Workspace
```

### 2. Create a virtual environment

```
python -m venv venv
```

Activate it

Windows

```
venv\Scripts\activate
```

Linux / macOS

```
source venv/bin/activate
```

### 3. Install dependencies

```
pip install -r requirements.txt
```

### 4. Run the backend server

```
uvicorn backend.main:app --reload
```

The API will start at:

```
http://127.0.0.1:8000
```

---

## Deployment

The backend can be deployed on platforms such as:

* Render
* AWS
* Azure

Example production command:

```
uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

The frontend can be hosted on:

* Vercel
* Netlify
* Apache / Nginx servers

Ensure the frontend API base URL points to the deployed backend.

---

## Notes

* Supabase manages the primary PostgreSQL database.
* Cloudinary is used for image and media storage.
* SQLite is included only for local testing and development.

---

## Author

Developed by **Amaan Ansari**
