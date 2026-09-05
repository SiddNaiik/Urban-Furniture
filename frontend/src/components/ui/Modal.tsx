'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { ui } from '@/lib/theme';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className={cn(ui.card, 'w-full max-w-lg shadow-xl animate-in fade-in zoom-in-95 duration-150', className)}>
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E5E3DC]">
          {title && <h2 className="text-lg font-semibold text-[#2C2C2C] font-display">{title}</h2>}
          <button
            onClick={onClose}
            className="ml-auto text-[#737373] hover:text-[#2C2C2C] p-1 rounded-lg hover:bg-[#F8F6F1] transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
