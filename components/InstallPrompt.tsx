
// "use client";

// import { useEffect, useState } from "react";

// // Custom event typing for beforeinstallprompt
// interface BeforeInstallPromptEvent extends Event {
//   prompt: () => Promise<void>;
//   userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
// }

// export default function InstallPrompt() {
//   const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
//   const [showBrowserPrompt, setShowBrowserPrompt] = useState(false);
//   const [isIos, setIsIos] = useState(false);
//   const [showIosGuide, setShowIosGuide] = useState(false);

//   useEffect(() => {
//     const ua = window.navigator.userAgent.toLowerCase();
//     const iOS = /iphone|ipad|ipod/.test(ua);
//     const isInStandalone =
//       ("standalone" in window.navigator &&
//         (window.navigator as unknown as { standalone?: boolean }).standalone) ||
//       window.matchMedia("(display-mode: standalone)").matches;

//     setIsIos(iOS);
//     if (iOS && !isInStandalone) {
//       setShowIosGuide(true);
//     }

//     const handler = (e: Event) => {
//       const event = e as BeforeInstallPromptEvent;
//       event.preventDefault();
//       setDeferredPrompt(event);
//       setShowBrowserPrompt(true);
//     };

//     window.addEventListener("beforeinstallprompt", handler);
//     return () => window.removeEventListener("beforeinstallprompt", handler);
//   }, []);

//   const handleBrowserInstall = async () => {
//     if (!deferredPrompt) return;
//     await deferredPrompt.prompt();
//     const { outcome } = await deferredPrompt.userChoice;
//     if (outcome === "accepted") console.log("PWA installed");
//     setDeferredPrompt(null);
//     setShowBrowserPrompt(false);
//   };

//   if (showBrowserPrompt) {
//     return (
//       <div className="fixed bottom-4 right-4 z-50 bg-base-200 shadow-lg rounded-lg p-4 flex items-center gap-3">
//         <span className="text-sm">Install Tailor App?</span>
//         <button className="btn btn-primary btn-sm" onClick={handleBrowserInstall}>
//           Install
//         </button>
//         <button
//           className="btn btn-ghost btn-sm"
//           onClick={() => setShowBrowserPrompt(false)}
//         >
//           ✕
//         </button>
//       </div>
//     );
//   }

//   if (isIos && showIosGuide) {
//     return (
//       <div className="fixed bottom-4 inset-x-4 z-50 bg-base-200 shadow-lg rounded-xl p-4 flex flex-col items-center text-center gap-2">
//         <p className="text-sm font-medium">
//           To install on iPhone: <br />
//           Tap <span className="font-bold">Share</span> →{" "}
//           <span className="font-bold">Add to Home Screen</span>.
//         </p>
//         <button
//           className="btn btn-sm btn-ghost mt-2"
//           onClick={() => setShowIosGuide(false)}
//         >
//           Got it
//         </button>
//       </div>
//     );
//   }

//   return null;
// }

// "use client";

// import { useEffect, useState } from "react";

// // Custom event typing for beforeinstallprompt
// interface BeforeInstallPromptEvent extends Event {
//   prompt: () => Promise<void>;
//   userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
// }

// export default function InstallPrompt() {
//   const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
//   const [showBrowserPrompt, setShowBrowserPrompt] = useState(false);
//   const [isIos, setIsIos] = useState(false);
//   const [showIosGuide, setShowIosGuide] = useState(false);

//   useEffect(() => {
//     // If already installed → don't show
//     if (window.matchMedia("(display-mode: standalone)").matches) {
//       return;
//     }

//     const ua = window.navigator.userAgent.toLowerCase();
//     const iOS = /iphone|ipad|ipod/.test(ua);
//     const isInStandalone =
//       ("standalone" in window.navigator &&
//         (window.navigator as unknown as { standalone?: boolean }).standalone) ||
//       window.matchMedia("(display-mode: standalone)").matches;

//     setIsIos(iOS);

//     if (iOS && !isInStandalone) {
//       if (!sessionStorage.getItem("iosDismissed")) {
//         setShowIosGuide(true);
//       }
//     }

//     const handler = (e: Event) => {
//       const event = e as BeforeInstallPromptEvent;
//       event.preventDefault();
//       setDeferredPrompt(event);

//       // Show only once per session
//       if (!sessionStorage.getItem("pwaDismissed")) {
//         setShowBrowserPrompt(true);
//       }
//     };

