import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#2b6cb0", "#38a169", "#d69e2e", "#e53e3e", "#805ad5", "#dd6b20"];

export default function WorkloadPieChart({ data }) {
  if (!data || data.length === 0) return <p>No workload data.</p>;

  return (
    <div className="chart-panel">
      <div className="chart-header">
        <h3>Staff Workload Distribution</h3>
        <span className="chart-badge">By Department</span>
      </div>
      <div className="chart-body">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="total_workload_hours"
            nameKey="department"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ department, percent }) =>
              `${department} ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => `${v} hrs`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}
