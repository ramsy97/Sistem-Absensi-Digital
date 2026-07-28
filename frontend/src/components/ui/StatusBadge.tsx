import React from "react";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

const statusStyles: Record<string, string> = {
  on_time: "bg-[#D1FAE5] text-[#065F46]",
  late: "bg-[#FEE2E2] text-[#991B1B]",
  absent: "bg-surface-container-high text-on-surface-variant",
  present: "bg-[#D1FAE5] text-[#065F46]",
  pending: "bg-amber-50 text-amber-800",
  approved: "bg-[#D1FAE5] text-[#065F46]",
  rejected: "bg-[#FEE2E2] text-[#991B1B]",
};

const statusLabels: Record<string, string> = {
  on_time: "On Time",
  late: "Late",
  absent: "Absent",
  present: "Present",
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

export default function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const s = status.toLowerCase();
  return (
    <span
      className={`inline-block font-label-caps font-bold uppercase tracking-wider rounded-full ${
        size === "sm" ? "px-3 py-1 text-[11px]" : "px-4 py-1.5 text-label-caps"
      } ${statusStyles[s] || "bg-surface-container-high text-on-surface-variant"}`}
    >
      {statusLabels[s] || status}
    </span>
  );
}
