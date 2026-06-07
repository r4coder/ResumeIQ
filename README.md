# ResumeIQ — AI Resume Analyzer

A full-stack AI-powered resume analysis application built with React, Node.js, and Google Gemini AI.

## Features

- **PDF Upload** — Drag & drop or click to upload PDF resumes
- **ATS Score** — Animated circular score (0–100) with category breakdown
- **AI Analysis** — Powered by Google Gemini 1.5 Flash
- **Skill Extraction** — Auto-detects languages, frameworks, databases, cloud, tools, soft skills
- **Job Role Matching** — Match against 9 popular job roles with percentage score
- **Missing Skills** — Identify critical gaps for your target role
- **PDF Report** — Download a professional PDF report with all analysis
- **Dark/Light Mode** — Full theme support
- **Responsive** — Works on mobile, tablet, and desktop

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Charts | Recharts |
| PDF Export | jsPDF |
| Backend | Node.js + Express |
| AI | Google Gemini 1.5 Flash |
| PDF Parsing | pdf-parse |

## Prerequisites

- Node.js 18+ and npm
- A **Google Gemini API key** (free at [aistudio.google.com](https://aistudio.google.com))

## Installation & Setup

### 1. Clone / Extract the project

```bash
cd resume-analyzer
```

### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` and add your Gemini API key:
```
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=5000
FRONTEND_URL=http://localhost:5173
```

Start the backend:
```bash
npm run dev
# or: npm start
```

The API will run at `http://localhost:5000`

### 3. Setup Frontend

Open a new terminal:
```bash
cd frontend
npm install
```

Start the frontend:
```bash
npm run dev
```

The app will open at `http://localhost:5173`

## Getting a Gemini API Key

1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API key"
4. Copy the key into `backend/.env` as `GEMINI_API_KEY=...`

The free tier allows ~60 requests/minute which is more than enough for testing.

## Project Structure

```
resume-analyzer/
├── backend/
│   ├── routes/
│   │   └── analyze.js       # PDF parsing + Gemini AI endpoint
│   ├── server.js            # Express server
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── dashboard/
    │   │   │   ├── FileUpload.jsx
    │   │   │   ├── JobMatchCard.jsx
    │   │   │   ├── SkillsSection.jsx
    │   │   │   ├── StrengthsWeaknesses.jsx
    │   │   │   └── SummaryCard.jsx
    │   │   └── ui/
    │   │       ├── ATSScoreRing.jsx
    │   │       ├── LoadingSkeleton.jsx
    │   │       ├── Navbar.jsx
    │   │       └── SkillBadge.jsx
    │   ├── pages/
    │   │   ├── LandingPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   └── ReportPage.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze` | Upload PDF + analyze with AI |
| GET | `/health` | Health check |

### POST /api/analyze

**Request:** `multipart/form-data`
- `resume` — PDF file (required)
- `jobRole` — Target job role string (optional, default: "Software Engineer")

**Response:**
```json
{
  "success": true,
  "data": {
    "atsScore": 85,
    "summary": "...",
    "strengths": [],
    "weaknesses": [],
    "skills": {
      "languages": [],
      "frameworks": [],
      "databases": [],
      "cloud": [],
      "tools": [],
      "softSkills": []
    },
    "missingSkills": [],
    "jobMatch": {
      "role": "Full Stack Developer",
      "matchPercentage": 73,
      "matchedSkills": [],
      "totalRequired": 15
    },
    "recommendations": [],
    "fileName": "resume.pdf",
    "fileSize": 123456,
    "analyzedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Supported Job Roles

- Frontend Developer
- Backend Developer
- Full Stack Developer
- Software Engineer
- Data Analyst
- Data Scientist
- AI/ML Engineer
- DevOps Engineer
- Cloud Engineer

## Tips for Best Results

1. Use a **text-based PDF** (not a scanned image)
2. Ensure your resume is well-formatted with clear sections
3. PDF should be under 10MB

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Failed to parse PDF" | Use a text-based PDF (not scanned/image) |
| "GEMINI_API_KEY not set" | Check your `backend/.env` file |
| CORS errors | Ensure FRONTEND_URL in backend .env matches your frontend URL |
| "Could not extract text" | PDF may be image-only; try exporting from Word/Google Docs |
