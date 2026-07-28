"use client";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  icon?: string;
  iconFill?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  icon,
  iconFill,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-md font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants: Record<string, string> = {
    primary: "bg-primary text-on-primary hover:shadow-lg rounded-lg",
    secondary: "border border-outline-variant text-on-surface-variant hover:bg-surface-container rounded-lg",
    ghost: "text-on-surface-variant hover:bg-surface-container-low rounded-lg",
    danger: "bg-error text-on-error hover:shadow-lg rounded-lg",
  };
  const sizes: Record<string, string> = {
    sm: "px-md py-1.5 text-body-sm",
    md: "px-md py-md text-body-md",
    lg: "px-lg py-md text-body-lg",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {icon && (
        <span className={`material-symbols-outlined ${iconFill ? "fill-icon" : ""}`}>{icon}</span>
      )}
      {children}
    </button>
  );
}
