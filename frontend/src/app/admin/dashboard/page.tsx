"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useAttendanceStore } from "@/store/attendanceStore";
import Card from "@/components/ui/Card";
import AttendanceChart from "@/components/AttendanceChart";
import ActivityFeed from "@/components/ActivityFeed";
import Button from "@/components/ui/Button";

export default function AdminDashboardPage() {
  const { dashboardStats, fetchDashboardStats } = useAttendanceStore();

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  const total = dashboardStats?.totalEmployees || 1;
  const present = dashboardStats?.presentToday || 0;
  const late = dashboardStats?.lateToday || 0;
  const absent = total - present - late;
  const presencePct = Math.round((present / total) * 100);

  const stats = [
    { label: "Total Karyawan", value: total, icon: "groups", color: "text-primary", bg: "bg-surface-container", trend: null },
    { label: "Hadir Hari Ini", value: present, icon: "how_to_reg", color: "text-green-700", bg: "bg-green-50", trend: `${presencePct}% kehadiran` },
    { label: "Terlambat", value: late, icon: "alarm_off", color: "text-red-700", bg: "bg-red-50", trend: late > 0 ? "Perlu perhatian" : null },
    { label: "Izin Pending", value: dashboardStats?.pendingLeaves ?? 0, icon: "mail", color: "text-primary", bg: "bg-surface-container-high", trend: (dashboardStats?.pendingLeaves ?? 0) > 0 ? `${dashboardStats?.pendingLeaves} perlu review` : null },
  ];

  return (
    <div className="px-md lg:px-xl pt-md pb-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-lg gap-md">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Dashboard</h1>
          <p className="text-on-surface-variant font-body-md">
            {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="flex gap-sm">
          <Link href="/admin/reports"><Button variant="secondary" size="sm" icon="assessment">Laporan</Button></Link>
          <Button variant="ghost" size="sm" icon="refresh" onClick={fetchDashboardStats}>Refresh</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-md mb-lg">
        {stats.map((s, i) => (
          <Card key={i} className="p-md lg:p-lg flex flex-col items-center text-center">
            <div className={`p-sm ${s.bg} rounded-lg mb-sm`}>
              <span className={`material-symbols-outlined ${s.color} text-2xl`}>{s.icon}</span>
            </div>
            <h2 className="text-[28px] lg:text-[36px] font-extrabold text-on-surface leading-tight font-data-mono">{s.value}</h2>
            <p className="text-[10px] lg:text-label-caps text-on-surface-variant uppercase tracking-widest mt-1">{s.label}</p>
            {s.trend && (
              <span className="text-[10px] text-on-surface-variant bg-surface-container-low px-1.5 py-0.5 rounded font-bold mt-1">
                {s.trend}
              </span>
            )}
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg mb-lg">
        <div className="lg:col-span-2">
          <AttendanceChart data={dashboardStats?.weeklyChart || []} />
        </div>
        <div className="lg:col-span-1 flex flex-col gap-lg">
          <ActivityFeed activities={dashboardStats?.recentActivity || []} />

        </div>
      </div>
    </div>
  );
}
