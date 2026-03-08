# BLW Centralized Digital Workspace

A modern, lightweight entry point for the Banaras Locomotive Works (BLW) intranet ecosystem.

This portal consolidates critical enterprise applications, BI dashboards, and employee tools into one structured interface — designed for speed, clarity, and long-term maintainability.

🔗 **Live Deployment:** [indian-railways-six.vercel.app](https://indian-railways-six.vercel.app/)

> **Note:** Internal `10.x.x.x` intranet links are intentionally mapped and will only function inside the Railway network. They will naturally time out if accessed externally.

---

## 🛠️ Technical Architecture Update (Full-Stack)
This project was successfully upgraded from a static frontend to a full-stack enterprise prototype.

* **Frontend:** Vanilla HTML/CSS/JS, fully responsive, zero-latency local search. Hosted on **Vercel**.
* **Admin Portal:** Secure-styled UI for internal IT operations, utilizing dynamic DOM manipulation for intuitive file drop zones.
* **Backend API:** Built with Python **FastAPI**. Handles multipart form data, static image serving, and dynamic cache-busting for instant UI updates. Hosted on **Render**.
* **Data Processing:** Integrates **Pandas** to process and validate `.xlsx` and `.csv` employee records directly in-memory, serving real-time JSON to the frontend for the dynamic birthday marquee.

---

## 🚀 Key Features

### 🔎 Instant Search
A high-performance DOM filtering system that scans 50+ application links in real-time as the user types. No backend calls. No loading states. Immediate feedback.

### 🔐 Safety First
All external links using `target="_blank"` are secured with `rel="noopener noreferrer"`. This prevents reverse tabnabbing and cross-tab exploitation.

### 📢 Dynamic Emergency Broadcasts & Marquees
A modular top-layer modal system and scrolling marquee that dynamically fetch active alerts and employee birthdays directly from the FastAPI backend.

### 📱 Adaptive UI
Built using CSS Flexbox and Grid. Transitions smoothly from a structured multi-column desktop layout to a clean, touch-friendly mobile interface.

---

## 💻 Local Setup

1. Clone the repository.
2. Activate a Python virtual environment: `python -m venv venv` and `venv\Scripts\activate`
3. Install dependencies: `pip install -r requirements.txt`
4. Start the backend: `uvicorn main:app --reload`
5. Open `index.html` in any modern browser.

---

*Designed and Developed by Amaan Ansari* *B.Tech Computer Science Engineering — Jamia Millia Islamia*