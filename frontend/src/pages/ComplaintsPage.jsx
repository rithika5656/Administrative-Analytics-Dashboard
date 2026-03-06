import React, { useState, useEffect } from "react";
import { fetchComplaints, fetchDepartments } from "../api";

const SEVERITY_COLORS = {
  critical: "#ef4444",
  high: "#f59e0b",
  medium: "#3b82f6",
  low: "#10b981",
};

const STATUS_COLORS = {
  open: "#ef4444",
  in_progress: "#f59e0b",
  resolved: "#10b981",
  closed: "#64748b",
};

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [deptFilter, setDeptFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartments().then(setDepartments).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = deptFilter ? { department_id: deptFilter } : {};
    fetchComplaints(params)
      .then(setComplaints)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [deptFilter]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Complaints</h2>
          <p className="page-subtitle">All logged complaints across departments</p>
        </div>
        <div className="page-header-actions">
          <select
            className="page-select"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>Loading...
        </div>
      ) : (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Department</th>
                <th>Assigned To</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c.id}>
                  <td className="td-id">#{c.id}</td>
                  <td className="td-title">{c.title}</td>
                  <td>{c.department_name || "—"}</td>
                  <td>{c.assigned_staff_name || "Unassigned"}</td>
                  <td>
                    <span
                      className="badge"
                      style={{ background: SEVERITY_COLORS[c.severity] + "18", color: SEVERITY_COLORS[c.severity] }}
                    >
                      {c.severity}
                    </span>
                  </td>
                  <td>
                    <span
                      className="badge"
                      style={{ background: STATUS_COLORS[c.status] + "18", color: STATUS_COLORS[c.status] }}
                    >
                      {c.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="td-date">
                    {new Date(c.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {complaints.length === 0 && (
            <div className="empty-state">No complaints found.</div>
          )}
        </div>
      )}
    </div>
  );
}
