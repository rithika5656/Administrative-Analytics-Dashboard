 import React, { useState, useEffect, useCallback } from "react";
import {
  fetchDepartments,
  fetchStats,
  fetchWorkload,
  fetchResolutionTrends,
  fetchDepartmentActivity,
} from "./api";
import Sidebar from "./components/Sidebar";
import KpiCards from "./components/KpiCards";
import WorkloadPieChart from "./components/WorkloadPieChart";
import ResolutionTrendChart from "./components/ResolutionTrendChart";
import DepartmentActivityChart from "./components/DepartmentActivityChart";
import Filters from "./components/Filters";
import ComplaintsPage from "./pages/ComplaintsPage";
import StaffPage from "./pages/StaffPage";
import TrendsPage from "./pages/TrendsPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import PerformancePage from "./pages/PerformancePage";
import SettingsPage from "./pages/SettingsPage";
import ExportPage from "./pages/ExportPage";

const PAGE_TITLES = {
  dashboard: "Analytics Dashboard",
  complaints: "Complaints Management",
  staff: "Staff Directory",
  trends: "Resolution Trends",
  departments: "Department Overview",
  performance: "Staff Performance",
  settings: "Settings",
  export: "Export Reports",
};

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");

  // ── filter state ──
  const [departments, setDepartments] = useState([]);
  const [departmentId, setDepartmentId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ── data state ──
  const [stats, setStats] = useState(null);
  const [workload, setWorkload] = useState([]);
  const [trends, setTrends] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load departments once
  useEffect(() => {
    fetchDepartments().then(setDepartments).catch(console.error);
  }, []);

  // Build query params from filters
  const buildParams = useCallback(() => {
    const p = {};
    if (departmentId) p.department_id = departmentId;
    if (startDate) p.start_date = new Date(startDate).toISOString();
    if (endDate) p.end_date = new Date(endDate).toISOString();
    return p;
  }, [departmentId, startDate, endDate]);

  // Fetch dashboard data only when on dashboard page
  useEffect(() => {
    if (activePage !== "dashboard") return;
    setLoading(true);
    const params = buildParams();

    Promise.all([
      fetchStats(params),
      fetchWorkload(params),
      fetchResolutionTrends(params),
      fetchDepartmentActivity(params),
    ])
      .then(([s, w, t, a]) => {
        setStats(s);
        setWorkload(w);
        setTrends(t);
        setActivity(a);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [buildParams, activePage]);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const renderPage = () => {
    switch (activePage) {
      case "complaints":
        return <ComplaintsPage />;
      case "staff":
        return <StaffPage />;
      case "trends":
        return <TrendsPage />;
      case "departments":
        return <DepartmentsPage />;
      case "performance":
        return <PerformancePage />;
      case "settings":
        return <SettingsPage />;
      case "export":
        return <ExportPage />;
      default:
        return (
          <>
            <Filters
              departments={departments}
              departmentId={departmentId}
              setDepartmentId={setDepartmentId}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
            />
            {loading ? (
              <div className="loading">
                <div className="loading-spinner"></div>
                Loading dashboard data...
              </div>
            ) : (
              <>
                <KpiCards stats={stats} />
                <div className="charts-row">
                  <WorkloadPieChart data={workload} />
                  <ResolutionTrendChart data={trends} />
                </div>
                <div className="charts-row">
                  <DepartmentActivityChart data={activity} />
                </div>
              </>
            )}
          </>
        );
    }
  };

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      <main className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="top-bar-left">
            <h1>{PAGE_TITLES[activePage] || "Dashboard"}</h1>
            <p>{today}</p>
          </div>
          <div className="top-bar-right">
            <div className="status-badge">
              <span className="dot"></span> System Online
            </div>
            <div className="avatar">AD</div>
          </div>
        </div>

        {/* Page Body */}
        <div className="dashboard-body">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
