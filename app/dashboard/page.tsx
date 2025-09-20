"use client";

import dynamic from "next/dynamic";

// Client-only import to avoid SSR + IndexedDB issues
const DashboardPageImpl = dynamic(() => import("./DashboardPageImpl"), {
  ssr: false,
});

export default function DashboardPage() {
  return <DashboardPageImpl />;
}
