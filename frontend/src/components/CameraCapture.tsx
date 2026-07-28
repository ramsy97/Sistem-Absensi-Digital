"use client";
import React, { useRef, useState, useCallback } from "react";

interface CameraCaptureProps {
  onCapture: (file: File) => void;
}

export default function CameraCapture({ onCapture }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streaming, setStreaming] = useState(false);
  const [captured, setCaptured] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;
      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
      }
      setStreaming(true);
    } catch (err: any) {
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        alert("Camera access denied. Please allow camera access in your browser settings.");
      } else if (err.name === "NotFoundError") {
        alert("No camera found on this device.");
      } else {
        alert("Camera error: " + err.message);
      }
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg");
    setCaptured(dataUrl);
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `selfie_${Date.now()}.jpg`, { type: "image/jpeg" });
        onCapture(file);
      }
    }, "image/jpeg");
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setStreaming(false);
  }, [onCapture]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setStreaming(false);
  }, []);

  const retake = useCallback(() => {
    setCaptured(null);
    startCamera();
  }, [startCamera]);

  React.useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const containerClass = "relative w-full min-h-[400px] bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant";

  if (captured) {
    return (
      <div className={containerClass}>
        <img src={captured} alt="Captured" className="w-full h-full absolute inset-0 object-cover" />
        <div className="absolute bottom-4 left-4 right-4 flex gap-md z-10">
          <button
            onClick={retake}
            className="flex-1 py-3 border border-outline-variant rounded-lg font-bold text-on-surface-variant bg-white/90 backdrop-blur-sm"
          >
            Retake
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <video
        ref={videoRef}
        className={`w-full h-full absolute inset-0 object-cover ${streaming ? "z-10" : "z-0"}`}
        playsInline
        muted
        autoPlay
      />
      {!streaming && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-md z-20">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant">camera_alt</span>
          <button
            onClick={startCamera}
            className="bg-primary text-on-primary px-lg py-md rounded-lg font-bold"
          >
            Open Camera
          </button>
        </div>
      )}
      {streaming && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="absolute inset-4 border-4 border-dashed border-white/40 rounded-xl" />
        </div>
      )}
      {streaming && (
        <div className="absolute bottom-4 left-4 right-4 flex justify-center z-30">
          <button
            onClick={capturePhoto}
            className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center active:scale-95 transition-transform bg-white/30 hover:bg-white/50"
          >
            <div className="w-12 h-12 rounded-full bg-white" />
          </button>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
