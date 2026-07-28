"use client";
import React, { useState, useEffect } from "react";

export default function LiveClock({ size = "display-lg" }: { size?: string }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={`font-data-mono text-${size} text-primary clock-shadow tracking-tighter`}>
      {time}
    </div>
  );
}
