import { cn } from '@/lib/utils';
import { ui } from '@/lib/theme';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

export default function Card({ children, className, padding = true }: CardProps) {
  return (
    <div className={cn(ui.card, padding ? 'p-6' : 'p-0', className)}>
      {children}
    </div>
  );
}
