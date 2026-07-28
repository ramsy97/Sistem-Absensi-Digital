import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WorkSync Pro - Sistem Absensi Digital",
  description: "Enterprise attendance management system",
  icons: "/favicon.svg",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,0..1&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
