from pydantic import BaseModel
from datetime import datetime


# ---------- Department ----------
class DepartmentOut(BaseModel):
    id: int
    name: str
    head: str
    specialization: str | None

    model_config = {"from_attributes": True}


# ---------- Dashboard Stats ----------
class DashboardStats(BaseModel):
    total_complaints: int
    open_complaints: int
    in_progress_complaints: int
    resolved_complaints: int
    closed_complaints: int
    avg_resolution_hours: float
    total_staff: int
    total_departments: int


# ---------- Workload ----------
class WorkloadItem(BaseModel):
    department: str
    total_workload_hours: float
    staff_count: int


# ---------- Resolution Trends ----------
class ResolutionTrendItem(BaseModel):
    month: str
    resolved_count: int
    avg_resolution_hours: float


# ---------- Department Activity ----------
class DepartmentActivityItem(BaseModel):
    department: str
    open: int
    in_progress: int
    resolved: int
    closed: int
    total: int


# ---------- Complaint List ----------
class ComplaintOut(BaseModel):
    id: int
    title: str
    description: str | None
    severity: str
    status: str
    department_name: str | None
    assigned_staff_name: str | None
    created_at: datetime


# ---------- Staff List ----------
class StaffOut(BaseModel):
    id: int
    name: str
    role: str
    department_name: str | None
    workload_hours: float


# ---------- Department Detail ----------
class DepartmentDetail(BaseModel):
    id: int
    name: str
    head: str
    specialization: str | None
    staff_count: int
    complaint_count: int


# ---------- Performance ----------
class PerformanceItem(BaseModel):
    staff_name: str
    department: str
    resolved_count: int
    avg_resolution_hours: float
