"use client";
import React, { useEffect } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function Modal({ open, onClose, children, title }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-lg">
      <div className="absolute inset-0 bg-on-background/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-lowest p-xl rounded-xl shadow-2xl max-w-sm w-full text-center space-y-md animate-in fade-in zoom-in duration-300">
        {title && <h4 className="font-headline-md text-headline-md">{title}</h4>}
        {children}
      </div>
    </div>
  );
}
