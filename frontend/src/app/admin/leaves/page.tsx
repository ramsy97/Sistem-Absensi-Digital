"use client";
import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { LeaveRequest } from "@/types";
import { useAttendanceStore } from "@/store/attendanceStore";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import Button from "@/components/ui/Button";

export default function AdminLeavesPage() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { processLeave } = useAttendanceStore();

  const fetchLeaves = async () => {
    try {
      const { data } = await api.get("/admin/leaves/pending");
      setLeaves(data);
    } catch {
      console.error("Failed to fetch leaves");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeaves(); }, []);

  const handleProcess = async (id: string, action: "approved" | "rejected") => {
    await processLeave(id, action);
    fetchLeaves();
  };

  const getTypeLabel = (t: string) => {
    const map: Record<string, string> = { sick: "Sick Leave", annual: "Annual Leave", personal: "Personal Leave", unpaid: "Unpaid Leave", maternity: "Maternity/Paternity" };
    return map[t] || t;
  };

  return (
    <div className="p-md lg:p-xl max-w-7xl mx-auto">
      <div className="mb-lg">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Leave Management</h1>
        <p className="text-on-surface-variant">Review and manage leave requests</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-lg">
        <section className="lg:col-span-5">
          <Card className="overflow-hidden">
            <div className="p-lg border-b border-outline-variant flex justify-between items-center">
              <h3 className="font-headline-md text-on-surface">Pending Approvals</h3>
              <span className="bg-error-container text-on-error-container px-sm py-xs rounded-full font-label-caps text-label-caps">
                {leaves.length} ACTION REQUIRED
              </span>
            </div>
            <div className="divide-y divide-outline-variant">
              {loading ? (
                <div className="p-lg text-center text-on-surface-variant">Loading...</div>
              ) : leaves.length === 0 ? (
                <div className="p-lg text-center text-on-surface-variant">No pending leave requests</div>
              ) : (
                leaves.map((l) => (
                  <div key={l.id} className="p-lg hover:bg-surface-container-low transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
                      <div className="flex items-center gap-md">
                        <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
                          {l.user?.fullName?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p className="font-body-md text-body-md font-bold text-on-surface">{l.user?.fullName}</p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">{getTypeLabel(l.type)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-lg">
                        <div className="text-right">
                          <p className="font-data-mono text-data-mono text-on-surface">
                            {new Date(l.startDate).toLocaleDateString()} - {new Date(l.endDate).toLocaleDateString()}
                          </p>
                          <p className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                            {Math.ceil((new Date(l.endDate).getTime() - new Date(l.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} DAYS
                          </p>
                        </div>
                        <div className="flex gap-sm">
                          <button
                            onClick={() => handleProcess(l.id, "rejected")}
                            className="p-sm text-error border border-error rounded-lg hover:bg-error-container transition-colors active:scale-90"
                          >
                            <span className="material-symbols-outlined">close</span>
                          </button>
                          <button
                            onClick={() => handleProcess(l.id, "approved")}
                            className="p-sm bg-primary text-on-primary rounded-lg hover:bg-primary-container transition-colors active:scale-90"
                          >
                            <span className="material-symbols-outlined">check</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-md bg-surface-container-low p-sm rounded-lg">
                      <p className="font-body-sm text-body-sm italic text-on-surface-variant">&ldquo;{l.reason}&rdquo;</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
