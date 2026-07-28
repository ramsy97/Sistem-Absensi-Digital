import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({ children, className = "", onClick }: CardProps) {
  return (
    <div
      className={`bg-surface-container-lowest border border-outline-variant rounded-xl ${onClick ? "cursor-pointer hover:bg-surface-container-low transition-colors" : ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
