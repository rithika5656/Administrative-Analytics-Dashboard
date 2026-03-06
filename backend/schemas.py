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
