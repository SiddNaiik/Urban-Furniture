'use client';

import { cn } from '@/lib/utils';

type View = 'list' | 'kanban';

interface ViewToggleProps {
  view: View;
  onChange: (view: View) => void;
  className?: string;
}

export default function ViewToggle({ view, onChange, className }: ViewToggleProps) {
  return (
    <div className={cn('inline-flex rounded-lg border border-[#E5E3DC] bg-white p-0.5 shadow-sm', className)}>
      <button
        type="button"
        onClick={() => onChange('list')}
        className={cn(
          'px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5',
          view === 'list'
            ? 'bg-[#6B705C] text-white shadow-sm'
            : 'text-[#737373] hover:text-[#2C2C2C] hover:bg-[#F8F6F1]'
        )}
        title="List view"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        List
      </button>
      <button
        type="button"
        onClick={() => onChange('kanban')}
        className={cn(
          'px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5',
          view === 'kanban'
            ? 'bg-[#6B705C] text-white shadow-sm'
            : 'text-[#737373] hover:text-[#2C2C2C] hover:bg-[#F8F6F1]'
        )}
        title="Kanban view"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
        Kanban
      </button>
    </div>
  );
}
