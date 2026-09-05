import { cn } from '@/lib/utils';

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
  className?: string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

export default function Table<T>({
  columns,
  data,
  keyExtractor,
  className,
  onRowClick,
  emptyMessage = 'No records found.',
}: TableProps<T>) {
  return (
    <div className={cn('overflow-x-auto rounded-lg border border-gray-200', className)}>
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={cn('px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500', col.className)}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={keyExtractor(row)}
                onClick={() => onRowClick?.(row)}
                className={cn(onRowClick && 'cursor-pointer hover:bg-gray-50 transition-colors')}
              >
                {columns.map((col) => (
                  <td key={String(col.key)} className={cn('px-4 py-3 text-gray-700', col.className)}>
                    {col.render ? col.render(row) : String((row as Record<string, unknown>)[String(col.key)] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
