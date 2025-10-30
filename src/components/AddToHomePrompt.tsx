"use client";

import React from "react";
import { usePathname } from "next/navigation";

function isIosSafari(): boolean {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent || "";
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  // Exclude other browsers in-app; check for Safari (not Chrome/Firefox on iOS)
  const isSafari = /Safari/i.test(ua) && !/CriOS|FxiOS|OPiOS|EdgiOS/i.test(ua);
  return isIOS && isSafari;
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  // iOS Safari exposes navigator.standalone, others use matchMedia
  // @ts-expect-error - property exists on iOS Safari
  const iosStandalone = typeof window.navigator.standalone !== "undefined" && window.navigator.standalone;
  const pwaDisplay = window.matchMedia && window.matchMedia("(display-mode: standalone)").matches;
  return Boolean(iosStandalone || pwaDisplay);
}

const STORAGE_KEY = "talentix-add-to-home-dismissed";

export default function AddToHomePrompt(): JSX.Element | null {
  const pathname = usePathname();
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    if (pathname !== "/") return; // homepage only
    if (!isIosSafari()) return; // iPhone/iPad Safari only
    if (isStandalone()) return; // already installed
    try {
      const dismissed = window.localStorage.getItem(STORAGE_KEY);
      if (dismissed === "1") return;
    } catch {}

    const timer = window.setTimeout(() => {
      setShow(true);
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  const dismiss = React.useCallback(() => {
    setShow(false);
    try { window.localStorage.setItem(STORAGE_KEY, "1"); } catch {}
  }, []);

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Add Talentix to Home Screen"
      onClick={dismiss}
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999998,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "auto",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          margin: "12px",
          borderRadius: "16px",
          background: "linear-gradient(135deg, #fffbea 0%, #ffffff 60%)",
          boxShadow: "0 8px 28px rgba(0,0,0,0.12), 0 0 0 2px rgba(251, 191, 36, 0.45)",
          maxWidth: 560,
          width: "calc(100% - 24px)",
          color: "#111827",
          padding: "14px 14px 12px 14px",
          border: "1px solid rgba(251, 191, 36, 0.45)",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div
            aria-hidden
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "#fde047",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 0 rgba(0,0,0,0.06) inset",
              flex: "0 0 36px",
            }}
          >
            <span style={{ fontSize: 18 }}>📲</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>Add Talentix to your Home Screen</div>
            <div style={{ fontSize: 12, marginTop: 6, color: "#374151" }}>
              Make Talentix feel like an app — full screen, faster, and always at your fingertips.
            </div>
            <ol style={{ paddingLeft: 18, marginTop: 8, marginBottom: 8, color: "#111827", fontSize: 12 }}>
              <li>Tap the Share icon</li>
              <li>Select "Add to Home Screen"</li>
              <li>Tap Add</li>
            </ol>
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <button
                onClick={dismiss}
                style={{
                  appearance: "none",
                  border: "0",
                  background: "#111827",
                  color: "#fff",
                  padding: "8px 12px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Got it
              </button>
              <button
                onClick={dismiss}
                style={{
                  appearance: "none",
                  border: "0",
                  background: "transparent",
                  color: "#6b7280",
                  padding: "8px 10px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 600,
                }}
                aria-label="Dismiss add to home prompt"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


