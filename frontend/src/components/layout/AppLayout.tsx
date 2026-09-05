'use client';

import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useState } from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F8F6F1]">
      {/* Spacer — reserves the 224px (w-56) the fixed Sidebar occupies */}
      <div className="w-56 shrink-0" aria-hidden="true" />
 
      {/* The actual fixed sidebar, rendered on top of the spacer above */}
      <Sidebar />
 
      {/* Real page content — flex-1 takes all remaining width */}
      <div className="flex-1 min-w-0 flex flex-col">
        {children}
      </div>
    </div>
  );
}
