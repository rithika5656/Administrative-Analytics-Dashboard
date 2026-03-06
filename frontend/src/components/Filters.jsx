import React from "react";

export default function Filters({
  departments,
  departmentId,
  setDepartmentId,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) {
  const handleReset = () => {
    setDepartmentId("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="filters-bar">
      <div className="filter-group">
        <label>Department</label>
        <select
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      {(departmentId || startDate || endDate) && (
        <button className="filter-reset" onClick={handleReset}>
          ✕ Reset Filters
        </button>
      )}
    </div>
  );
}
