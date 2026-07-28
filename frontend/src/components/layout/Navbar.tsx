"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getUser, clearAuth } from "@/lib/auth";
import api from "@/lib/api";

interface Notif {
  id: string;
  text: string;
  time: string;
  type: "info" | "warning" | "alert";
}

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<ReturnType<typeof getUser>>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notif[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await api.get("/attendance/history?limit=5");
      const items: Notif[] = (data.data || []).map((a: any) => ({
        id: a.id,
        text: `${a.user?.fullName || "Someone"} clocked in`,
        time: new Date(a.checkInTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        type: a.status === "late" ? "alert" : "info",
      }));
      setNotifications(items);
      const raw = localStorage.getItem("seenNotifIds");
      const seen = raw ? new Set<string>(JSON.parse(raw)) : new Set<string>();
      const newUnread = items.filter((n) => !seen.has(n.id)).length;
      setUnreadCount(newUnread);
    } catch {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, []);

  useEffect(() => {
    setUser(getUser());
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  return (
    <header className="flex justify-between items-center w-full px-md h-12 fixed top-0 z-50 bg-surface border-b border-outline-variant">
      <div className="flex items-center gap-sm">
        <span className="font-headline-md text-headline-md font-bold text-primary">WorkSync Pro</span>
      </div>
      <div className="flex items-center gap-md">
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              if (!notifOpen) {
                setUnreadCount(0);
                const raw = localStorage.getItem("seenNotifIds");
                const seen = raw ? new Set<string>(JSON.parse(raw)) : new Set<string>();
                notifications.forEach((n) => seen.add(n.id));
                localStorage.setItem("seenNotifIds", JSON.stringify([...seen]));
              }
            }}
            className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-high transition-colors p-1 rounded-full relative"
          >
            notifications
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-error text-on-error text-[10px] font-bold flex items-center justify-center rounded-full px-1">
                {unreadCount}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl overflow-hidden">
              <div className="p-3 border-b border-outline-variant">
                <p className="font-headline-md text-sm font-bold text-on-surface">Notifications</p>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-on-surface-variant text-body-sm">No notifications</div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="flex items-start gap-3 p-3 hover:bg-surface-container-low transition-colors border-b border-outline-variant/50 last:border-0">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        n.type === "alert" ? "bg-error" : n.type === "warning" ? "bg-amber-500" : "bg-primary"
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-body-sm text-on-surface">{n.text}</p>
                        <p className="text-[11px] text-on-surface-variant font-data-mono">{n.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        <button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-high transition-colors p-1 rounded-full">
          help
        </button>
        <div className="flex items-center gap-sm">
          <span className="text-body-sm text-on-surface-variant hidden md:block">{user?.fullName}</span>
          <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm overflow-hidden border border-primary">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              user?.fullName?.charAt(0) || "U"
            )}
          </div>
        </div>
        <button onClick={handleLogout} className="material-symbols-outlined text-error hover:bg-error-container transition-colors p-1 rounded-full">
          logout
        </button>
      </div>
    </header>
  );
}
