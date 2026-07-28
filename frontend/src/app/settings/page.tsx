"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getUser, setAuth } from "@/lib/auth";
import api from "@/lib/api";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";
import { User } from "@/types";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const [username, setUsername] = useState("");
  const [usernameMsg, setUsernameMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [usernameLoading, setUsernameLoading] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passMsg, setPassMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [passLoading, setPassLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    const u = getUser();
    setUser(u);
    setUsername(u?.username || "");
  }, [router]);

  const handleUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsernameMsg(null);
    if (username === user?.username) {
      setUsernameMsg({ ok: false, text: "Username sama dengan sebelumnya" });
      return;
    }
    if (!username.trim()) {
      setUsernameMsg({ ok: false, text: "Username tidak boleh kosong" });
      return;
    }
    setUsernameLoading(true);
    try {
      const { data } = await api.put("/auth/profile", { username });
      const updatedUser = data.user as User;
      setUser(updatedUser);
      const token = localStorage.getItem("token") || "";
      setAuth(token, updatedUser);
      setUsernameMsg({ ok: true, text: "Username berhasil diubah" });
    } catch (err: any) {
      setUsernameMsg({ ok: false, text: err.response?.data?.error || "Gagal mengubah username" });
    } finally {
      setUsernameLoading(false);
    }
  };

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg(null);
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPassMsg({ ok: false, text: "Semua field harus diisi" });
      return;
    }
    if (newPassword.length < 6) {
      setPassMsg({ ok: false, text: "Password baru minimal 6 karakter" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassMsg({ ok: false, text: "Konfirmasi password tidak cocok" });
      return;
    }
    setPassLoading(true);
    try {
      await api.put("/auth/password", { oldPassword, newPassword });
      setPassMsg({ ok: true, text: "Password berhasil diubah" });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPassMsg({ ok: false, text: err.response?.data?.error || "Gagal mengubah password" });
    } finally {
      setPassLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar />
      <main className="lg:ml-64 pt-12 pb-20 lg:pb-md min-h-screen">
        <div className="px-md lg:px-xl pt-md pb-xl max-w-2xl mx-auto">
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-lg">Pengaturan</h1>

          <Card className="p-lg mb-lg">
            <div className="flex items-center gap-md mb-lg">
              <div className="w-14 h-14 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-2xl overflow-hidden border-2 border-primary">
                {user.fullName?.charAt(0) || "U"}
              </div>
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface">{user.fullName}</h2>
                <p className="text-on-surface-variant text-body-sm">@{user.username} &middot; {user.email}</p>
              </div>
            </div>
          </Card>

          <Card className="p-lg mb-lg">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-md">Ubah Username</h3>
            <form onSubmit={handleUsername} className="flex flex-col gap-md">
              <label className="flex flex-col gap-xs">
                <span className="font-label-caps text-label-caps text-on-surface-variant">Username</span>
                <input
                  className="h-12 border border-outline-variant rounded-lg font-body-md bg-surface focus:border-primary focus:ring-2 focus:ring-primary-container px-md"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </label>
              {usernameMsg && (
                <p className={`text-body-sm ${usernameMsg.ok ? "text-green-700" : "text-error"}`}>{usernameMsg.text}</p>
              )}
              <Button type="submit" disabled={usernameLoading} icon="save">
                {usernameLoading ? "Menyimpan..." : "Simpan Username"}
              </Button>
            </form>
          </Card>

          <Card className="p-lg">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-md">Ubah Password</h3>
            <form onSubmit={handlePassword} className="flex flex-col gap-md">
              <label className="flex flex-col gap-xs">
                <span className="font-label-caps text-label-caps text-on-surface-variant">Password Lama</span>
                <input
                  type="password"
                  className="h-12 border border-outline-variant rounded-lg font-body-md bg-surface focus:border-primary focus:ring-2 focus:ring-primary-container px-md"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </label>
              <label className="flex flex-col gap-xs">
                <span className="font-label-caps text-label-caps text-on-surface-variant">Password Baru</span>
                <input
                  type="password"
                  className="h-12 border border-outline-variant rounded-lg font-body-md bg-surface focus:border-primary focus:ring-2 focus:ring-primary-container px-md"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </label>
              <label className="flex flex-col gap-xs">
                <span className="font-label-caps text-label-caps text-on-surface-variant">Konfirmasi Password Baru</span>
                <input
                  type="password"
                  className="h-12 border border-outline-variant rounded-lg font-body-md bg-surface focus:border-primary focus:ring-2 focus:ring-primary-container px-md"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </label>
              {passMsg && (
                <p className={`text-body-sm ${passMsg.ok ? "text-green-700" : "text-error"}`}>{passMsg.text}</p>
              )}
              <Button type="submit" disabled={passLoading} icon="lock">
                {passLoading ? "Menyimpan..." : "Ubah Password"}
              </Button>
            </form>
          </Card>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
