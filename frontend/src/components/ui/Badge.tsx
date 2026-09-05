import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'paid' | 'unpaid' | 'draft' | 'confirmed';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-[#F8F6F1] text-[#737373] border border-[#E5E3DC]',
  success: 'bg-[#3D7A4E]/10 text-[#3D7A4E] border border-[#3D7A4E]/20',
  paid: 'bg-green-100 text-green-800 border border-green-200',
  warning: 'bg-amber-100 text-amber-800 border border-amber-200',
  draft: 'bg-amber-100 text-amber-800 border border-amber-200',
  danger: 'bg-red-100 text-red-800 border border-red-200',
  unpaid: 'bg-red-100 text-red-800 border border-red-200',
  info: 'bg-blue-100 text-blue-800 border border-blue-200',
  confirmed: 'bg-blue-100 text-blue-800 border border-blue-200',
};

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
        variantClasses[variant] || variantClasses.default,
        className
      )}
    >
      {children}
    </span>
  );
}
