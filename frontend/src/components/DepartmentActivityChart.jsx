import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function DepartmentActivityChart({ data }) {
  if (!data || data.length === 0) return <p>No activity data.</p>;

  return (
    <div className="chart-panel chart-full">
      <div className="chart-header">
        <h3>Department Activity</h3>
        <span className="chart-badge">Complaints by Status</span>
      </div>
      <div className="chart-body">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="department" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="open" stackId="a" fill="#e53e3e" name="Open" />
          <Bar dataKey="in_progress" stackId="a" fill="#d69e2e" name="In Progress" />
          <Bar dataKey="resolved" stackId="a" fill="#38a169" name="Resolved" />
          <Bar dataKey="closed" stackId="a" fill="#2b6cb0" name="Closed" />
        </BarChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}
