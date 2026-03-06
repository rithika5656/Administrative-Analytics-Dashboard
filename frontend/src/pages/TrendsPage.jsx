import React, { useState, useEffect, useCallback } from "react";
import { fetchResolutionTrends, fetchDepartments } from "../api";
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

export default function TrendsPage() {
  const [data, setData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [deptFilter, setDeptFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartments().then(setDepartments).catch(console.error);
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    const params = deptFilter ? { department_id: deptFilter } : {};
    fetchResolutionTrends(params)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [deptFilter]);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Resolution Trends</h2>
          <p className="page-subtitle">Monthly issue resolution analytics</p>
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
      ) : data.length === 0 ? (
        <div className="empty-state">No trend data available.</div>
      ) : (
        <div className="trends-grid">
          <div className="chart-panel">
            <div className="chart-header">
              <h3>Resolved Issues Over Time</h3>
              <span className="chart-badge">Area Chart</span>
            </div>
            <div className="chart-body">
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="fillBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="resolved_count" stroke="#3b82f6" fill="url(#fillBlue)" name="Resolved" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-panel">
            <div className="chart-header">
              <h3>Average Resolution Time</h3>
              <span className="chart-badge">Line Chart</span>
            </div>
            <div className="chart-body">
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="avg_resolution_hours" stroke="#ef4444" strokeWidth={2} name="Avg Hours" dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