//     window.addEventListener("beforeinstallprompt", handler);

//     return () => {
//       window.removeEventListener("beforeinstallprompt", handler);
//     };
//   }, []);

//   const handleBrowserInstall = async () => {
//     if (!deferredPrompt) return;

//     await deferredPrompt.prompt();
//     const { outcome } = await deferredPrompt.userChoice;

//     if (outcome === "accepted") {
//       console.log("✅ PWA installed");
//     }

//     setDeferredPrompt(null);
//     setShowBrowserPrompt(false);
//     sessionStorage.setItem("pwaDismissed", "true");
//   };

//   const handleDismiss = () => {
//     setShowBrowserPrompt(false);
//     sessionStorage.setItem("pwaDismissed", "true");
//   };

//   if (showBrowserPrompt) {
//     return (
//       <div className="fixed bottom-4 right-4 z-50 bg-base-200 shadow-lg rounded-lg p-4 flex items-center gap-3">
//         <span className="text-sm">Install Tailor App?</span>
//         <button className="btn btn-primary btn-sm" onClick={handleBrowserInstall}>
//           Install
//         </button>
//         <button className="btn btn-ghost btn-sm" onClick={handleDismiss}>
//           ✕
//         </button>
//       </div>
//     );
//   }

//   if (isIos && showIosGuide) {
//     return (
//       <div className="fixed bottom-4 inset-x-4 z-50 bg-base-200 shadow-lg rounded-xl p-4 flex flex-col items-center text-center gap-2">
//         <p className="text-sm font-medium">
//           To install on iPhone: <br />
//           Tap <span className="font-bold">Share</span> →{" "}
//           <span className="font-bold">Add to Home Screen</span>.
//         </p>
//         <button
//           className="btn btn-sm btn-ghost mt-2"
//           onClick={() => {
//             setShowIosGuide(false);
//             sessionStorage.setItem("iosDismissed", "true");
//           }}
//         >
//           Got it
//         </button>
//       </div>
//     );
//   }

//   return null;
// }


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
    // If already installed → don't show
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return;
    }

    const ua = window.navigator.userAgent.toLowerCase();
    const iOS = /iphone|ipad|ipod/.test(ua);
    const isInStandalone =
      ("standalone" in window.navigator &&
        (window.navigator as unknown as { standalone?: boolean }).standalone) ||
      window.matchMedia("(display-mode: standalone)").matches;

    setIsIos(iOS);

    if (iOS && !isInStandalone) {
      if (!sessionStorage.getItem("iosDismissed")) {
        setShowIosGuide(true);
      }
    }

    const handler = (e: Event) => {
      const event = e as BeforeInstallPromptEvent;
      
      const isDismissed = sessionStorage.getItem("pwaDismissed");
      console.log("🔍 beforeinstallprompt fired, pwaDismissed:", isDismissed);
      
      // Only prevent default if we want to show custom prompt
      if (!isDismissed) {
        console.log("✋ Calling preventDefault() - showing custom prompt");
        event.preventDefault(); // Only prevent when showing custom UI
        setDeferredPrompt(event);
        
        console.log("🔧 About to call setShowBrowserPrompt(true)");
        setShowBrowserPrompt(true);
        console.log("🔧 Called setShowBrowserPrompt(true)");
      } else {
        console.log("✅ Letting browser handle normally - should show menu option");
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleBrowserInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("✅ PWA installed");
    }

    setDeferredPrompt(null);
    setShowBrowserPrompt(false);
    sessionStorage.setItem("pwaDismissed", "true");
  };

  const handleDismiss = () => {
    console.log("🚫 Custom prompt dismissed");
    setShowBrowserPrompt(false);
    sessionStorage.setItem("pwaDismissed", "true");
  };

  console.log("🎯 Render state - showBrowserPrompt:", showBrowserPrompt, "isIos:", isIos, "showIosGuide:", showIosGuide);

  if (showBrowserPrompt) {
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-base-200 shadow-lg rounded-lg p-4 flex items-center gap-3">
        <span className="text-sm">Install Tailor App?</span>
        <button className="btn btn-primary btn-sm" onClick={handleBrowserInstall}>
          Install
        </button>
        <button className="btn btn-ghost btn-sm" onClick={handleDismiss}>
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
          onClick={() => {
            setShowIosGuide(false);
            sessionStorage.setItem("iosDismissed", "true");
          }}
        >
          Got it
        </button>
      </div>
    );
  }

  return null;
}