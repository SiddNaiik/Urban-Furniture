import React from 'react';
import { cn } from '@/lib/utils';
import { ui } from '@/lib/theme';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export default function Select({ label, error, options, placeholder, className, id, ...props }: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={selectId} className={ui.label}>
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          ui.select,
          error && 'border-[#C0392B]',
          className
        )}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-[#C0392B] mt-1">{error}</p>}
    </div>
  );
}
