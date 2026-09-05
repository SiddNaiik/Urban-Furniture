import React from 'react';
import { cn } from '@/lib/utils';
import { ui } from '@/lib/theme';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className={ui.label}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          ui.input,
          error && 'border-[#C0392B] focus:ring-[#C0392B]/30 focus:border-[#C0392B]',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-[#C0392B] mt-1">{error}</p>}
    </div>
  );
}
