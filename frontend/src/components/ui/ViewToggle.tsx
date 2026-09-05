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
    <div className={cn('inline-flex rounded-lg border border-gray-300 overflow-hidden', className)}>
      <button
        onClick={() => onChange('list')}
        className={cn(
          'px-3 py-1.5 text-sm transition-colors',
          view === 'list' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
        )}
        title="List view"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <button
        onClick={() => onChange('kanban')}
        className={cn(
          'px-3 py-1.5 text-sm transition-colors',
          view === 'kanban' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
        )}
        title="Kanban view"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
      </button>
    </div>
  );
}
