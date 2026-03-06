import React, { useState, useEffect } from "react";
import { fetchComplaints, fetchStaff, fetchDepartments } from "../api";
import { IconDownload } from "../components/Icons";

function downloadCSV(filename, headers, rows) {
  const csvContent = [
    headers.join(","),
    ...rows.map((r) =>
      r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

export default function ExportPage() {
  const [exporting, setExporting] = useState("");
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchDepartments().then(setDepartments).catch(console.error);
  }, []);

  const exportComplaints = async () => {
    setExporting("complaints");
    try {
      const data = await fetchComplaints({});
      downloadCSV(
        "complaints_report.csv",
        ["ID", "Title", "Department", "Assigned To", "Severity", "Status", "Date"],
        data.map((c) => [
          c.id, c.title, c.department_name, c.assigned_staff_name,
          c.severity, c.status, new Date(c.created_at).toLocaleDateString(),
        ])
      );
    } catch (e) { console.error(e); }
    setExporting("");
  };

  const exportStaff = async () => {
    setExporting("staff");
    try {
      const data = await fetchStaff({});
      downloadCSV(
        "staff_report.csv",
        ["ID", "Name", "Role", "Department", "Workload Hours"],
        data.map((s) => [s.id, s.name, s.role, s.department_name, s.workload_hours])
      );
    } catch (e) { console.error(e); }
    setExporting("");
  };

  const exportDepartments = async () => {
    setExporting("departments");
    try {
      downloadCSV(
        "departments_report.csv",
        ["ID", "Name", "Head", "Specialization"],
        departments.map((d) => [d.id, d.name, d.head, d.specialization])
      );
    } catch (e) { console.error(e); }
    setExporting("");
  };

  const reports = [
    { key: "complaints", title: "Complaints Report", desc: "Export all complaints with severity, status, and assignment details.", action: exportComplaints },
    { key: "staff", title: "Staff Report", desc: "Export staff directory with roles and workload information.", action: exportStaff },
    { key: "departments", title: "Departments Report", desc: "Export department list with head and specialization details.", action: exportDepartments },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Export Reports</h2>
          <p className="page-subtitle">Download data reports as CSV files</p>
        </div>
      </div>

      <div className="export-grid">
        {reports.map((r) => (
          <div key={r.key} className="export-card">
            <div className="export-card-icon"><IconDownload size={24} /></div>
            <h3>{r.title}</h3>
            <p>{r.desc}</p>
            <button
              className="btn-primary"
              onClick={r.action}
              disabled={exporting === r.key}
            >
              {exporting === r.key ? "Exporting..." : "Download CSV"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
