"use client";
import React, { useEffect, useState, useRef } from "react";
import api from "@/lib/api";
import { Attendance } from "@/types";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import Button from "@/components/ui/Button";

function exportToXLS(data: Attendance[]) {
  const today = new Date().toISOString().slice(0, 10);
  const rows = data.map(
    (a) =>
      `<tr>
        <td style="border:1px solid #ccc;padding:8px">${a.user?.fullName || "Unknown"}</td>
        <td style="border:1px solid #ccc;padding:8px">${a.checkInTime ? new Date(a.checkInTime).toLocaleString("id-ID") : "—"}</td>
        <td style="border:1px solid #ccc;padding:8px">${a.checkOutTime ? new Date(a.checkOutTime).toLocaleString("id-ID") : "—"}</td>
        <td style="border:1px solid #ccc;padding:8px">${a.status === "on_time" ? "On Time" : a.status === "late" ? "Terlambat" : "Tidak Hadir"}</td>
      </tr>`
  ).join("");

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Laporan Absensi</title></head>
<body>
  <h2 style="color:#00288e;margin-bottom:4px">WorkSync Pro</h2>
  <p style="color:#666;margin-top:0">Laporan Absensi - ${new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
  <hr style="border:1px solid #00288e">
  <table style="border-collapse:collapse;width:100%;margin-top:16px">
    <thead>
      <tr style="background:#00288e;color:white">
        <th style="border:1px solid #ccc;padding:10px;text-align:left">Karyawan</th>
        <th style="border:1px solid #ccc;padding:10px;text-align:left">Check In</th>
        <th style="border:1px solid #ccc;padding:10px;text-align:left">Check Out</th>
        <th style="border:1px solid #ccc;padding:10px;text-align:left">Status</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <p style="color:#999;margin-top:24px;font-size:11px">Dicetak: ${new Date().toLocaleString("id-ID")} | WorkSync Pro - Sistem Absensi Digital</p>
</body>
</html>`;

  const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `laporan_absensi_${today}.xls`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportToPDF(items: Attendance[]) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) { alert("Please allow pop-ups for PDF export"); return; }

  printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Laporan Absensi</title>
  <style>
    @page { margin: 20mm 15mm; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #333; padding: 0; margin: 0; }
    .header { text-align: center; margin-bottom: 24px; border-bottom: 3px solid #00288e; padding-bottom: 16px; }
    .header h1 { color: #00288e; margin: 0; font-size: 24px; }
    .header p { color: #666; margin: 4px 0 0; font-size: 13px; }
    .meta { margin-bottom: 16px; font-size: 13px; color: #555; }
    .meta span { display: inline-block; margin-right: 24px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th { background: #00288e; color: white; padding: 10px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
    td { border: 1px solid #ddd; padding: 10px; }
    tr:nth-child(even) { background: #f8f9ff; }
    .footer { margin-top: 32px; padding-top: 12px; border-top: 1px solid #ccc; font-size: 11px; color: #999; text-align: center; }
    .status-on-time { color: #065f46; font-weight: bold; }
    .status-late { color: #991b1b; font-weight: bold; }
    .status-absent { color: #666; font-weight: bold; }
  </style>
</head>
<body>
  <div class="header">
    <h1>WorkSync Pro</h1>
    <p>Sistem Absensi Digital - Laporan Kehadiran</p>
  </div>
  <div class="meta">
    <span><strong>Periode:</strong> ${new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
    <span><strong>Jumlah Karyawan:</strong> ${items.length}</span>
    <span><strong>Dicetak:</strong> ${new Date().toLocaleString("id-ID")}</span>
  </div>
  <table>
    <thead>
      <tr>
        <th>No</th>
        <th>Karyawan</th>
        <th>Check In</th>
        <th>Check Out</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${items.map((a, i) => `
        <tr>
          <td style="text-align:center">${i + 1}</td>
          <td><strong>${a.user?.fullName || "Unknown"}</strong><br><span style="font-size:11px;color:#888">${a.user?.email || ""}</span></td>
          <td>${a.checkInTime ? new Date(a.checkInTime).toLocaleString("id-ID") : "—"}</td>
          <td>${a.checkOutTime ? new Date(a.checkOutTime).toLocaleString("id-ID") : "—"}</td>
          <td class="${a.status === "on_time" ? "status-on-time" : a.status === "late" ? "status-late" : "status-absent"}">${a.status === "on_time" ? "On Time" : a.status === "late" ? "Terlambat" : "Tidak Hadir"}</td>
        </tr>`).join("")}
    </tbody>
  </table>
  <div class="footer">
    WorkSync Pro &copy; ${new Date().getFullYear()} &mdash; Dokumen ini digenerate secara otomatis
  </div>
  <script>window.print();window.close();<\/script>
</body>
</html>
  `);
  printWindow.document.close();
}

