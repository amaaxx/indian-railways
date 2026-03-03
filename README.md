# BLW Centralized Digital Workspace

A modern, lightweight entry point for the Banaras Locomotive Works (BLW) intranet ecosystem.

This portal consolidates critical enterprise applications, BI dashboards, and employee tools into one structured interface — designed for speed, clarity, and long-term maintainability.

🔗 **Live Deployment:**  
https://indian-railways-six.vercel.app/

> Note: Internal `10.x.x.x` intranet links are intentionally mapped and will only function inside the Railway network. They will naturally time out if accessed externally.

---

## 🏗️ Technical Choice: Vanilla Over Frameworks

For this project, I intentionally avoided React or Vue and chose **Vanilla HTML, CSS, and ES6 JavaScript**.

### Why?

Government and enterprise intranet environments typically operate under strict infrastructure and security constraints. Adding a frontend framework would introduce:

- A Node.js runtime requirement  
- Build tooling (Webpack/Vite)  
- Larger bundle sizes  
- Unnecessary abstraction for a static directory  

Since this is a static portal, those layers would only add overhead.

By keeping the stack vanilla:

- No build step is required  
- Zero external dependencies  
- Maximum compatibility with IIS/Apache servers  
- Minimal attack surface  
- Instant deployment  

The IT team can simply place the files on the server — and it works.

---

## 🚀 What’s Under the Hood?

### 🔎 Instant Search

A high-performance DOM filtering system that scans 50+ application links in real time as the user types.  
No backend calls. No loading states. Immediate feedback.

### 🔐 Safety First

All external links using `target="_blank"` are secured with:

```html
rel="noopener noreferrer"
```

This prevents reverse tabnabbing and cross-tab exploitation — a commonly overlooked vulnerability in static dashboards.

### 📢 Emergency Broadcast Modal

A modular top-layer modal system designed to display urgent IT or administrative alerts on page load.  
Easily configurable without restructuring the layout.

### 📱 Adaptive UI

Built using CSS Flexbox and Grid.  
Transitions smoothly from a structured multi-column desktop layout to a clean, touch-friendly mobile interface.

---

## 🛠️ Local Setup

No dependencies. No installation.

1. Clone the repository  
2. Open `index.html` in any modern browser  

That’s it.

---

## 🌐 Deployment

Deployed via Vercel for high availability and fast CDN delivery.

---

*Amaan Ansari*  
*B.Tech Computer Science — Jamia Millia Islamia*