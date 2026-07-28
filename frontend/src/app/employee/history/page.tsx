"use client";
import React, { useEffect, useState } from "react";
import { useAttendanceStore } from "@/store/attendanceStore";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";

export default function EmployeeHistoryPage() {
  const { fetchHistory, history, loading } = useAttendanceStore();
  const [page, setPage] = useState(1);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(String(new Date().getFullYear()));

  useEffect(() => {
    fetchHistory(page, month || undefined, year);
  }, [fetchHistory, page, month, year]);

  return (
    <div className="p-md lg:p-xl max-w-content mx-auto space-y-md">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Attendance History</h1>
        <p className="text-on-surface-variant">Your complete attendance records</p>
      </div>

      <div className="flex gap-md items-center">
        <select
          value={month}
          onChange={(e) => { setMonth(e.target.value); setPage(1); }}
          className="h-12 border outline-variant rounded-lg font-body-md bg-surface focus:border-primary px-md flex-1"
        >
          <option value="">All Months</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={String(i + 1)}>
              {new Date(2024, i).toLocaleDateString("en-US", { month: "long" })}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={year}
          onChange={(e) => { setYear(e.target.value); setPage(1); }}
          className="h-12 w-24 border outline-variant rounded-lg font-body-md bg-surface focus:border-primary px-md text-center"
          placeholder="Year"
        />
      </div>

      <Card className="overflow-hidden">
        <div className="divide-y divide-outline-variant">
          {loading ? (
            <div className="p-lg text-center text-on-surface-variant">Loading...</div>
          ) : !history?.data?.length ? (
            <div className="p-lg text-center text-on-surface-variant">No attendance records found</div>
          ) : (
            history.data.map((r) => (
              <div key={r.id} className="px-md py-sm flex justify-between items-center hover:bg-surface-container-low transition-colors">
                <div>
                  <p className="text-body-sm font-bold">
                    {new Date(r.checkInTime).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                  </p>
                  <p className="text-label-caps text-on-surface-variant">
                    {r.office?.name || "Office"}
                  </p>
                </div>
                <div className="text-right flex items-center gap-md">
                  <div>
                    <p className="font-data-mono text-body-sm">
                      {new Date(r.checkInTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                      {r.checkOutTime ? ` - ${new Date(r.checkOutTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}` : " - ..."}
                    </p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {history?.meta && history.meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-body-sm text-on-surface-variant">
            Showing page {history.meta.page} of {history.meta.totalPages}
          </p>
          <div className="flex gap-xs">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container disabled:opacity-30"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button
              disabled={page >= (history.meta.totalPages || 1)}
              onClick={() => setPage((p) => p + 1)}
              className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container disabled:opacity-30"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
