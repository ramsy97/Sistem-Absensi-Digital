import { create } from "zustand";
import { Attendance, LeaveRequest, DashboardStats, PaginatedResponse } from "@/types";
import api from "@/lib/api";

interface AttendanceState {
  todayAttendance: Attendance | null;
  history: PaginatedResponse<Attendance> | null;
  myLeaves: LeaveRequest[];
  dashboardStats: DashboardStats | null;
  loading: boolean;
  error: string | null;

  fetchTodayStatus: () => Promise<void>;
  fetchHistory: (page?: number, month?: string, year?: string) => Promise<void>;
  fetchMyLeaves: () => Promise<void>;
  fetchDashboardStats: () => Promise<void>;
  checkIn: (data: FormData) => Promise<Attendance>;
  checkOut: (data: FormData) => Promise<Attendance>;
  requestLeave: (data: FormData) => Promise<LeaveRequest>;
  processLeave: (id: string, action: "approved" | "rejected") => Promise<void>;
}

export const useAttendanceStore = create<AttendanceState>((set) => ({
  todayAttendance: null,
  history: null,
  myLeaves: [],
  dashboardStats: null,
  loading: false,
  error: null,

  fetchTodayStatus: async () => {
    try {
      const { data } = await api.get("/attendance/today");
      set({ todayAttendance: data });
    } catch {
      set({ todayAttendance: null });
    }
  },

  fetchHistory: async (page = 1, month?: string, year?: string) => {
    set({ loading: true });
    try {
      const params: any = { page, limit: 20 };
      if (month) params.month = month;
      if (year) params.year = year;
      const { data } = await api.get("/attendance/history", { params });
      set({ history: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchMyLeaves: async () => {
    try {
      const { data } = await api.get("/leaves/my");
      set({ myLeaves: data });
    } catch {
      set({ myLeaves: [] });
    }
  },

  fetchDashboardStats: async () => {
    try {
      const { data } = await api.get("/admin/dashboard");
      set({ dashboardStats: data });
    } catch {
      console.error("Failed to fetch dashboard stats");
    }
  },

  checkIn: async (formData: FormData) => {
    const { data } = await api.post("/attendance/check-in", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    set({ todayAttendance: data });
    return data;
  },

  checkOut: async (formData: FormData) => {
    const { data } = await api.post("/attendance/check-out", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    set({ todayAttendance: data });
    return data;
  },

  requestLeave: async (formData: FormData) => {
    const { data } = await api.post("/leaves/request", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  processLeave: async (id: string, action: "approved" | "rejected") => {
    await api.put(`/admin/leaves/${id}/process`, { action });
  },
}));
