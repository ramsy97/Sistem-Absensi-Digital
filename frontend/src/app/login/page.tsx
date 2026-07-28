"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { setAuth, isAuthenticated, isAdmin } from "@/lib/auth";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated()) {
      router.replace(isAdmin() ? "/admin/dashboard" : "/employee/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const payload = mode === "login"
        ? { username, password }
        : { username, password, fullName, email };
      const { data } = await api.post(endpoint, payload);
      setAuth(data.token, data.user);
      router.replace(data.user.role === "admin" ? "/admin/dashboard" : "/employee/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-md">
      <div className="w-full max-w-sm space-y-lg">
        <div className="text-center space-y-sm">
          <div className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-on-primary-container text-4xl fill-icon">
              corporate_fare
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">WorkSync Pro</h1>
          <p className="text-on-surface-variant">
            {mode === "login" ? "Sign in to your account" : "Create a new account"}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg space-y-md">
          {error && (
            <div className="bg-error-container text-on-error-container p-sm rounded-lg text-body-sm font-bold">{error}</div>
          )}
          {mode === "register" && (
            <>
              <div className="flex flex-col gap-xs">
                <label className="font-label-caps text-label-caps text-on-surface-variant">FULL NAME</label>
                <input
                  className="h-12 border outline-variant rounded-lg font-body-md bg-surface focus:border-primary focus:ring-2 focus:ring-primary-container px-md"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="flex flex-col gap-xs">
                <label className="font-label-caps text-label-caps text-on-surface-variant">EMAIL</label>
                <input
                  type="email"
                  className="h-12 border outline-variant rounded-lg font-body-md bg-surface focus:border-primary focus:ring-2 focus:ring-primary-container px-md"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  required
                />
              </div>
            </>
          )}
          <div className="flex flex-col gap-xs">
            <label className="font-label-caps text-label-caps text-on-surface-variant">USERNAME</label>
            <input
              className="h-12 border outline-variant rounded-lg font-body-md bg-surface focus:border-primary focus:ring-2 focus:ring-primary-container px-md"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>
          <div className="flex flex-col gap-xs">
            <label className="font-label-caps text-label-caps text-on-surface-variant">PASSWORD</label>
            <input
              type="password"
              className="h-12 border outline-variant rounded-lg font-body-md bg-surface focus:border-primary focus:ring-2 focus:ring-primary-container px-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Processing..." : mode === "login" ? "Sign In" : "Sign Up"}
          </Button>
          <p className="text-center text-body-sm text-on-surface-variant pt-sm">
            {mode === "login" ? (
              <>Don&apos;t have an account?{" "}<button type="button" onClick={toggleMode} className="text-primary font-bold hover:underline">Sign Up</button></>
            ) : (
              <>Already have an account?{" "}<button type="button" onClick={toggleMode} className="text-primary font-bold hover:underline">Sign In</button></>
            )}
          </p>
          {mode === "login" && (
            <p className="text-center text-body-sm text-on-surface-variant pt-sm border-t border-outline-variant">
              Demo: <strong>admin</strong> / <strong>admin123</strong> or <strong>employee1</strong> / <strong>employee123</strong>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
