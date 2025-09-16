
"use client";

import { useEffect, useState } from "react";

// Custom event typing for beforeinstallprompt
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBrowserPrompt, setShowBrowserPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    const ua = window.navigator.userAgent.toLowerCase();
    const iOS = /iphone|ipad|ipod/.test(ua);
    const isInStandalone =
      ("standalone" in window.navigator &&
        (window.navigator as unknown as { standalone?: boolean }).standalone) ||
      window.matchMedia("(display-mode: standalone)").matches;

    setIsIos(iOS);
    if (iOS && !isInStandalone) {
      setShowIosGuide(true);
    }

    const handler = (e: Event) => {
      const event = e as BeforeInstallPromptEvent;
      event.preventDefault();
      setDeferredPrompt(event);
      setShowBrowserPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleBrowserInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") console.log("PWA installed");
    setDeferredPrompt(null);
    setShowBrowserPrompt(false);
  };

  if (showBrowserPrompt) {
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-base-200 shadow-lg rounded-lg p-4 flex items-center gap-3">
        <span className="text-sm">Install Tailor App?</span>
        <button className="btn btn-primary btn-sm" onClick={handleBrowserInstall}>
          Install
        </button>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setShowBrowserPrompt(false)}
        >
          ✕
        </button>
      </div>
    );
  }

  if (isIos && showIosGuide) {
    return (
      <div className="fixed bottom-4 inset-x-4 z-50 bg-base-200 shadow-lg rounded-xl p-4 flex flex-col items-center text-center gap-2">
        <p className="text-sm font-medium">
          To install on iPhone: <br />
          Tap <span className="font-bold">Share</span> →{" "}
          <span className="font-bold">Add to Home Screen</span>.
        </p>
        <button
          className="btn btn-sm btn-ghost mt-2"
          onClick={() => setShowIosGuide(false)}
        >
          Got it
        </button>
      </div>
    );
  }

  return null;
}
