"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, isAdmin } from "@/lib/auth";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) router.replace("/login");
    else if (isAdmin()) router.replace("/admin/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar />
      <main className="lg:ml-64 pt-12 pb-20 lg:pb-md min-h-screen">{children}</main>
      <BottomNav />
    </div>
  );
}
