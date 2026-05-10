# 🚀 DevTrack

<div align="center">
  <img src="shields.io" alt="Status" />
  <img src="shields.io" alt="Build Status" />
  <img src="shields.io" alt="React" />
  <img src="shields.io" alt="FastAPI" />
  <img src="shields.io" alt="Docker" />
</div>

<br/>

> **Developer Activity Analytics & AI Recommendations Platform**  
> DevTrack is a full-stack gamified platform that goes beyond basic versioning statistics. By natively integrating with the GitHub API, the system collects, analyzes, and evaluates developer activity, calculates a custom **DevScore**, and ranks users on a Global Leaderboard.

🌐 **Live Demo:** [https://devtrack-app-green.vercel.app]  
*(Note: The backend is hosted on Render, so the first login might take ~30 seconds to wake up the server!)*

---

## 📸 Gallery

<p align="center">
  <img src="https://github.com/gustavotcosta79/devtrack-app/blob/main/docs/dashboard1.png" width="48%" alt="Dashboard" />
  <img src="https://github.com/gustavotcosta79/devtrack-app/blob/main/docs/dashboard2.png" width="48%" alt="Dashboard" />
  <img src="https://github.com/gustavotcosta79/devtrack-app/blob/main/docs/dashboard3.png" width="48%" alt="Dashboard" />
  <br>
  <img src="https://github.com/gustavotcosta79/devtrack-app/blob/main/docs/leaderboard.png" width="48%" alt="Leaderboard" />
</p>

---

## ✨ Main Features

### ✅ Implemented
* **🏆 Gamification & Global Leaderboard:** Top 50 developers ranking based on DevScore, featuring dynamic medals and quick links to GitHub profiles.
* **⚙️ Automatic Data Pipeline:** Native integration with the GitHub API to extract repositories, commits, languages, and historical timelines.
* **📊 DevScore Engine:** A custom mathematical algorithm that evaluates consistency, technological diversity, and activity volume, assigning a seniority tier (*Junior, Mid-Level, Senior*).
* **🤖 AI-Powered Recommendations:** Deep integration with Groq LLM to generate targeted study advice and stack diversification tips based on user metrics.
* **📈 Interactive Dashboard:** A rich, responsive UI with smooth temporal charts (Language evolution, Commits per month, Score history) built with Recharts.
* **🧠 Complexity Analysis:** Automatic evaluation and categorization of repository complexity (*Small, Medium, Large*).
* **🔐 Secure Authentication:** Seamless login via GitHub OAuth 2.0.
* **🚀 CI/CD & Cloud Deployment:** Automated testing and build pipelines using GitHub Actions, deployed to **Vercel** (Frontend) and **Render** (Backend).

### 🗺️ Roadmap (Upcoming)
- [ ] **Advanced Search:** Enhanced global search functionality to find and compare specific developers.
- [ ] **Architecture Documentation:** Write a detailed technical report explaining architectural choices and database design.
---

## 🛠️ Tech Stack


| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS, Recharts, React Router, Lucide Icons |
| **Backend** | Python, FastAPI, SQLAlchemy, Uvicorn |
| **Database** | PostgreSQL (Neon/Cloud) |
| **DevOps** | Docker, Docker Compose, GitHub Actions |
| **Integrations**| GitHub REST API, Groq LLM API |

---

## 🐳 How to Run Locally

The easiest way to run the project locally is by using **Docker**.

### 1. Clone the repository
```bash
git clone github.com
cd DevTrack
```

### 2. Environment Variables

Create a `.env` file in the root of the backend and frontend folders (use the provided `.env.example` as a reference).  
You will need:
* A GitHub OAuth App (Client ID & Secret).
* A PostgreSQL Database URL.
* A Groq API Key.

### 3. Build and Run with Docker

```bash
# This will build the images and start the Frontend, Backend, and Database containers
docker compose up --build
```

* **Frontend:** Available at http://localhost:5173
* **Backend API Docs:** Available at http://localhost:8000/docs

*(To stop the containers, use `docker compose down`)*
