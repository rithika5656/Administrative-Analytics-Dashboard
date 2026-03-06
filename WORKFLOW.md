# Hospital Administrative Analytics Dashboard — Complete Workflow

## System Architecture Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        SYSTEM ARCHITECTURE                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────┐    ┌──────────────────┐    ┌─────────────────────┐   │
│  │  PostgreSQL/  │───▶│   FastAPI Backend │───▶│  React Frontend     │   │
│  │  SQLite DB    │    │   (REST API)      │    │  (Dashboard UI)     │   │
│  └──────────────┘    └──────────────────┘    └─────────────────────┘   │
│        │                      │                        │                │
│   ┌────┴────┐          ┌─────┴──────┐          ┌──────┴───────┐       │
│   │ Tables: │          │ Endpoints: │          │ Components:  │       │
│   │complaints│          │/dashboard/ │          │ KPI Cards    │       │
│   │departments│         │  stats     │          │ Pie Chart    │       │
│   │staff     │          │  workload  │          │ Line Chart   │       │
│   │issue_    │          │  resolution│          │ Bar Chart    │       │
│   │resolutions│         │  -trends   │          │ Filters      │       │
│   └─────────┘          │  department│          └──────────────┘       │
│                         │  -activity │                                  │
│                         └────────────┘                                  │
└─────────────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
┌──────────┐     ┌───────────┐     ┌──────────┐     ┌──────────────┐
│ Hospital │     │           │     │  FastAPI  │     │    React     │
│Operational│───▶│  Database  │───▶│  Backend  │───▶│  Frontend    │
│   Data    │     │ (SQLite/  │     │ Analytics │     │  Dashboard   │
│           │     │ PostgreSQL)│     │ Engine    │     │ Visualization│
└──────────┘     └───────────┘     └──────────┘     └──────────────┘
     │                │                  │                  │
  Complaints     Structured          REST API          Charts &
  Staff Data     Tables with         Endpoints         KPI Cards
  Dept Activity  Relations           JSON Response     Filters
  Resolutions    Seed Data           Aggregations      Interactions
```

---

## Step 1: Data Collection

**Purpose:** Capture hospital operational activity from multiple sources.

### Data Categories:
| Category | Examples |
|---|---|
| Complaints | Patient complaints, severity, status, assigned department |
| Staff | Staff members, roles, departments, workload hours |
| Departments | Department names, head of department, specialization |
| Issue Resolutions | Linked complaint, resolution time, resolved-by staff, outcome |

### Data Flow:
1. Hospital staff logs complaints into the system
2. Staff workload is tracked per shift/week
3. Department activity is recorded (admissions, discharges, procedures)
4. Issue resolutions are logged with timestamps for trend analysis

---

## Step 2: Data Storage (SQLite)

### Database Schema:

```sql
-- departments table
CREATE TABLE departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    head TEXT NOT NULL,
    specialization TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- staff table
CREATE TABLE staff (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    department_id INTEGER REFERENCES departments(id),
    workload_hours REAL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- complaints table
CREATE TABLE complaints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    severity TEXT CHECK(severity IN ('low','medium','high','critical')),
    status TEXT CHECK(status IN ('open','in_progress','resolved','closed')) DEFAULT 'open',
    department_id INTEGER REFERENCES departments(id),
    assigned_staff_id INTEGER REFERENCES staff(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- issue_resolutions table
CREATE TABLE issue_resolutions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    complaint_id INTEGER REFERENCES complaints(id),
    resolved_by_staff_id INTEGER REFERENCES staff(id),
    resolution_hours REAL NOT NULL,
    outcome TEXT CHECK(outcome IN ('resolved','escalated','dismissed')),
    notes TEXT,
    resolved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Relationships:
- `complaints` → belongs to `departments`, assigned to `staff`
- `issue_resolutions` → linked to `complaints`, resolved by `staff`
- `staff` → belongs to `departments`

---

## Step 3: Backend Processing (FastAPI)

### Analytics Calculations:
1. **Dashboard Stats** — Total complaints, open/resolved counts, avg resolution time
2. **Workload Distribution** — Staff workload grouped by department (pie chart data)
3. **Resolution Trends** — Monthly resolution counts and average time (line chart data)
4. **Department Activity** — Complaints per department with status breakdown (bar chart data)

### Processing Pipeline:
```
Database Query → Raw Data → Aggregation/Grouping → JSON Serialization → API Response
```

---

## Step 4: API Layer

| Endpoint | Method | Description |
|---|---|---|
| `/dashboard/stats` | GET | KPI summary (totals, averages) |
| `/dashboard/workload` | GET | Staff workload by department |
| `/dashboard/resolution-trends` | GET | Monthly resolution trends |
| `/dashboard/department-activity` | GET | Per-department complaint stats |

### Query Parameters (Filters):
- `department_id` — Filter by specific department
- `start_date` / `end_date` — Filter by date range

---

## Step 5: Frontend Dashboard (React)

### Components:
| Component | Data Source | Visualization |
|---|---|---|
| KPI Cards | `/dashboard/stats` | Numeric cards with icons |
| Workload Pie Chart | `/dashboard/workload` | Recharts PieChart |
| Resolution Trend Line Chart | `/dashboard/resolution-trends` | Recharts LineChart |
| Department Activity Bar Chart | `/dashboard/department-activity` | Recharts BarChart |
| Filter Bar | Local state | Dropdowns + Date pickers |

---

## Step 6: Visualization Layer

**Library:** Recharts (React-native charting)

- **Pie Chart** — Workload distribution across departments
- **Line Chart** — Resolution time trends over months
- **Bar Chart** — Complaint counts per department (stacked by status)
- **KPI Cards** — Total complaints, avg resolution time, open issues, staff count

---

## Step 7: User Interaction

Administrators can:
- **Filter by Department** — Dropdown to select a department; all charts update
- **Filter by Date Range** — Start/end date pickers to scope the time window
- **View Real-Time Insights** — Dashboard refreshes on filter change
- **Hover Tooltips** — Chart elements show detailed values on hover

---

## Step 8: Final Dashboard Output

A single-page responsive dashboard with:
- Header with title and filter controls
- Top row: 4 KPI cards
- Middle row: Workload pie chart + Resolution trend line chart
- Bottom row: Full-width department activity bar chart
- Auto-refresh capability and responsive layout for tablet/desktop

---

## Technology Stack Summary

| Layer | Technology |
|---|---|
| Database | SQLite (dev) / PostgreSQL (prod) |
| Backend | Python 3.11+, FastAPI, SQLAlchemy, Uvicorn |
| Frontend | React 18, Recharts, Axios, CSS Modules |
| API Format | REST / JSON |

---

## How to Run

```bash
# Backend
cd backend
pip install -r requirements.txt
python seed_data.py          # populate sample data
uvicorn main:app --reload    # starts on http://localhost:8000

# Frontend
cd frontend
npm install
npm start                    # starts on http://localhost:3000
```
