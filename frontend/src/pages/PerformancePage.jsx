import React, { useState, useEffect } from "react";
import { fetchPerformance } from "../api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

export default function PerformancePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformance()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Staff Performance</h2>
          <p className="page-subtitle">Resolution metrics by staff member</p>
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>Loading...
        </div>
      ) : data.length === 0 ? (
        <div className="empty-state">No performance data available.</div>
      ) : (
        <>
          <div className="chart-panel" style={{ marginBottom: 24 }}>
            <div className="chart-header">
              <h3>Resolutions by Staff</h3>
              <span className="chart-badge">Count</span>
            </div>
            <div className="chart-body">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="staff_name" type="category" width={120} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="resolved_count" fill="#3b82f6" name="Resolved" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Staff Member</th>
                  <th>Department</th>
                  <th>Resolutions</th>
                  <th>Avg Time (hrs)</th>
                </tr>
              </thead>
              <tbody>
                {data.map((s, i) => (
                  <tr key={i}>
                    <td className="td-id">#{i + 1}</td>
                    <td className="td-title">{s.staff_name}</td>
                    <td>{s.department}</td>
                    <td>
                      <span className="badge" style={{ background: "#3b82f618", color: "#3b82f6" }}>
                        {s.resolved_count}
                      </span>
                    </td>
                    <td>{s.avg_resolution_hours}h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
