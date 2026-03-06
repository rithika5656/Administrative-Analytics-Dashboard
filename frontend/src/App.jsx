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

export default function App() {
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

  // Fetch all dashboard data whenever filters change
  useEffect(() => {
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
  }, [buildParams]);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="top-bar-left">
            <h1>Analytics Dashboard</h1>
            <p>{today}</p>
          </div>
          <div className="top-bar-right">
            <div className="status-badge">
              <span className="dot"></span> System Online
            </div>
            <div className="avatar">AD</div>
          </div>
        </div>

        {/* Dashboard Body */}
        <div className="dashboard-body">
          {/* Filters */}
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
              Loading dashboard data…
            </div>
          ) : (
            <>
              {/* KPI Cards */}
              <KpiCards stats={stats} />

              {/* Charts Row: Pie + Line */}
              <div className="charts-row">
                <WorkloadPieChart data={workload} />
                <ResolutionTrendChart data={trends} />
              </div>

              {/* Full-width Bar Chart */}
              <div className="charts-row">
                <DepartmentActivityChart data={activity} />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
