import React from "react";
import { IconClipboard, IconAlert, IconClock, IconUsers } from "./Icons";

export default function KpiCards({ stats }) {
  if (!stats) return null;

  const cards = [
    {
      label: "Total Complaints",
      value: stats.total_complaints,
      color: "blue",
      icon: <IconClipboard size={22} />,
      sub: `${stats.total_departments} departments tracked`,
    },
    {
      label: "Open Issues",
      value: stats.open_complaints,
      color: "red",
      icon: <IconAlert size={22} />,
      sub: `${stats.in_progress_complaints} in progress`,
    },
    {
      label: "Avg Resolution",
      value: `${stats.avg_resolution_hours}h`,
      color: "amber",
      icon: <IconClock size={22} />,
      sub: `${stats.resolved_complaints + stats.closed_complaints} resolved total`,
    },
    {
      label: "Total Staff",
      value: stats.total_staff,
      color: "green",
      icon: <IconUsers size={22} />,
      sub: `Across ${stats.total_departments} departments`,
    },
  ];

  return (
    <div className="kpi-row">
      {cards.map((c) => (
        <div key={c.label} className={`kpi-card ${c.color}`}>
          <div className={`kpi-icon ${c.color}`}>{c.icon}</div>
          <div className="kpi-info">
            <div className="kpi-value">{c.value}</div>
            <div className="kpi-label">{c.label}</div>
            <div className="kpi-sub">{c.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
