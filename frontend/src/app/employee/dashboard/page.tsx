"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAttendanceStore } from "@/store/attendanceStore";
import api from "@/lib/api";
import LiveClock from "@/components/LiveClock";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import Button from "@/components/ui/Button";

export default function EmployeeDashboardPage() {
  const { todayAttendance, fetchTodayStatus, fetchHistory } = useAttendanceStore();
  const [monthlySummary, setMonthlySummary] = useState({ present: 0, late: 0, total: 0 });

  useEffect(() => {
    fetchTodayStatus();
    const now = new Date();
    fetchHistory(1, String(now.getMonth() + 1), String(now.getFullYear())).then(() => {
      api.get("/attendance/history", { params: { month: String(now.getMonth() + 1), year: String(now.getFullYear()), limit: 50 } })
        .then(({ data }) => {
          const records = data.data || [];
          setMonthlySummary({
            present: records.filter((r: any) => r.status === "on_time").length,
            late: records.filter((r: any) => r.status === "late").length,
            total: records.length,
          });
        });
    });
  }, [fetchTodayStatus, fetchHistory]);

  const [recentHistory, setRecentHistory] = useState<any[]>([]);
  useEffect(() => {
    api.get("/attendance/history", { params: { limit: 5 } }).then(({ data }) => {
      setRecentHistory(data.data || []);
    });
  }, []);

  const isCheckedIn = todayAttendance && !todayAttendance.checkOutTime;

  return (
    <div className="p-md lg:p-xl max-w-content mx-auto space-y-md">
      <section className="flex flex-col items-center py-xl space-y-md">
        <LiveClock />
        <div className="flex items-center gap-sm bg-surface-container-low px-md py-xs rounded-full border border-outline-variant">
          <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
          <span className="text-label-caps uppercase text-on-surface-variant">
            {todayAttendance?.office?.name || "Office"}
          </span>
        </div>
        <div className="w-full space-y-sm pt-md">
          <Link href="/attendance" className="block">
            <Button
              fullWidth
              variant={isCheckedIn ? "danger" : "primary"}
              size="lg"
              icon={isCheckedIn ? "logout" : "login"}
            >
              {isCheckedIn ? "Clock Out Now" : "Clock In Now"}
            </Button>
          </Link>
        </div>
      </section>

      {todayAttendance && (
        <Card className="p-md">
          <div className="flex justify-between items-center mb-md">
            <h3 className="font-headline-md text-headline-md">Today&apos;s Status</h3>
            <StatusBadge status={todayAttendance.status} />
          </div>
          <div className="grid grid-cols-3 gap-md divide-x divide-outline-variant text-center">
            <div>
              <p className="text-label-caps text-on-surface-variant mb-xs">In Time</p>
              <p className="font-data-mono text-body-md font-bold">
                {new Date(todayAttendance.checkInTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
            <div>
              <p className="text-label-caps text-on-surface-variant mb-xs">Duration</p>
              <p className="font-data-mono text-body-md font-bold">
                {todayAttendance.checkOutTime
                  ? `${Math.round((new Date(todayAttendance.checkOutTime).getTime() - new Date(todayAttendance.checkInTime).getTime()) / 3600000)}h`
                  : "Active"}
              </p>
            </div>
            <div>
              <p className="text-label-caps text-on-surface-variant mb-xs">Status</p>
              <p className="font-data-mono text-body-md font-bold text-secondary">
                {todayAttendance.checkOutTime ? "Done" : "Working"}
              </p>
            </div>
          </div>
        </Card>
      )}

      <Link href="/employee/leave" className="group block bg-primary text-on-primary p-md rounded-xl shadow-md hover:shadow-lg transition-all">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-md">
            <div className="bg-white/20 p-sm rounded-lg">
              <span className="material-symbols-outlined">event_busy</span>
            </div>
            <div>
              <p className="font-bold text-body-md">Apply for Leave</p>
              <p className="text-white/70 text-body-sm">Submit your request for approval</p>
            </div>
          </div>
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">chevron_right</span>
        </div>
      </Link>

      <section className="space-y-sm">
        <h3 className="font-headline-md text-headline-md pt-md">
          {new Date().toLocaleDateString("en-US", { month: "long" })} Summary
        </h3>
        <div className="grid grid-cols-2 gap-sm">
          <Card className="p-md flex flex-col justify-between h-32">
            <span className="material-symbols-outlined text-primary">verified</span>
            <div>
              <p className="text-display-lg font-data-mono leading-none">{monthlySummary.present}</p>
              <p className="text-label-caps text-on-surface-variant">On Time</p>
            </div>
          </Card>
          <Card className="p-md flex flex-col justify-between h-32 bg-error-container border-error-container/50">
            <span className="material-symbols-outlined text-error">warning</span>
            <div>
              <p className="text-display-lg font-data-mono leading-none text-error">{monthlySummary.late}</p>
              <p className="text-label-caps text-error">Late Marks</p>
            </div>
          </Card>
          <Card className="col-span-2 overflow-hidden">
            <div className="p-md flex justify-between items-center border-b border-outline-variant">
              <span className="font-bold text-body-md">Attendance History</span>
              <Link href="/employee/history" className="text-primary font-label-caps">View Full</Link>
            </div>
            <div className="divide-y divide-outline-variant">
              {recentHistory.length === 0 ? (
                <div className="px-md py-sm text-body-sm text-on-surface-variant">No records yet</div>
              ) : (
                recentHistory.map((r: any) => (
                  <div key={r.id} className="px-md py-sm flex justify-between items-center">
                    <div>
                      <p className="text-body-sm font-bold">
                        {new Date(r.checkInTime).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-data-mono text-body-sm">
                        {new Date(r.checkInTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                        {r.checkOutTime ? ` - ${new Date(r.checkOutTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}` : ""}
                      </p>
                      <StatusBadge status={r.status} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
