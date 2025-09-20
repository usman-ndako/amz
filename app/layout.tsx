// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import InstallPrompt from "@/components/InstallPrompt";
import RegisterServiceWorker from "@/components/RegisterServiceWorker";
import { startSyncScheduler } from "@/lib/syncScheduler";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tailor App",
  description: "Offline-first Tailor management app",
  manifest: "/manifest.json",
  themeColor: "#2563eb",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

function SyncInitializer() {
  // client component that runs the sync scheduler
  if (typeof window !== "undefined") {
    startSyncScheduler();
  }
  return null;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="nord">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-base-200 text-base-content min-h-screen`}
      >
        {children}
        <RegisterServiceWorker />
        <InstallPrompt />
        <SyncInitializer /> {/* ✅ starts Dexie ↔ Firestore sync */}
      </body>
    </html>
  );
}
