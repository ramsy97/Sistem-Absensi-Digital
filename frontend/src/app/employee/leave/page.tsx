"use client";
import React, { useState } from "react";
import { useAttendanceStore } from "@/store/attendanceStore";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import StatusBadge from "@/components/ui/StatusBadge";

export default function EmployeeLeavePage() {
  const { requestLeave, myLeaves, fetchMyLeaves } = useAttendanceStore();
  const [type, setType] = useState("annual");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  React.useEffect(() => { fetchMyLeaves(); }, [fetchMyLeaves]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("type", type);
      fd.append("startDate", startDate);
      fd.append("endDate", endDate);
      fd.append("reason", reason);
      if (file) fd.append("attachment", file);
      await requestLeave(fd);
      setSuccess(true);
      setType("annual");
      setStartDate("");
      setEndDate("");
      setReason("");
      setFile(null);
      fetchMyLeaves();
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      alert("Failed to submit leave request");
    } finally {
      setSubmitting(false);
    }
  };

  const getTypeLabel = (t: string) => {
    const map: Record<string, string> = { sick: "Sick Leave", annual: "Annual Leave", personal: "Personal Leave", unpaid: "Unpaid Leave", maternity: "Maternity/Paternity" };
    return map[t] || t;
  };

  return (
    <div className="p-md lg:p-xl max-w-content mx-auto space-y-md">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Leave Request</h1>
        <p className="text-on-surface-variant">Submit your time off request</p>
      </div>

      {success && (
        <div className="bg-[#D1FAE5] text-[#065F46] p-md rounded-xl font-bold flex items-center gap-md">
          <span className="material-symbols-outlined fill-icon">check_circle</span>
          Request submitted successfully!
        </div>
      )}

      <Card className="p-lg">
        <h3 className="font-headline-md text-headline-md text-primary mb-md">Submit Request</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
          <div className="flex flex-col gap-xs">
            <label className="font-label-caps text-label-caps text-on-surface-variant">LEAVE TYPE</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="h-12 border-outline-variant rounded-lg font-body-md focus:border-primary focus:ring-primary-container bg-surface px-md"
            >
              <option value="annual">Annual Leave</option>
              <option value="sick">Sick Leave</option>
              <option value="personal">Personal Leave</option>
              <option value="maternity">Maternity/Paternity</option>
              <option value="unpaid">Unpaid Leave</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-md">
            <div className="flex flex-col gap-xs">
              <label className="font-label-caps text-label-caps text-on-surface-variant">START DATE</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="h-12 border-outline-variant rounded-lg font-body-md focus:border-primary bg-surface px-md"
              />
            </div>
            <div className="flex flex-col gap-xs">
              <label className="font-label-caps text-label-caps text-on-surface-variant">END DATE</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="h-12 border-outline-variant rounded-lg font-body-md focus:border-primary bg-surface px-md"
              />
            </div>
          </div>
          <div className="flex flex-col gap-xs">
            <label className="font-label-caps text-label-caps text-on-surface-variant">REASON</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="border-outline-variant rounded-lg font-body-md focus:border-primary bg-surface p-sm"
              placeholder="Briefly describe your reason..."
              rows={3}
            />
          </div>
          <div className="flex flex-col gap-xs">
            <label className="font-label-caps text-label-caps text-on-surface-variant">ATTACHMENT</label>
            <div className="border-2 border-dashed border-outline-variant rounded-xl p-lg flex flex-col items-center justify-center bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer group">
              <span className="material-symbols-outlined text-primary text-4xl mb-sm group-hover:scale-110 transition-transform">upload_file</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                {file ? file.name : "Drag and drop or click to upload"}
              </span>
              <input
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                id="file-upload"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <button
                type="button"
                onClick={() => document.getElementById("file-upload")?.click()}
                className="mt-sm text-primary font-bold text-body-sm"
              >
                Browse Files
              </button>
            </div>
          </div>
          <Button type="submit" fullWidth disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Leave Request"}
          </Button>
        </form>
      </Card>

      {myLeaves.length > 0 && (
        <Card className="overflow-hidden">
          <div className="p-lg border-b border-outline-variant">
            <h3 className="font-headline-md text-headline-md text-on-surface">My Requests</h3>
          </div>
          <div className="divide-y divide-outline-variant">
            {myLeaves.map((l) => (
              <div key={l.id} className="px-md py-sm flex justify-between items-center">
                <div>
                  <p className="text-body-sm font-bold">{getTypeLabel(l.type)}</p>
                  <p className="text-label-caps text-on-surface-variant">
                    {new Date(l.startDate).toLocaleDateString()} - {new Date(l.endDate).toLocaleDateString()}
                  </p>
                </div>
                <StatusBadge status={l.status} />
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
