"use client";
import React from "react";
import { Attendance } from "@/types";

export default function ActivityFeed({ activities }: { activities: Attendance[] }) {
  if (!activities?.length) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl">
        <div className="p-lg border-b border-outline-variant">
          <h3 className="font-headline-md text-on-surface">Recent Activity</h3>
        </div>
        <div className="p-lg text-center text-on-surface-variant">No recent activity</div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl flex flex-col">
      <div className="p-lg border-b border-outline-variant">
        <h3 className="font-headline-md text-on-surface">Recent Activity</h3>
      </div>
      <div className="p-md flex-grow overflow-y-auto max-h-[400px]">
        <ul className="space-y-md">
          {activities.map((a) => {
            const time = new Date(a.checkInTime).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            });
            const isLate = a.status === "late";
            return (
              <li key={a.id} className="flex items-start gap-md">
                <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold flex-shrink-0">
                  {a.user?.fullName?.charAt(0) || "?"}
                </div>
                <div className="flex-grow">
                  <p className="text-body-sm">
                    <span className="font-bold text-on-surface">{a.user?.fullName}</span> clocked in
                  </p>
                  <p className={`text-[12px] font-data-mono ${isLate ? "text-red-700" : "text-on-surface-variant"}`}>
                    {time} {isLate ? "• Late" : "• On Time"}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
