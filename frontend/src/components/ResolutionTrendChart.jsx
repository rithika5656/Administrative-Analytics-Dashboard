import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ResolutionTrendChart({ data }) {
  if (!data || data.length === 0) return <p>No trend data.</p>;

  return (
    <div className="chart-panel">
      <div className="chart-header">
        <h3>Resolution Trends</h3>
        <span className="chart-badge">Monthly</span>
      </div>
      <div className="chart-body">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="resolved_count"
            stroke="#2b6cb0"
            strokeWidth={2}
            name="Resolved Count"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="avg_resolution_hours"
            stroke="#e53e3e"
            strokeWidth={2}
            name="Avg Hours"
          />
        </LineChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}
