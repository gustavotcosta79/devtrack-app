# 🚀 DevTrack

💡 This project is STILL under continuous development as part of a technical portfolio.

### Developer Activity Analytics & AI Recommendations Platform
**DevTrack** is a full-stack platform. It goes beyond basic versioning statistics. It integrates with the GitHub API. The system collects, analyzes, and evaluates developer activity. It calculates a custom **DevScore**. It also classifies repository complexity.

The goal is to provide a clear view of technical evolution. It also generates targeted learning recommendations using Artificial Intelligence.
---
## ✨ Main Features
### ✅ Implemented
* **Automatic Data Pipeline:** Native integration with the GitHub API for extracting repositories, commits, languages, and time history.
* **DevScore Engine:** A mathematical calculation algorithm. It evaluates consistency, technological diversity, and activity level. It assigns a seniority level (*Junior, Full, Senior*).
* **Interactive Dashboard:** A rich and responsive interface. It has smooth temporal graphs (language evolution, commits per month, score history).
* **Complexity Analysis:** Automatic evaluation and categorization of the complexity of each repository (*Small, Medium, Large*) based on backend metrics.* 
**AI Recommendations:** Integration with LLMs (Groq). This generates study advice and customized stack diversification. 
* **Secure Authentication:** Login via GitHub OAuth 2.0.
* **Continuous Integration / Continuous Deployment (CI/CD):** Automated testing and build pipelines using GitHub Actions.
* **Infrastructure and Deploy:** Complete Dockerization of the full stack (Frontend, Backend, DB) and automated cloud deployment (e.g., Render, Vercel).

### 🗺️ Roadmap (To Implement)
* **Improve UX:** Using the CRUD operations (like edit personal information, delete repositories, etc)
* **Documentation/Demo:** Elaborate documentation (like a report) of the choices/decisions made in the progress of the project. Record a demo on the application.
* **UPDATE READ.ME**
* **Search improvements:** Search improvements and new functionalities for the app

---
## 🛠️ Tech Stack

| Layer      | Technologies                                       |
| :--------- | :------------------------------------------------- |
| **Frontend** | React, Vite, Tailwind CSS, Recharts, Lucide React  |
| **Backend** | Python, FastAPI, SQLAlchemy                        |
| **Database** | PostgreSQL                                         |
| **DevOps** | Docker, GitHub Actions                             |
| **Services** | GitHub REST API (Coming soon: Groq Llama 3 API)    |

---
## 🚀 How to Run the Project (Example)
```bash
# Clone the repository
git clone [https://github.com/YourUsername/DevTrack.git](https://github.com/YourUsername/DevTrack.git)

# Install Backend dependencies
cd backend
pip install -r requirements.txt

# Install Frontend dependencies
cd ../frontend
npm install
npm run dev
------------------------------

💡 This project is STILL under continuous development as part of a technical portfolio.