export default function AdminReportsPage() {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtered, setFiltered] = useState<Attendance[]>([]);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    api.get("/admin/reports").then(({ data }) => {
      setAttendances(data);
      setFiltered(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!statusFilter) setFiltered(attendances);
    else setFiltered(attendances.filter((a) => a.status === statusFilter));
  }, [statusFilter, attendances]);

  return (
    <div className="p-md lg:p-xl max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-lg gap-md">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Laporan Absensi</h1>
          <p className="text-on-surface-variant">Rekapitulasi kehadiran seluruh karyawan</p>
        </div>
        <div className="flex gap-sm">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 border outline-variant rounded-lg font-body-sm bg-surface focus:border-primary px-md"
          >
            <option value="">Semua Status</option>
            <option value="on_time">On Time</option>
            <option value="late">Terlambat</option>
            <option value="absent">Tidak Hadir</option>
          </select>
          <Button variant="secondary" size="sm" icon="picture_as_pdf" onClick={() => exportToPDF(filtered)}>PDF</Button>
          <Button variant="primary" size="sm" icon="table_view" onClick={() => exportToXLS(filtered)}>EXPORT EXCEL</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-md mb-lg">
        <Card className="p-md text-center">
          <p className="text-label-caps text-on-surface-variant uppercase tracking-widest">Total</p>
          <p className="text-[32px] font-extrabold text-on-surface font-data-mono">{attendances.length}</p>
        </Card>
        <Card className="p-md text-center">
          <p className="text-label-caps text-on-surface-variant uppercase tracking-widest">On Time</p>
          <p className="text-[32px] font-extrabold text-green-700 font-data-mono">
            {attendances.filter((a) => a.status === "on_time").length}
          </p>
        </Card>
        <Card className="p-md text-center">
          <p className="text-label-caps text-on-surface-variant uppercase tracking-widest">Terlambat</p>
          <p className="text-[32px] font-extrabold text-red-700 font-data-mono">
            {attendances.filter((a) => a.status === "late").length}
          </p>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary text-on-primary">
                <th className="px-lg py-md text-label-caps uppercase tracking-wider">No</th>
                <th className="px-lg py-md text-label-caps uppercase tracking-wider">Karyawan</th>
                <th className="px-lg py-md text-label-caps uppercase tracking-wider">Check In</th>
                <th className="px-lg py-md text-label-caps uppercase tracking-wider">Check Out</th>
                <th className="px-lg py-md text-label-caps uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {loading ? (
                <tr><td colSpan={5} className="px-lg py-md text-center text-on-surface-variant">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-lg py-md text-center text-on-surface-variant">Tidak ada data</td></tr>
              ) : (
                filtered.map((a, i) => (
                  <tr key={a.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-lg py-md font-data-mono text-body-sm text-center">{i + 1}</td>
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-md">
                        <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
                          {a.user?.fullName?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p className="font-bold text-on-surface">{a.user?.fullName}</p>
                          <p className="text-body-sm text-on-surface-variant">{a.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-lg py-md font-data-mono text-body-sm">
                      {a.checkInTime ? new Date(a.checkInTime).toLocaleString("id-ID") : "—"}
                    </td>
                    <td className="px-lg py-md font-data-mono text-body-sm">
                      {a.checkOutTime ? new Date(a.checkOutTime).toLocaleString("id-ID") : "—"}
                    </td>
                    <td className="px-lg py-md"><StatusBadge status={a.status} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
