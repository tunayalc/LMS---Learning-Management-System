"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { createApiClient, resolveApiBaseUrl } from "@lms/shared";
import ImageCropper from "./ImageCropper";

type OmrResponse = {
  success?: boolean;
  service_used?: string;
  score?: number;
  answers?: Record<string, string>;
  details?: unknown;
  debug?: {
    debugImage?: string;
  };
};

type OmrPanelProps = {
  token: string | null;
};

const formatJson = (value: unknown) => {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value ?? "");
  }
};

const useObjectUrl = (file: File | null) => {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!file) {
      setUrl(null);
      return;
    }
    const nextUrl = URL.createObjectURL(file);
    setUrl(nextUrl);
    return () => URL.revokeObjectURL(nextUrl);
  }, [file]);
  return url;
};

export default function OmrPanel({ token }: OmrPanelProps) {
  const { t } = useTranslation();
  const apiBaseUrl = useMemo(() => resolveApiBaseUrl({ runtime: "web" }), []);
  const omrApiClient = useMemo(
    () => createApiClient({ baseUrl: apiBaseUrl, timeoutMs: 20000 }),
    [apiBaseUrl]
  );

  const [file, setFile] = useState<File | null>(null);
  const previewUrl = useObjectUrl(file);
  const [answerKey, setAnswerKey] = useState("");
  const [result, setResult] = useState<OmrResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const omrPath = "/api/omr/scan";

  // Calibration settings
  const [showSettings, setShowSettings] = useState(false);
  const [threshold, setThreshold] = useState(0.35);
  const [xOffset, setXOffset] = useState(0);
  const [yOffset, setYOffset] = useState(0);
  const [smartAlign, setSmartAlign] = useState(false);
  const [skipWarp, setSkipWarp] = useState(true);  // NEW: Skip perspective warp (default ON for cropped images)

  // Crop mode
  const [cropMode, setCropMode] = useState(false);

  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraActive(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  // Effect to bind stream to video element AFTER it mounts
  useEffect(() => {
    if (cameraActive && videoRef.current && streamRef.current) {
      console.log("[OMR] Binding stream to video element");
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(err => {
        console.error("[OMR] Video play failed:", err);
      });
    }
  }, [cameraActive]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null;
    setFile(nextFile);
    setResult(null);
    setError(null);
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    const croppedFile = new File([croppedBlob], "cropped_omr.jpg", { type: "image/jpeg" });
    setFile(croppedFile);
    setCropMode(false);
  };

  const startCamera = async () => {
    setError(null);
    try {
      // Camera API requires HTTPS or localhost
      if (typeof window !== 'undefined' && window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
        setError(t("camera_https_error"));
        return;
      }
      if (!navigator.mediaDevices?.getUserMedia) {
        setError(t("camera_support_error") || "Browser not supported");
        return;
      }
      console.log("[OMR] Requesting camera access...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      console.log("[OMR] Camera access granted, setting state...");
      streamRef.current = stream;
      // Set state FIRST - this will trigger re-render with video element
      // Then the useEffect above will bind the stream
      setCameraActive(true);
    } catch (err: any) {
      console.error("[OMR] Camera error:", err);
      if (err.name === 'NotAllowedError') {
        setError(t("camera_permission_error"));
      } else if (err.name === 'NotFoundError') {
        setError(t("camera_not_found") || "Camera not found");
      } else if (err.name === 'NotReadableError') {
        setError(t("camera_in_use") || "Camera in use");
      } else {
        setError(`${t("camera_error") || "Error"}: ${err.message || err.name}`);
      }
    }
  };

  const captureFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) {
      setError(t("camera_error_video_canvas"));
      return;
    }

    // Log video state for debugging
    console.log("[OMR] Video state:", {
      readyState: video.readyState,
      videoWidth: video.videoWidth,
      videoHeight: video.videoHeight
    });

    console.log("[OMR] Capturing frame:", video.videoWidth, "x", video.videoHeight);
    // Use fallback dimensions if video reports 0
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setError(t("camera_error_canvas_context"));
      return;
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setError(t("capture_error"));
          return;
        }
        const captured = new File([blob], "omr-capture.jpg", { type: blob.type });
        setFile(captured);
        setResult(null);
        stopCamera();
      },
      "image/jpeg",
      0.95
    );
  };

  const handleScan = async () => {
    if (!token) {
      setError(t("error"));
      return;
    }
    if (!file) {
      setError(t("omr_desc"));
      return;
    }
    setProcessing(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", file);
      if (answerKey.trim()) {
        formData.append("answerKey", answerKey.trim());
      }
      // Add calibration parameters
      formData.append("threshold", threshold.toString());
      formData.append("xOffset", xOffset.toString());
      formData.append("yOffset", yOffset.toString());
      formData.append("smartAlign", smartAlign.toString());
      formData.append("skipWarp", skipWarp.toString());

      const response = await omrApiClient.post<OmrResponse>(omrPath, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("scan_error"));
    } finally {
      setProcessing(false);
    }
  };

  // Ref for file input to clear it programmatically
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearSelection = () => {
    setFile(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="card" style={{ overflow: 'hidden', maxWidth: '100%' }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>{t("omr_title")}</h2>
        <span className="badge" style={{ background: "#e2e8f0", color: "#0f172a" }}>
          OMR
        </span>
      </div>
      <p className="meta">{t("omr_desc")}</p>

      <div className="form">
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "12px" }}>
          {/* File Upload Button */}
          <label className="btn btn-secondary" style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px", width: "auto" }}>
            <span>{t("upload_file")}</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </label>

          <button className="btn" type="button" onClick={startCamera} disabled={cameraActive} style={{ width: "auto" }}>
            {t("open_camera")}
          </button>
          <button className="btn btn-secondary" type="button" onClick={captureFrame} disabled={!cameraActive} style={{ width: "auto" }}>
            {t("take_photo")}
          </button>

          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => setCropMode(true)}
            disabled={!file || cameraActive}
            style={{ width: "auto" }}
          >
            {t("crop")}
          </button>

          <button className="btn btn-ghost" type="button" onClick={clearSelection} style={{ width: "auto" }}>
            {t("clear")}
          </button>
          <button className="btn btn-ghost" type="button" onClick={() => setShowSettings(!showSettings)} style={{ width: "auto" }}>
            {t("settings")}
          </button>
        </div>

        {/* Crop Mode UI */}
        {cropMode && previewUrl && (
          <div style={{ marginBottom: "16px" }}>
            <ImageCropper
              imageSrc={previewUrl}
              onCropComplete={handleCropComplete}
              onCancel={() => setCropMode(false)}
            />
          </div>
        )}

        {/* Calibration Settings Panel */}
        {showSettings && (
          <div style={{ background: "#1a1a2e", padding: "16px", borderRadius: "8px", marginBottom: "16px" }}>
            <h4 style={{ margin: "0 0 12px 0", color: "#fff" }}>{t("calibration_settings")}</h4>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", color: "#fff" }}>
                {t("threshold")}:
              </label>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input
                  type="range"
                  min="0.20"
                  max="0.60"
                  step="0.01"
                  value={threshold}
                  onChange={(e) => setThreshold(parseFloat(e.target.value))}
                  style={{ flex: 1 }}
                />
                <input
                  type="number"
                  step="0.01"
                  value={threshold}
                  onChange={(e) => setThreshold(parseFloat(e.target.value))}
                  style={{ width: "80px", padding: "4px" }}
                />
              </div>
              <small style={{ color: "#888" }}>{t("omr_threshold_desc") || "Low = Sensitive, High = Stringent"}</small>
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", color: "#fff" }}>
                X Offset:
              </label>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input
                  type="range"
                  min="-0.05"
                  max="0.05"
                  step="0.001"
                  value={xOffset}
                  onChange={(e) => setXOffset(parseFloat(e.target.value))}
                  style={{ flex: 1 }}
                />
                <input
                  type="number"
                  step="0.001"
                  value={xOffset}
                  onChange={(e) => setXOffset(parseFloat(e.target.value))}
                  style={{ width: "80px", padding: "4px" }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "8px" }}>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", color: "#fff" }}>
                Y Offset:
              </label>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input
                  type="range"
                  min="-0.05"
                  max="0.05"
                  step="0.001"
                  value={yOffset}
                  onChange={(e) => setYOffset(parseFloat(e.target.value))}
                  style={{ flex: 1 }}
                />
                <input
                  type="number"
                  step="0.001"
                  value={yOffset}
                  onChange={(e) => setYOffset(parseFloat(e.target.value))}
                  style={{ width: "80px", padding: "4px" }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#fff", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={smartAlign}
                  onChange={(e) => setSmartAlign(e.target.checked)}
                />
                {t("omr_smart_align")}
              </label>
              <small style={{ color: "#888" }}>{t("omr_smart_align_desc")}</small>
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#fff", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={skipWarp}
                  onChange={(e) => setSkipWarp(e.target.checked)}
                />
                {t("omr_skip_warp")}
              </label>
              <small style={{ color: "#888" }}>{t("omr_skip_warp_desc")}</small>
            </div>

            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => { setThreshold(0.35); setXOffset(0); setYOffset(0); setSmartAlign(false); setSkipWarp(true); }}
              style={{ marginTop: "8px", width: "auto" }}
            >
              {t("default_settings")}
            </button>
          </div>
        )}

        {cameraActive ? (
          <div style={{ marginTop: 12 }}>
            <video ref={videoRef} style={{ width: "100%", borderRadius: 12 }} muted autoPlay playsInline />
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </div>
        ) : null}

        {previewUrl ? (
          <div style={{ marginTop: 12 }}>
            <h4 style={{ margin: '0 0 8px 0' }}>{t("preview")}:</h4>
            <img
              src={previewUrl}
              alt="OMR preview"
              style={{ width: "100%", maxHeight: "400px", objectFit: "contain", borderRadius: 12, border: "1px solid #e2e8f0", background: "#f1f5f9" }}
            />
          </div>
        ) : null}

        <textarea
          className="input"
          rows={4}
          placeholder='(Opsiyonel) Answer key JSON: {"1":"A","2":"B"}'
          value={answerKey}
          onChange={(event) => setAnswerKey(event.target.value)}
        />

        <button className="btn" type="button" onClick={handleScan} disabled={processing}>
          {processing ? t("scanning") : t("scan_start")}
        </button>
      </div>

      {error ? <div className="error">{error}</div> : null}
      {result ? (
        <div style={{ marginTop: 12, maxHeight: '600px', overflow: 'auto' }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "8px" }}>
            <div className="meta">{t("scan_result")}</div>
            <span
              className="badge"
              style={{
                background: result.service_used === "python" ? "#22c55e" : "#f59e0b",
                color: "#fff",
                fontSize: "12px",
              }}
            >
              {result.service_used === "python" ? "✅ Python" : "⚠️ Node.js (Fallback)"}
            </span>
          </div>
          <pre
            style={{
              background: "#0f172a",
              color: "#e2e8f0",
              padding: "12px",
              borderRadius: 12,
              overflow: "auto",
              maxHeight: "200px",
              maxWidth: "100%",
              fontSize: "0.85rem",
              wordBreak: "break-word",
              whiteSpace: "pre-wrap",
            }}
          >
            {formatJson(result)}
          </pre>

          {result.debug?.debugImage && (
            <div style={{ marginTop: "20px", borderTop: "1px solid #444", paddingTop: "10px" }}>
              <h4 style={{ color: "#ff4444" }}>{t("omr_debug_title")}</h4>
              <p style={{ fontSize: "12px", color: "#ccc" }}>
                {t("omr_debug_desc")}
              </p>
              <div style={{ overflow: "hidden", border: "2px solid #ff4444", maxHeight: "350px", maxWidth: "100%" }}>
                <img
                  src={`data:image/jpeg;base64,${result.debug.debugImage}`}
                  alt="Debug Grid"
                  style={{ width: "100%", maxHeight: "340px", objectFit: "contain", display: "block" }}
                />
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
