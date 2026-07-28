"use client";
import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { Attendance } from "@/types";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";

export default function AdminAttendancePage() {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/reports?limit=10").then(({ data }) => {
      setAttendances(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="p-md lg:p-xl max-w-7xl mx-auto">
      <div className="mb-lg">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Attendance Logs</h1>
        <p className="text-on-surface-variant">Real-time attendance entries</p>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-lg py-md text-label-caps text-on-surface-variant uppercase tracking-wider">Employee</th>
                <th className="px-lg py-md text-label-caps text-on-surface-variant uppercase tracking-wider">Check In</th>
                <th className="px-lg py-md text-label-caps text-on-surface-variant uppercase tracking-wider">Check Out</th>
                <th className="px-lg py-md text-label-caps text-on-surface-variant uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {loading ? (
                <tr><td colSpan={4} className="px-lg py-md text-center text-on-surface-variant">Loading...</td></tr>
              ) : attendances.length === 0 ? (
                <tr><td colSpan={4} className="px-lg py-md text-center text-on-surface-variant">No attendance data</td></tr>
              ) : (
                attendances.map((a) => (
                  <tr key={a.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-md">
                        <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
                          {a.user?.fullName?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p className="font-bold text-on-surface">{a.user?.fullName}</p>
                          <p className="text-body-sm text-on-surface-variant">{a.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-lg py-md font-data-mono text-body-sm">
                      {new Date(a.checkInTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-lg py-md font-data-mono text-body-sm">
                      {a.checkOutTime ? new Date(a.checkOutTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "—"}
                    </td>
                    <td className="px-lg py-md"><StatusBadge status={a.status} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
