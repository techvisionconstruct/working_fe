"use client";

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Create a loading placeholder with the same initial dimensions as the sidebar
const SidebarLoadingPlaceholder = () => {
  return (
    <div className="w-[18rem] h-screen bg-sidebar border-r border-sidebar-border">
      {/* Add minimal loading UI here if desired */}
    </div>
  );
};

// Import Sidenav with SSR disabled to prevent hydration errors
const Sidenav = dynamic(() => import('@/components/ui/sidebar').then(mod => mod.Sidenav), {
  ssr: false,
  loading: () => <SidebarLoadingPlaceholder />
});

export default function SidenavWrapper() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark as client-side once mounted
    setIsClient(true);
  }, []);

  // Only render on client-side to prevent hydration issues
  if (!isClient) {
    return <SidebarLoadingPlaceholder />;
  }

  return <Sidenav />;
}