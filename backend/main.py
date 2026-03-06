"""FastAPI backend — Hospital Administrative Analytics Dashboard."""

from datetime import datetime, timezone
from typing import Optional

from fastapi import FastAPI, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func, case
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from models import Department, Staff, Complaint, IssueResolution
from schemas import (
    DashboardStats,
    DepartmentOut,
    WorkloadItem,
    ResolutionTrendItem,
    DepartmentActivityItem,
    ComplaintOut,
    StaffOut,
    DepartmentDetail,
    PerformanceItem,
)

# Create tables if they don't exist yet
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hospital Analytics Dashboard API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ──────────────────────────── helpers ────────────────────────────

def _apply_filters(query, model, department_id, start_date, end_date):
    """Apply optional department & date-range filters to a query."""
    if department_id is not None:
        query = query.filter(model.department_id == department_id)
    if start_date is not None:
        query = query.filter(model.created_at >= start_date)
    if end_date is not None:
        query = query.filter(model.created_at <= end_date)
    return query


# ──────────────────────────── endpoints ──────────────────────────


@app.get("/departments", response_model=list[DepartmentOut])
def list_departments(db: Session = Depends(get_db)):
    """Return all departments (used for the filter dropdown)."""
    return db.query(Department).order_by(Department.name).all()


@app.get("/dashboard/stats", response_model=DashboardStats)
def dashboard_stats(
    department_id: Optional[int] = Query(None),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    db: Session = Depends(get_db),
):
    """KPI summary cards — totals, counts, averages."""
    q = db.query(Complaint)
    q = _apply_filters(q, Complaint, department_id, start_date, end_date)

    total = q.count()
    open_c = q.filter(Complaint.status == "open").count()
    in_prog = q.filter(Complaint.status == "in_progress").count()
    resolved = q.filter(Complaint.status == "resolved").count()
    closed = q.filter(Complaint.status == "closed").count()

    # avg resolution hours
    res_q = db.query(func.avg(IssueResolution.resolution_hours))
    if department_id is not None:
        res_q = res_q.join(Complaint).filter(Complaint.department_id == department_id)
    if start_date is not None:
        res_q = res_q.filter(IssueResolution.resolved_at >= start_date)
    if end_date is not None:
        res_q = res_q.filter(IssueResolution.resolved_at <= end_date)
    avg_hours = res_q.scalar() or 0

    total_staff = db.query(Staff).count()
    total_depts = db.query(Department).count()

    return DashboardStats(
        total_complaints=total,
        open_complaints=open_c,
        in_progress_complaints=in_prog,
        resolved_complaints=resolved,
        closed_complaints=closed,
        avg_resolution_hours=round(avg_hours, 1),
        total_staff=total_staff,
        total_departments=total_depts,
    )


