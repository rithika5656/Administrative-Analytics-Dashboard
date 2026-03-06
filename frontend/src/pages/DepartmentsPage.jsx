import React, { useState, useEffect } from "react";
import { fetchDepartmentDetails } from "../api";
import { IconUsers, IconClipboard } from "../components/Icons";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartmentDetails()
      .then(setDepartments)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Departments</h2>
          <p className="page-subtitle">Overview of all hospital departments</p>
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>Loading...
        </div>
      ) : (
        <div className="dept-grid">
          {departments.map((d) => (
            <div key={d.id} className="dept-card">
              <div className="dept-card-header">
                <h3>{d.name}</h3>
                <span className="chart-badge">{d.specialization || "General"}</span>
              </div>
              <p className="dept-head">Head: <strong>{d.head}</strong></p>
              <div className="dept-stats">
                <div className="dept-stat">
                  <IconUsers size={16} />
                  <span><strong>{d.staff_count}</strong> Staff</span>
                </div>
                <div className="dept-stat">
                  <IconClipboard size={16} />
                  <span><strong>{d.complaint_count}</strong> Complaints</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
