# BLW Centralized Digital Workspace

A modernized, responsive intranet portal designed for Banaras Locomotive Works (BLW). This dashboard aggregates critical enterprise applications, BI dashboards, and employee portals into a single, high-performance interface.

**🔗 [View Live Deployment here](https://indian-railways-six.vercel.app/)**
*(Note: Internal `10.x.x.x` intranet links are accurately mapped and will naturally time out if accessed outside the Railway network).*

## 🏗️ The Engineering Approach

When looking at the legacy directory, the immediate temptation was to spin up a React or Vue application. I actively decided against that, opting instead for **strictly Vanilla HTML, CSS, and ES6 JavaScript**. 

**Why?**
For a static directory portal, a Virtual DOM and client-side rendering introduce unnecessary overhead. By keeping the stack vanilla, the bundle size remains virtually zero, requiring no build step (Webpack/Vite). This ensures maximum compatibility and instantaneous deployment. The IT team can drop these three files directly onto BLW's existing internal servers (IIS/Apache) without configuring a Node.js environment.

## 🚀 Key Features Built

* **Zero-Latency Search:** Instead of querying a backend, the search bar uses real-time DOM traversal. It filters through 50+ application nodes instantly as the user types.
* **Security Hardening:** A critical vulnerability in static dashboards is the `target="_blank"` exploit (Reverse Tabnabbing). Every external link in this portal is hardcoded with `rel="noopener noreferrer"` to sever the JavaScript thread and protect the internal intranet from external cross-tab phishing.
* **Emergency Broadcast Modal:** Engineered a modular, top-layer modal that intercepts the screen on load for critical IT or administrative alerts. 
* **Responsive Architecture:** Built on a strict CSS Flexbox/Grid foundation that gracefully degrades from a multi-column desktop view into a touch-friendly mobile interface.

## 🛠️ Local Setup
Because this relies on a strict Separation of Concerns (Structure, Style, Logic) with zero dependencies, local execution is instant.
1. Clone the repository.
2. Open `index.html` directly in any modern web browser.

## 🌐 Deployment
This portal is deployed via **Vercel** to ensure high availability and fast content delivery (CDN) for users across the railway network.

---
*Developed by Amaan Ansari* *Pursuing B.Tech in Computer Science at Jamia Millia Islamia.*
