import React, { useState, useEffect } from "react";
import { fetchStaff, fetchDepartments } from "../api";

const ROLE_COLORS = {
  Doctor: "#3b82f6",
  Nurse: "#10b981",
  Technician: "#f59e0b",
  "Admin Clerk": "#8b5cf6",
};

export default function StaffPage() {
  const [staff, setStaff] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [deptFilter, setDeptFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartments().then(setDepartments).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = deptFilter ? { department_id: deptFilter } : {};
    fetchStaff(params)
      .then(setStaff)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [deptFilter]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Staff Directory</h2>
          <p className="page-subtitle">All staff members and workload overview</p>
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
                <th>Name</th>
                <th>Role</th>
                <th>Department</th>
                <th>Workload (hrs)</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.id}>
                  <td className="td-id">#{s.id}</td>
                  <td className="td-title">{s.name}</td>
                  <td>
                    <span
                      className="badge"
                      style={{
                        background: (ROLE_COLORS[s.role] || "#64748b") + "18",
                        color: ROLE_COLORS[s.role] || "#64748b",
                      }}
                    >
                      {s.role}
                    </span>
                  </td>
                  <td>{s.department_name || "—"}</td>
                  <td>
                    <div className="workload-bar-wrapper">
                      <div
                        className="workload-bar"
                        style={{ width: `${Math.min((s.workload_hours / 55) * 100, 100)}%` }}
                      ></div>
                      <span>{s.workload_hours}h</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {staff.length === 0 && (
            <div className="empty-state">No staff found.</div>
          )}
        </div>
      )}
    </div>
  );
}
