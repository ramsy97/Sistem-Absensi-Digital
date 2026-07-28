"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getUser } from "@/lib/auth";

const adminNav = [
  { href: "/admin/dashboard", label: "Home", icon: "home" },
  { href: "/admin/attendance", label: "Logs", icon: "history" },
  { href: "/admin/leaves", label: "Leaves", icon: "bar_chart" },
  { href: "/settings", label: "Settings", icon: "settings" },
];

const employeeNav = [
  { href: "/employee/dashboard", label: "Home", icon: "home" },
  { href: "/employee/history", label: "Logs", icon: "history" },
  { href: "/employee/leave", label: "Leave", icon: "bar_chart" },
  { href: "/settings", label: "Settings", icon: "settings" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const user = getUser();
    setAdmin(user?.role === "admin");
  }, []);

  const nav = admin ? adminNav : employeeNav;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-surface border-t border-outline-variant shadow-md">
      {nav.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center py-1 active:scale-90 transition-transform duration-150 ${
              isActive
                ? "bg-primary-container text-on-primary-container rounded-full px-4"
                : "text-on-surface-variant"
            }`}
          >
            <span className={`material-symbols-outlined ${isActive ? "fill-icon" : ""}`}>
              {item.icon}
            </span>
            <span className="text-[10px] font-label-caps">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
