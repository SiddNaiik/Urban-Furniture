import Card from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  trend: number;
  icon?: string;
}

export default function MetricCard({ title, value, trend, icon }: MetricCardProps) {
  const isPositive = trend >= 0;
  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className={cn('text-xs font-medium', isPositive ? 'text-green-600' : 'text-red-600')}>
        {isPositive ? '▲' : '▼'} {Math.abs(trend)}% vs last month
      </p>
    </Card>
  );
}
