"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAttendanceStore } from "@/store/attendanceStore";
import { isAuthenticated, getUser } from "@/lib/auth";
import LiveClock from "@/components/LiveClock";
import CameraCapture from "@/components/CameraCapture";
import LocationMap from "@/components/LocationMap";
import Button from "@/components/ui/Button";

export default function AttendancePage() {
  const router = useRouter();
  const { todayAttendance, fetchTodayStatus, checkIn, checkOut } = useAttendanceStore();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) router.replace("/login");
    else fetchTodayStatus();
  }, [router, fetchTodayStatus]);

  const isCheckedIn = todayAttendance && !todayAttendance.checkOutTime;

  const handleSubmit = async (type: "in" | "out") => {
    if (submitting) return;
    setSubmitting(true);
    setMessage(null);
    try {
      const fd = new FormData();
      if (photoFile) fd.append("photo", photoFile);
      if (location) {
        fd.append("lat", String(location.lat));
        fd.append("lng", String(location.lng));
      }
      if (type === "in") {
        await checkIn(fd);
        setMessage("Check-in successful! Your attendance has been recorded.");
      } else {
        await checkOut(fd);
        setMessage("Check-out successful! Have a good rest.");
      }
      setPhotoFile(null);
      fetchTodayStatus();
    } catch (err: any) {
      setMessage(err.response?.data?.error || `Failed to ${type === "in" ? "check in" : "check out"}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="flex justify-between items-center w-full px-md h-12 fixed top-0 z-50 bg-surface border-b border-outline-variant">
        <div className="flex items-center gap-sm">
          <button onClick={() => router.back()} className="material-symbols-outlined text-primary transition-transform active:scale-95">
            arrow_back
          </button>
          <span className="font-headline-md text-headline-md font-bold text-primary">WorkSync Pro</span>
        </div>
      </header>

      <main className="pt-16 pb-20 px-md max-w-content mx-auto mt-6 space-y-6">
        <div className="text-center space-y-1">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
            {isCheckedIn ? "Attendance Check-Out" : "Attendance Check-In"}
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            {isCheckedIn ? "Confirm to end your shift" : "Confirm your location and identity"}
          </p>
        </div>

        {message && (
          <div className={`p-md rounded-xl font-bold flex items-center gap-md ${
            message.includes("successful") || message.includes("success")
              ? "bg-[#D1FAE5] text-[#065F46]"
              : "bg-error-container text-on-error-container"
          }`}>
            <span className="material-symbols-outlined fill-icon">
              {message.includes("success") ? "check_circle" : "error"}
            </span>
            {message}
          </div>
        )}

        <CameraCapture onCapture={setPhotoFile} />

        <LocationMap
          onLocationChange={(lat, lng) => setLocation({ lat, lng })}
          officeName="HQ Main Office - Wing A"
        />

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="font-label-caps text-label-caps text-on-surface-variant">CURRENT TIME</span>
            <LiveClock size="headline-lg" />
          </div>
          <div className="text-right">
            <span className="font-label-caps text-label-caps text-on-surface-variant">SHIFT</span>
            <p className="font-body-md text-body-md font-semibold text-on-surface">09:00 - 18:00</p>
            {todayAttendance?.status === "late" && (
              <div className="bg-[#FEE2E2] text-[#991B1B] font-label-caps text-[10px] px-2 py-0.5 rounded-full inline-block mt-1">
                LATE
              </div>
            )}
          </div>
        </div>

        <Button
          fullWidth
          variant={isCheckedIn ? "danger" : "primary"}
          size="lg"
          icon={isCheckedIn ? "logout" : "login"}
          disabled={submitting}
          onClick={() => handleSubmit(isCheckedIn ? "out" : "in")}
        >
          {submitting
            ? "Processing..."
            : isCheckedIn
            ? "SUBMIT CHECK-OUT"
            : "SUBMIT ATTENDANCE"}
        </Button>

        <div className="h-8" />
      </main>

      <nav className="lg:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-surface border-t border-outline-variant shadow-md">
        <button onClick={() => router.push("/employee/dashboard")} className="flex flex-col items-center justify-center text-on-surface-variant py-1">
          <span className="material-symbols-outlined">home</span>
          <span className="text-[10px] font-label-caps">Home</span>
        </button>
      </nav>
    </div>
  );
}
