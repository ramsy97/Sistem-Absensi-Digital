"use client";
import React, { useEffect, useState } from "react";

interface ChartData {
  day: string;
  count: number;
}

const dayNames: Record<string, string> = {
  MON: "Sen", TUE: "Sel", WED: "Rab", THU: "Kam", FRI: "Jum", SAT: "Sab", SUN: "Min",
};

function getBarColor(ratio: number): string {
  if (ratio >= 0.75) return "from-green-500 to-green-400";
  if (ratio >= 0.5) return "from-primary to-blue-400";
  if (ratio >= 0.25) return "from-amber-500 to-amber-400";
  return "from-red-500 to-red-400";
}

function getBarBgColor(ratio: number): string {
  if (ratio >= 0.75) return "bg-green-100";
  if (ratio >= 0.5) return "bg-blue-50";
  if (ratio >= 0.25) return "bg-amber-50";
  return "bg-red-50";
}

function generateDates(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  });
}

export default function AttendanceChart({ data }: { data: ChartData[] }) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const total = data.reduce((s, d) => s + d.count, 0);
  const avg = total / data.length;
  const avgPct = (avg / maxCount) * 100;
  const dates = generateDates();
  const [anim, setAnim] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnim(true), 100);
    return () => clearTimeout(t);
  }, []);

  const yLabels = [0, Math.round(maxCount * 0.25), Math.round(maxCount * 0.5), Math.round(maxCount * 0.75), maxCount];

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
      <div className="p-lg border-b border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-sm">
        <div className="flex items-center gap-md">
          <div className="p-sm bg-primary-container rounded-lg">
            <span className="material-symbols-outlined text-on-primary-container">bar_chart</span>
          </div>
          <div>
            <h3 className="font-headline-md text-on-surface">Tren Kehadiran</h3>
            <p className="text-body-sm text-on-surface-variant">7 hari terakhir</p>
          </div>
        </div>
        <div className="flex items-center gap-lg">
          <div className="text-center">
            <p className="text-[11px] text-on-surface-variant font-label-caps uppercase">Total</p>
            <p className="text-[22px] font-extrabold text-primary font-data-mono leading-none">{total}</p>
          </div>
          <div className="text-center">
            <p className="text-[11px] text-on-surface-variant font-label-caps uppercase">Rata-rata</p>
            <p className="text-[22px] font-extrabold text-on-surface font-data-mono leading-none">{avg.toFixed(1)}</p>
          </div>
          <div className="text-center">
            <p className="text-[11px] text-on-surface-variant font-label-caps uppercase">Tertinggi</p>
            <p className="text-[22px] font-extrabold text-green-600 font-data-mono leading-none">{maxCount}</p>
          </div>
        </div>
      </div>
      <div className="p-lg">
        <div className="relative" style={{ height: "280px" }}>
          <div className="absolute inset-0 flex">
            <div className="flex flex-col justify-between pt-2 pr-2 pb-8">
              {yLabels.slice().reverse().map((v, i) => (
                <span key={i} className="text-[10px] text-on-surface-variant font-data-mono text-right leading-none" style={{ marginBottom: i === 0 ? 0 : undefined }}>
                  {v}
                </span>
              ))}
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {yLabels.map((_, i) => (
                  <div key={i} className="w-full border-t border-dashed border-outline-variant/30" />
                ))}
              </div>
              <div className="absolute inset-0 flex items-end justify-around pb-8" style={{ gap: "2px" }}>
                {data.map((item, i) => {
                  const ratio = maxCount > 0 ? item.count / maxCount : 0;
                  const barHeight = anim ? `${Math.max(ratio * 100, 2)}%` : "0%";
                  return (
                    <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group relative">
                      <span className="text-[11px] font-bold text-on-surface font-data-mono mb-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-surface-container-lowest px-1 rounded">
                        {item.count}
                      </span>
                      <div
                        className={`w-full mx-0.5 rounded-t-md relative transition-all duration-1000 ease-out cursor-pointer ${getBarBgColor(ratio)}`}
                        style={{ height: barHeight, maxWidth: "48px" }}
                      >
                        <div
                          className={`absolute bottom-0 inset-x-0 rounded-t-md bg-gradient-to-t ${getBarColor(ratio)} transition-all duration-700 group-hover:brightness-110`}
                          style={{ height: "100%" }}
                        />
                      </div>
                      <div className="mt-1.5 text-center">
                        <span className="text-[9px] font-bold text-on-surface-variant block leading-tight">{dayNames[item.day] || item.day}</span>
                        <span className="text-[8px] text-on-surface-variant/60 block leading-tight">{dates[i]}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              {avg > 0 && (
                <div
                  className="absolute left-0 right-0 border-t-2 border-dashed border-amber-500/60 z-10 pointer-events-none"
                  style={{ bottom: `calc(${(avg / maxCount) * 100}% + 32px)` }}
                >
                  <span className="absolute -top-4 right-1 text-[9px] font-bold text-amber-600 font-data-mono bg-amber-50 px-1 rounded">
                    Rata-rata {avg.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        {total === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-container-lowest/80">
            <div className="text-center">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant">insights</span>
              <p className="text-on-surface-variant mt-sm">Belum ada data absensi minggu ini</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
