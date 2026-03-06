# Hospital Administrative Analytics Dashboard

A full-stack analytics dashboard that helps hospital administrators monitor operations, track complaint resolution, analyze staff workload, and gain real-time insights across departments.

![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?logo=react&logoColor=white)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi&logoColor=white)
![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?logo=sqlite&logoColor=white)
![Recharts](https://img.shields.io/badge/Charts-Recharts-FF6384?logo=chartdotjs&logoColor=white)

---

## Features

- **KPI Summary Cards** — Total complaints, open issues, avg resolution time, staff count
- **Workload Pie Chart** — Staff workload distribution across departments
- **Resolution Trend Line Chart** — Monthly resolution count & average hours (dual-axis)
- **Department Activity Bar Chart** — Stacked complaint breakdown by status per department
- **Filter Controls** — Filter by department and date range; all charts update in real time
- **Professional UI** — Dark sidebar navigation, sticky top bar, responsive layout
- **REST API** — FastAPI backend with documented endpoints (auto-generated Swagger docs)

---

## System Architecture

```
┌──────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│   SQLite     │────▶│   FastAPI Backend │────▶│   React Frontend    │
│   Database   │     │   (REST API)      │     │   (Dashboard UI)    │
└──────────────┘     └──────────────────┘     └─────────────────────┘
      │                      │                         │
 4 Tables:             5 Endpoints:              Components:
 departments           /dashboard/stats          KPI Cards
 staff                 /dashboard/workload       Pie Chart
 complaints            /dashboard/resolution-    Line Chart
 issue_resolutions       trends                  Bar Chart
                       /dashboard/department-    Filters + Sidebar
                         activity
```

---

## Data Flow

```
Hospital Data → SQLite DB → SQLAlchemy ORM → FastAPI Aggregation → JSON REST API → Axios → React State → Recharts Visualization
```

---

## Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Frontend     | React 18, Recharts, Axios           |
| Backend      | Python 3.12, FastAPI, SQLAlchemy    |
| Database     | SQLite (dev) / PostgreSQL (prod)    |
| API Format   | REST / JSON                         |
| Styling      | CSS3 with Inter font, CSS Variables |

---

## Project Structure

```
├── backend/
│   ├── main.py              # FastAPI app with 5 API endpoints
│   ├── models.py            # SQLAlchemy ORM models (4 tables)
│   ├── schemas.py           # Pydantic response schemas
│   ├── database.py          # DB engine & session config
│   ├── seed_data.py         # Sample data generator
│   └── requirements.txt     # Python dependencies
│
├── frontend/
│   ├── public/index.html
│   └── src/
│       ├── App.jsx           # Main dashboard layout
│       ├── api.js            # Axios API client
│       ├── index.js          # React entry point
│       ├── index.css         # Professional theme & styles
│       └── components/
│           ├── Sidebar.jsx              # Dark sidebar navigation
│           ├── KpiCards.jsx             # Summary KPI cards
│           ├── Filters.jsx             # Department & date filters
│           ├── WorkloadPieChart.jsx    # Workload pie chart
│           ├── ResolutionTrendChart.jsx # Resolution trends line chart
│           └── DepartmentActivityChart.jsx # Dept activity bar chart
│
└── WORKFLOW.md               # Detailed workflow documentation
```

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python seed_data.py            # Seeds DB with sample data
uvicorn main:app --reload      # Starts on http://localhost:8000
```

### Frontend Setup

```bash
cd frontend
npm install
npm start                      # Starts on http://localhost:3000
```

### API Documentation

Once the backend is running, visit **http://localhost:8000/docs** for auto-generated Swagger UI.

---

## API Endpoints

| Endpoint                         | Method | Description                          | Filters                    |
|----------------------------------|--------|--------------------------------------|----------------------------|
| `/departments`                   | GET    | List all departments                 | —                          |
| `/dashboard/stats`               | GET    | KPI totals & averages                | department_id, date range  |
| `/dashboard/workload`            | GET    | Staff workload by department         | department_id              |
| `/dashboard/resolution-trends`   | GET    | Monthly resolution trends            | department_id, date range  |
| `/dashboard/department-activity` | GET    | Complaint status per department      | department_id, date range  |

---

## Database Schema

- **departments** — id, name, head, specialization
- **staff** — id, name, role, department_id, workload_hours
- **complaints** — id, title, description, severity, status, department_id, assigned_staff_id
- **issue_resolutions** — id, complaint_id, resolved_by_staff_id, resolution_hours, outcome

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file.