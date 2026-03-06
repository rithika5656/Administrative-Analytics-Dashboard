from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, DateTime, CheckConstraint
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

from database import Base


class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    head = Column(String, nullable=False)
    specialization = Column(String)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    staff = relationship("Staff", back_populates="department")
    complaints = relationship("Complaint", back_populates="department")


class Staff(Base):
    __tablename__ = "staff"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"))
    workload_hours = Column(Float, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    department = relationship("Department", back_populates="staff")
    assigned_complaints = relationship("Complaint", back_populates="assigned_staff")
    resolutions = relationship("IssueResolution", back_populates="resolved_by_staff")


class Complaint(Base):
    __tablename__ = "complaints"
    __table_args__ = (
        CheckConstraint("severity IN ('low','medium','high','critical')"),
        CheckConstraint("status IN ('open','in_progress','resolved','closed')"),
    )

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    severity = Column(String, default="medium")
    status = Column(String, default="open")
    department_id = Column(Integer, ForeignKey("departments.id"))
    assigned_staff_id = Column(Integer, ForeignKey("staff.id"))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    department = relationship("Department", back_populates="complaints")
    assigned_staff = relationship("Staff", back_populates="assigned_complaints")
    resolution = relationship("IssueResolution", back_populates="complaint", uselist=False)


class IssueResolution(Base):
    __tablename__ = "issue_resolutions"
    __table_args__ = (
        CheckConstraint("outcome IN ('resolved','escalated','dismissed')"),
    )

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"))
    resolved_by_staff_id = Column(Integer, ForeignKey("staff.id"))
    resolution_hours = Column(Float, nullable=False)
    outcome = Column(String, default="resolved")
    notes = Column(Text)
    resolved_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    complaint = relationship("Complaint", back_populates="resolution")
    resolved_by_staff = relationship("Staff", back_populates="resolutions")
