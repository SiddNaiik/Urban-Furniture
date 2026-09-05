'use client';

import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F8F6F1]">
      {/* Fixed Sidebar Space Reserve */}
      <div className="w-56 shrink-0" aria-hidden="true" />
      <Sidebar />

      {/* Main Workspace */}
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar />
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
