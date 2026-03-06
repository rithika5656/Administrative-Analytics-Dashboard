import React, { useState } from "react";
import { IconSettings } from "../components/Icons";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    hospitalName: "City General Hospital",
    adminEmail: "admin@hospital.org",
    refreshInterval: "30",
    theme: "light",
  });

  const handleChange = (key, value) => {
    setSettings((s) => ({ ...s, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Settings</h2>
          <p className="page-subtitle">Configure dashboard preferences</p>
        </div>
      </div>

      <div className="settings-card">
        <div className="settings-section">
          <h3>
            <IconSettings size={18} /> General Settings
          </h3>

          <div className="settings-row">
            <label>Hospital Name</label>
            <input
              type="text"
              value={settings.hospitalName}
              onChange={(e) => handleChange("hospitalName", e.target.value)}
            />
          </div>

          <div className="settings-row">
            <label>Admin Email</label>
            <input
              type="email"
              value={settings.adminEmail}
              onChange={(e) => handleChange("adminEmail", e.target.value)}
            />
          </div>

          <div className="settings-row">
            <label>Dashboard Refresh Interval (seconds)</label>
            <select
              value={settings.refreshInterval}
              onChange={(e) => handleChange("refreshInterval", e.target.value)}
            >
              <option value="15">15s</option>
              <option value="30">30s</option>
              <option value="60">60s</option>
              <option value="120">120s</option>
            </select>
          </div>

          <div className="settings-row">
            <label>Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => handleChange("theme", e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>

        <div className="settings-actions">
          <button className="btn-primary" onClick={handleSave}>
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
