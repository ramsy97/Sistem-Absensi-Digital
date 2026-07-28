export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: "admin" | "employee";
  officeId?: string;
  office?: Office;
  createdAt: string;
}

export interface Office {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  workStartTime: string;
  workEndTime: string;
}

export interface Attendance {
  id: string;
  userId: string;
  user?: Pick<User, "id" | "fullName" | "email" | "username">;
  officeId?: string;
  office?: Office;
  checkInTime: string;
  checkOutTime?: string;
  checkInPhoto?: string;
  checkOutPhoto?: string;
  checkInLat?: number;
  checkInLong?: number;
  checkOutLat?: number;
  checkOutLong?: number;
  status: "on_time" | "late" | "absent";
  notes?: string;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  user?: Pick<User, "id" | "fullName" | "email" | "avatarUrl">;
  type: "sick" | "annual" | "personal" | "unpaid" | "maternity";
  startDate: string;
  endDate: string;
  reason: string;
  attachmentUrl?: string;
  status: "pending" | "approved" | "rejected";
  processedBy?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  lateToday: number;
  pendingLeaves: number;
  weeklyChart: { day: string; count: number }[];
  recentActivity: Attendance[];
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
