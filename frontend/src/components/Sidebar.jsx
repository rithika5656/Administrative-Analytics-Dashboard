import React from "react";
import {
  IconHospital,
  IconDashboard,
  IconClipboard,
  IconUsers,
  IconTrending,
  IconBuilding,
  IconZap,
  IconSettings,
  IconDownload,
} from "./Icons";

const NAV_ITEMS = [
  { section: "Main" },
  { key: "dashboard", label: "Dashboard", icon: IconDashboard },
  { key: "complaints", label: "Complaints", icon: IconClipboard },
  { key: "staff", label: "Staff", icon: IconUsers },
  { section: "Analytics" },
  { key: "trends", label: "Trends", icon: IconTrending },
  { key: "departments", label: "Departments", icon: IconBuilding },
  { key: "performance", label: "Performance", icon: IconZap },
  { section: "Administration" },
  { key: "settings", label: "Settings", icon: IconSettings },
  { key: "export", label: "Export Reports", icon: IconDownload },
];

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="brand-icon">
          <IconHospital size={22} />
        </div>
        <h2>MedAdmin</h2>
        <span>Analytics Platform</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item, i) =>
          item.section ? (
            <div key={`s-${i}`} className="nav-section">
              {item.section}
            </div>
          ) : (
            <div
              key={item.key}
              className={`nav-item${activePage === item.key ? " active" : ""}`}
              onClick={() => onNavigate(item.key)}
            >
              <span className="nav-icon">
                <item.icon size={18} />
              </span>
              {item.label}
            </div>
          )
        )}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        MedAdmin v1.0 &middot; Hospital Analytics
      </div>
    </aside>
  );
}
