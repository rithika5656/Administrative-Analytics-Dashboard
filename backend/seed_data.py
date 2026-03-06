"""Seed the database with realistic sample hospital data."""

import random
from datetime import datetime, timedelta, timezone

from database import engine, SessionLocal, Base
from models import Department, Staff, Complaint, IssueResolution

# --------------- Create tables ---------------
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# --------------- Departments ---------------
departments_data = [
    {"name": "Emergency", "head": "Dr. Sarah Chen", "specialization": "Trauma & Acute Care"},
    {"name": "Cardiology", "head": "Dr. James Patel", "specialization": "Heart & Vascular"},
    {"name": "Orthopedics", "head": "Dr. Maria Lopez", "specialization": "Bone & Joint"},
    {"name": "Pediatrics", "head": "Dr. Robert Kim", "specialization": "Child Health"},
    {"name": "Neurology", "head": "Dr. Aisha Okafor", "specialization": "Brain & Nervous System"},
    {"name": "Radiology", "head": "Dr. Thomas Muller", "specialization": "Imaging & Diagnostics"},
]

departments = []
for d in departments_data:
    dept = Department(**d)
    db.add(dept)
    db.flush()
    departments.append(dept)

# --------------- Staff ---------------
roles = ["Doctor", "Nurse", "Technician", "Admin Clerk"]
first_names = ["Alice", "Brian", "Carol", "David", "Emily", "Frank", "Grace", "Henry",
               "Irene", "Jack", "Karen", "Leo", "Mona", "Nathan", "Olivia", "Paul",
               "Quinn", "Rachel", "Steven", "Tina", "Uma", "Victor", "Wendy", "Xander"]

staff_members = []
for dept in departments:
    count = random.randint(3, 6)
    for i in range(count):
        name = random.choice(first_names) + " " + random.choice(["Smith", "Johnson", "Brown", "Taylor", "Wilson", "Davis", "Clark", "Hall"])
        s = Staff(
            name=name,
            role=random.choice(roles),
            department_id=dept.id,
            workload_hours=round(random.uniform(20, 55), 1),
        )
        db.add(s)
        db.flush()
        staff_members.append(s)

# --------------- Complaints ---------------
complaint_titles = [
    "Long wait time in lobby", "Incorrect medication administered",
    "Unclean patient room", "Billing discrepancy", "Rude staff behaviour",
    "Delayed lab results", "Missing patient records", "Equipment malfunction",
    "Noise disturbance in ward", "Scheduling error", "Inadequate pain management",
    "Parking lot safety concern", "Food quality issue", "Privacy violation",
    "Slow discharge process", "Communication gap between shifts",
    "Overcrowded waiting area", "Temperature control problem",
    "Wheelchair availability", "Elevator out of service",
]

severities = ["low", "medium", "high", "critical"]
statuses = ["open", "in_progress", "resolved", "closed"]

complaints = []
now = datetime.now(timezone.utc)

for i in range(80):
    dept = random.choice(departments)
    dept_staff = [s for s in staff_members if s.department_id == dept.id]
    days_ago = random.randint(0, 180)
    created = now - timedelta(days=days_ago, hours=random.randint(0, 23))
    status = random.choice(statuses)

    c = Complaint(
        title=random.choice(complaint_titles),
        description=f"Detailed description for complaint #{i + 1}.",
        severity=random.choice(severities),
        status=status,
        department_id=dept.id,
        assigned_staff_id=random.choice(dept_staff).id if dept_staff else None,
        created_at=created,
        updated_at=created + timedelta(hours=random.randint(1, 48)),
    )
    db.add(c)
    db.flush()
    complaints.append(c)

# --------------- Issue Resolutions ---------------
outcomes = ["resolved", "escalated", "dismissed"]

for c in complaints:
    if c.status in ("resolved", "closed"):
        dept_staff = [s for s in staff_members if s.department_id == c.department_id]
        resolver = random.choice(dept_staff) if dept_staff else random.choice(staff_members)
        hours = round(random.uniform(0.5, 72), 1)
        r = IssueResolution(
            complaint_id=c.id,
            resolved_by_staff_id=resolver.id,
            resolution_hours=hours,
            outcome=random.choices(outcomes, weights=[70, 20, 10])[0],
            notes=f"Resolution notes for complaint #{c.id}.",
            resolved_at=c.created_at + timedelta(hours=hours),
        )
        db.add(r)

resolution_count = sum(1 for c in complaints if c.status in ("resolved", "closed"))

db.commit()
db.close()

print("Database seeded successfully!")
print(f"  Departments : {len(departments)}")
print(f"  Staff       : {len(staff_members)}")
print(f"  Complaints  : {len(complaints)}")
print(f"  Resolutions : {resolution_count}")
