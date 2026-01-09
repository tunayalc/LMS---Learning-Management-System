"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createApiClient, resolveApiBaseUrl } from "@lms/shared";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");
  const email = searchParams?.get("email");
  const [apiBaseUrl, setApiBaseUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("Email dogrulamasi baslatiliyor...");

  useEffect(() => {
    try {
      setApiBaseUrl(resolveApiBaseUrl({ runtime: "web" }));
    } catch (err) {
      setStatus("error");
      setMessage("API base URL resolve edilemedi.");
    }
  }, []);

  const apiClient = useMemo(() => {
    if (!apiBaseUrl) return null;
    return createApiClient({ baseUrl: apiBaseUrl });
  }, [apiBaseUrl]);

  useEffect(() => {
    const run = async () => {
      if (!token || !email) {
        setStatus("error");
        setMessage("Eksik token veya email.");
        return;
      }
      if (!apiClient) return;

      try {
        await apiClient.post("/auth/verify-email", { token, email });
        setStatus("success");
        setMessage("Email dogrulandi. Simdi giris yapabilirsin.");
      } catch (err: any) {
        const data = err?.response?.data;
        setStatus("error");
        setMessage(data?.message || "Email dogrulama basarisiz.");
      }
    };

    void run();
  }, [token, email, apiClient]);

  return (
    <main className="shell" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70vh" }}>
      <div className="card" style={{ maxWidth: 520, width: "100%" }}>
        <h1>Email Dogrulama</h1>
        <p className={status === "error" ? "error" : status === "success" ? "success" : "meta"}>{message}</p>
        <div style={{ marginTop: "16px" }}>
          <Link href="/" style={{ color: "var(--accent)", fontWeight: 600 }}>
            Giris ekranina don
          </Link>
        </div>
      </div>
    </main>
  );
}
