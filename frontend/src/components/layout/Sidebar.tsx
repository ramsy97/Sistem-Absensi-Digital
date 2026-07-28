"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getUser, clearAuth } from "@/lib/auth";

const adminNav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/attendance", label: "Attendance", icon: "event_available" },
  { href: "/admin/leaves", label: "Leave Mgmt", icon: "calendar_today" },
  { href: "/admin/reports", label: "Reports", icon: "analytics" },
];

const employeeNav = [
  { href: "/employee/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/attendance", label: "Attendance", icon: "event_available" },
  { href: "/employee/history", label: "History", icon: "history" },
  { href: "/employee/leave", label: "Leave Request", icon: "calendar_today" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const user = getUser();
    setAdmin(user?.role === "admin");
  }, []);

  const nav = admin ? adminNav : employeeNav;

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  return (
    <aside className="hidden lg:flex flex-col h-screen p-md gap-sm w-64 fixed left-0 top-0 z-40 bg-surface-bright border-r border-outline-variant">
      <div className="flex flex-col gap-xs mb-lg pt-12">
        <div className="flex items-center gap-sm px-sm py-md">
          <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary-container fill-icon">
              corporate_fare
            </span>
          </div>
          <div>
            <p className="font-headline-md text-[16px] font-bold text-primary">
              {admin ? "Admin Portal" : "Employee Portal"}
            </p>
            <p className="text-[11px] text-on-surface-variant uppercase tracking-wider">
              {admin ? "Enterprise Edition" : "Attendance System"}
            </p>
          </div>
        </div>
      </div>
      <nav className="flex-grow flex flex-col gap-1">
        {nav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-md px-md py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-primary-container text-on-primary-container font-bold"
                  : "text-on-surface-variant hover:bg-surface-container-low"
              }`}
            >
              <span className={`material-symbols-outlined ${isActive ? "fill-icon" : ""}`}>
                {item.icon}
              </span>
              <span className="text-body-md">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto flex flex-col gap-1 pt-md border-t border-outline-variant">
        <Link
          href="/attendance"
          className="w-full bg-primary text-on-primary font-bold py-3 rounded-lg mb-md active:scale-95 transition-transform text-center block"
        >
          Clock In Now
        </Link>
        <Link
          href="/settings"
          className="flex items-center gap-md px-md py-2 text-on-surface-variant hover:bg-surface-container-low transition-all rounded-lg w-full"
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="text-body-sm">Settings</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-md px-md py-2 text-error hover:bg-error-container transition-all rounded-lg w-full"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="text-body-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}
