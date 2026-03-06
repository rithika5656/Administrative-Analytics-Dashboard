import React from "react";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="brand-icon">🏥</div>
        <h2>MedAdmin</h2>
        <span>Analytics Platform</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section">Main</div>
        <div className="nav-item active">
          <span className="nav-icon">📊</span> Dashboard
        </div>
        <div className="nav-item">
          <span className="nav-icon">📋</span> Complaints
        </div>
        <div className="nav-item">
          <span className="nav-icon">👥</span> Staff
        </div>

        <div className="nav-section">Analytics</div>
        <div className="nav-item">
          <span className="nav-icon">📈</span> Trends
        </div>
        <div className="nav-item">
          <span className="nav-icon">🏢</span> Departments
        </div>
        <div className="nav-item">
          <span className="nav-icon">⚡</span> Performance
        </div>

        <div className="nav-section">Administration</div>
        <div className="nav-item">
          <span className="nav-icon">⚙️</span> Settings
        </div>
        <div className="nav-item">
          <span className="nav-icon">📤</span> Export Reports
        </div>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        MedAdmin v1.0 · Hospital Analytics
      </div>
    </aside>
  );
}