@app.get("/dashboard/workload", response_model=list[WorkloadItem])
def dashboard_workload(
    department_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    """Staff workload distribution grouped by department (pie chart)."""
    q = (
        db.query(
            Department.name.label("department"),
            func.sum(Staff.workload_hours).label("total_workload_hours"),
            func.count(Staff.id).label("staff_count"),
        )
        .join(Staff, Staff.department_id == Department.id)
        .group_by(Department.name)
    )
    if department_id is not None:
        q = q.filter(Department.id == department_id)

    rows = q.all()
    return [
        WorkloadItem(
            department=r.department,
            total_workload_hours=round(r.total_workload_hours, 1),
            staff_count=r.staff_count,
        )
        for r in rows
    ]


@app.get("/dashboard/resolution-trends", response_model=list[ResolutionTrendItem])
def dashboard_resolution_trends(
    department_id: Optional[int] = Query(None),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    db: Session = Depends(get_db),
):
    """Monthly resolution count and avg time (line chart)."""
    month_expr = func.strftime("%Y-%m", IssueResolution.resolved_at)

    q = (
        db.query(
            month_expr.label("month"),
            func.count(IssueResolution.id).label("resolved_count"),
            func.avg(IssueResolution.resolution_hours).label("avg_resolution_hours"),
        )
        .join(Complaint, Complaint.id == IssueResolution.complaint_id)
        .group_by(month_expr)
        .order_by(month_expr)
    )
    if department_id is not None:
        q = q.filter(Complaint.department_id == department_id)
    if start_date is not None:
        q = q.filter(IssueResolution.resolved_at >= start_date)
    if end_date is not None:
        q = q.filter(IssueResolution.resolved_at <= end_date)

    rows = q.all()
    return [
        ResolutionTrendItem(
            month=r.month,
            resolved_count=r.resolved_count,
            avg_resolution_hours=round(r.avg_resolution_hours, 1),
        )
        for r in rows
    ]


@app.get("/dashboard/department-activity", response_model=list[DepartmentActivityItem])
def dashboard_department_activity(
    department_id: Optional[int] = Query(None),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    db: Session = Depends(get_db),
):
    """Complaints per department broken down by status (bar chart)."""
    q = (
        db.query(
            Department.name.label("department"),
            func.sum(case((Complaint.status == "open", 1), else_=0)).label("open"),
            func.sum(case((Complaint.status == "in_progress", 1), else_=0)).label("in_progress"),
            func.sum(case((Complaint.status == "resolved", 1), else_=0)).label("resolved"),
            func.sum(case((Complaint.status == "closed", 1), else_=0)).label("closed"),
            func.count(Complaint.id).label("total"),
        )
        .join(Complaint, Complaint.department_id == Department.id)
        .group_by(Department.name)
    )
    if department_id is not None:
        q = q.filter(Department.id == department_id)
    if start_date is not None:
        q = q.filter(Complaint.created_at >= start_date)
    if end_date is not None:
        q = q.filter(Complaint.created_at <= end_date)

    rows = q.all()
    return [
        DepartmentActivityItem(
            department=r.department,
            open=r.open,
            in_progress=r.in_progress,
            resolved=r.resolved,
            closed=r.closed,
            total=r.total,
        )
        for r in rows
    ]


@app.get("/complaints", response_model=list[ComplaintOut])
def list_complaints(
    department_id: Optional[int] = Query(None),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    db: Session = Depends(get_db),
):
    """List all complaints with department & staff names."""
    q = (
        db.query(
            Complaint.id,
            Complaint.title,
            Complaint.description,
            Complaint.severity,
            Complaint.status,
            Department.name.label("department_name"),
            Staff.name.label("assigned_staff_name"),
            Complaint.created_at,
        )
        .outerjoin(Department, Department.id == Complaint.department_id)
        .outerjoin(Staff, Staff.id == Complaint.assigned_staff_id)
    )
    if department_id is not None:
        q = q.filter(Complaint.department_id == department_id)
    if start_date is not None:
        q = q.filter(Complaint.created_at >= start_date)
    if end_date is not None:
        q = q.filter(Complaint.created_at <= end_date)

    rows = q.order_by(Complaint.created_at.desc()).all()
    return [
        ComplaintOut(
            id=r.id, title=r.title, description=r.description,
            severity=r.severity, status=r.status,
            department_name=r.department_name,
            assigned_staff_name=r.assigned_staff_name,
            created_at=r.created_at,
        )
        for r in rows
    ]


@app.get("/staff", response_model=list[StaffOut])
def list_staff(
    department_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    """List all staff members with department names."""
    q = (
        db.query(
            Staff.id,
            Staff.name,
            Staff.role,
            Department.name.label("department_name"),
            Staff.workload_hours,
        )
        .outerjoin(Department, Department.id == Staff.department_id)
    )
    if department_id is not None:
        q = q.filter(Staff.department_id == department_id)

    rows = q.order_by(Staff.name).all()
    return [
        StaffOut(
            id=r.id, name=r.name, role=r.role,
            department_name=r.department_name,
            workload_hours=round(r.workload_hours, 1),
        )
        for r in rows
    ]


@app.get("/departments/details", response_model=list[DepartmentDetail])
def department_details(db: Session = Depends(get_db)):
    """Department list with staff & complaint counts."""
    rows = (
        db.query(
            Department.id,
            Department.name,
            Department.head,
            Department.specialization,
            func.count(func.distinct(Staff.id)).label("staff_count"),
            func.count(func.distinct(Complaint.id)).label("complaint_count"),
        )
        .outerjoin(Staff, Staff.department_id == Department.id)
        .outerjoin(Complaint, Complaint.department_id == Department.id)
        .group_by(Department.id)
        .order_by(Department.name)
        .all()
    )
    return [
        DepartmentDetail(
            id=r.id, name=r.name, head=r.head,
            specialization=r.specialization,
            staff_count=r.staff_count,
            complaint_count=r.complaint_count,
        )
        for r in rows
    ]


@app.get("/performance", response_model=list[PerformanceItem])
def staff_performance(db: Session = Depends(get_db)):
    """Staff performance — resolution counts and avg hours."""
    rows = (
        db.query(
            Staff.name.label("staff_name"),
            Department.name.label("department"),
            func.count(IssueResolution.id).label("resolved_count"),
            func.avg(IssueResolution.resolution_hours).label("avg_resolution_hours"),
        )
        .join(IssueResolution, IssueResolution.resolved_by_staff_id == Staff.id)
        .outerjoin(Department, Department.id == Staff.department_id)
        .group_by(Staff.id)
        .order_by(func.count(IssueResolution.id).desc())
        .all()
    )
    return [
        PerformanceItem(
            staff_name=r.staff_name, department=r.department,
            resolved_count=r.resolved_count,
            avg_resolution_hours=round(r.avg_resolution_hours, 1),
        )
        for r in rows
    ]
