import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-xs">
      {label && (
        <label className="font-label-caps text-label-caps text-on-surface-variant">{label}</label>
      )}
      <input
        className={`h-12 border outline-variant rounded-lg font-body-md bg-surface focus:border-primary focus:ring-2 focus:ring-primary-container px-md ${error ? "border-error" : ""} ${className}`}
        {...props}
      />
      {error && <span className="text-error text-body-sm">{error}</span>}
    </div>
  );
}
