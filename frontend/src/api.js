import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8000" });

export function fetchDepartments() {
  return API.get("/departments").then((r) => r.data);
}

export function fetchStats(params) {
  return API.get("/dashboard/stats", { params }).then((r) => r.data);
}

export function fetchWorkload(params) {
  return API.get("/dashboard/workload", { params }).then((r) => r.data);
}

export function fetchResolutionTrends(params) {
  return API.get("/dashboard/resolution-trends", { params }).then((r) => r.data);
}

export function fetchDepartmentActivity(params) {
  return API.get("/dashboard/department-activity", { params }).then((r) => r.data);
}

export function fetchComplaints(params) {
  return API.get("/complaints", { params }).then((r) => r.data);
}

export function fetchStaff(params) {
  return API.get("/staff", { params }).then((r) => r.data);
}

export function fetchDepartmentDetails() {
  return API.get("/departments/details").then((r) => r.data);
}

export function fetchPerformance() {
  return API.get("/performance").then((r) => r.data);
}
