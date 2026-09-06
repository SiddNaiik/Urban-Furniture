'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Table from '@/components/ui/Table';
import BudgetPieChart from '@/components/budget/BudgetPieChart';

import { getBudget } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Budget, BudgetLine } from '@/types/budget';
import { ui } from '@/lib/theme';

interface BudgetDetailViewProps {
  id: string;
}

function num(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function getStatus(budget: Budget): string {
  return String(
    budget.state ??
      budget.status ??
      'draft'
  ).toLowerCase();
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'confirm':
    case 'confirmed':
      return 'Confirmed';

    case 'revised':
      return 'Revised';

    case 'cancel':
    case 'cancelled':
      return 'Cancelled';

    default:
      return 'New';
  }
}

function getStatusVariant(
  status: string
): 'confirmed' | 'danger' | 'success' | 'draft' {
  switch (status) {
    case 'confirm':
    case 'confirmed':
      return 'confirmed';

    case 'cancel':
    case 'cancelled':
      return 'danger';

    case 'revised':
      return 'success';

    default:
      return 'draft';
  }
}

export default function BudgetDetailView({
  id,
}: BudgetDetailViewProps) {
  const router = useRouter();

  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadBudget() {
      try {
        setLoading(true);
        setError('');

        const data = await getBudget(id);
        setBudget(data);
      } catch (err) {
        console.error('Failed to load budget:', err);
        setError(
          'Unable to load this budget. Please check the backend/API.'
        );
      } finally {
        setLoading(false);
      }
    }

    loadBudget();
  }, [id]);

  const analytics = useMemo(() => {
    const lines: BudgetLine[] = budget?.lines ?? [];

    const plannedFromLines = lines.reduce(
      (sum, line) =>
        sum + num(line.planned_amount),
      0
    );

    const achievedFromLines = lines.reduce(
      (sum, line) =>
        sum + num(line.practical_amount),
      0
    );

    /*
     * BACKEND TODO:
     *
     * Once the backend provides:
     * - revised_amount
     * - committed_amount
     * - achieved_amount
     *
     * those values should become the authoritative source.
     */

    const originalAmount = num(
      (budget as any)?.total_amount
    );

    const revisedAmount = num(
      (budget as any)?.revised_amount
    );

    const committedAmount = num(
      (budget as any)?.committed_amount
    );

    const achievedAmount = num(
      (budget as any)?.achieved_amount
    );

    const budgetAmount =
      revisedAmount > 0
        ? revisedAmount
        : plannedFromLines > 0
          ? plannedFromLines
          : originalAmount;

    const actualAchieved =
      achievedAmount > 0
        ? achievedAmount
        : achievedFromLines;

    const remaining =
      Math.max(
        budgetAmount - committedAmount,
        0
      );

    const achievementPercentage =
      budgetAmount > 0
        ? Math.round(
            (actualAchieved / budgetAmount) * 100
          )
        : 0;

    return {
      lines,
      originalAmount,
      revisedAmount,
      committedAmount,
      budgetAmount,
      actualAchieved,
      remaining,
      achievementPercentage,
    };
  }, [budget]);

  if (loading) {
    return (
      <Card>
        <p className="text-sm text-[#737373]">
          Loading budget details...
        </p>
      </Card>
    );
  }

  if (!budget) {
    return (
      <Card>
        <p className="text-sm text-[#C0392B]">
          {error || 'Budget not found.'}
        </p>

        <Button
          className="mt-4"
          variant="secondary"
          onClick={() => router.push('/budgets')}
        >
          Back to Budgets
        </Button>
      </Card>
    );
  }

  const status = getStatus(budget);

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

        <div>
          <p className={ui.sectionLabel}>
            Budget View
          </p>

          <div className="flex flex-wrap items-center gap-3">

            <h1 className={ui.pageTitle}>
              {budget.name}
            </h1>

            <Badge
              variant={getStatusVariant(status)}
            >
              {getStatusLabel(status)}
            </Badge>

          </div>

          <p className="text-sm text-[#737373] mt-1">
            {formatDate(budget.date_from)}
            {' — '}
            {formatDate(budget.date_to)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">

          <Button
            variant="secondary"
            onClick={() =>
              router.push(
                '/reports/budget-report'
              )
            }
          >
            Analytics Report
          </Button>

          {status !== 'cancel' &&
            status !== 'cancelled' && (
              <Button
                variant="secondary"
                onClick={() =>
                  router.push(
                    `/budgets/₹{id}/edit`
                  )
                }
              >
                Edit
              </Button>
            )}

          <Button
            variant="secondary"
            onClick={() =>
              router.push('/budgets')
            }
          >
            Back
          </Button>

        </div>
      </div>

      {/* Workflow */}
      <Card>

        <div className="flex flex-col gap-4">

          <div>
            <p className={ui.sectionLabel}>
              Budget Workflow
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-3">

              {[
                ['draft', 'New'],
                ['confirm', 'Confirmed'],
                ['revised', 'Revised'],
                ['cancel', 'Cancelled'],
              ].map(
                ([value, label], index) => (
                  <div
                    key={value}
                    className="flex items-center gap-2"
                  >

                    <Badge
                      variant={
                        status === value
                          ? getStatusVariant(status)
                          : 'draft'
                      }
                    >
                      {label}
                    </Badge>

                    {index < 3 && (
                      <span className="text-[#B5B3AA]">
                        →
                      </span>
                    )}

                  </div>
                )
              )}

            </div>
          </div>

          {/* 
            FRONTEND ONLY:
            These buttons navigate to the relevant screens.
            Actual workflow transitions must be handled by
            the backend once workflow endpoints exist.
          */}

          <div className="flex flex-wrap gap-2">

            {status === 'draft' && (
              <Button
                onClick={() =>
                  router.push(
                    `/budgets/₹{id}/edit`
                  )
                }
              >
                Confirm Budget
              </Button>
            )}

            {status === 'confirm' ||
            status === 'confirmed' ? (
              <Button
                variant="secondary"
                onClick={() =>
                  router.push(
                    `/budgets/₹{id}/edit`
                  )
                }
              >
                Revise Budget
              </Button>
            ) : null}

            {/*
              BACKEND TODO:

              Add actual:
              - Confirm
              - Revise
              - Cancel

              workflow API calls here.
            */}

          </div>

        </div>

      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        <Card className="p-5">
          <p className="text-xs text-[#737373]">
            Approved Budget
          </p>

          <p className="mt-1 text-xl font-semibold font-mono">
            {formatCurrency(
              analytics.originalAmount
            )}
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-xs text-[#737373]">
            Revised Budget
          </p>

          <p className="mt-1 text-xl font-semibold font-mono text-[#6B705C]">
            {formatCurrency(
              analytics.revisedAmount ||
                analytics.budgetAmount
            )}
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-xs text-[#737373]">
            Committed Amount
          </p>

          <p className="mt-1 text-xl font-semibold font-mono">
            {formatCurrency(
              analytics.committedAmount
            )}
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-xs text-[#737373]">
            Remaining Budget
          </p>

          <p className="mt-1 text-xl font-semibold font-mono text-[#3D7A4E]">
            {formatCurrency(
              analytics.remaining
            )}
          </p>
        </Card>

      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        <BudgetPieChart
          planned={analytics.budgetAmount}
          achieved={analytics.actualAchieved}
          remaining={
            Math.max(
              analytics.budgetAmount -
                analytics.actualAchieved,
              0
            )
          }
        />

        <Card>

          <p className={ui.sectionLabel}>
            Budget Information
          </p>

          <div className="divide-y divide-[#E5E3DC]">

            <div className="py-3 flex justify-between gap-4">
              <span className="text-sm text-[#737373]">
                Period
              </span>

              <span className="text-sm font-medium">
                {budget.period || '—'}
              </span>
            </div>

            <div className="py-3 flex justify-between gap-4">
              <span className="text-sm text-[#737373]">
                Start Date
              </span>

              <span className="text-sm font-medium">
                {formatDate(
                  budget.date_from
                ) || '—'}
              </span>
            </div>

            <div className="py-3 flex justify-between gap-4">
              <span className="text-sm text-[#737373]">
                End Date
              </span>

              <span className="text-sm font-medium">
                {formatDate(
                  budget.date_to
                ) || '—'}
              </span>
            </div>

            <div className="py-3 flex justify-between gap-4">
              <span className="text-sm text-[#737373]">
                Achievement
              </span>

              <span className="text-sm font-semibold text-[#6B705C]">
                {analytics.achievementPercentage}%
              </span>
            </div>

          </div>

        </Card>

      </div>

      {/* Purchase Order Integration */}
      <Card>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">

          <div>

            <p className={ui.sectionLabel}>
              Budget Integration
            </p>

            <h2 className="text-base font-semibold text-[#2C2C2C]">
              Purchase Order Budget Check
            </h2>

            <p className="text-xs text-[#737373] mt-1 max-w-2xl">
              Confirmed or revised budgets should be
              used when checking Purchase Order
              commitments against the available
              budget.
            </p>

          </div>

          <div className="grid grid-cols-2 gap-6 text-right">

            <div>
              <p className="text-[10px] uppercase tracking-wide text-[#737373]">
                Committed
              </p>

              <p className="font-mono font-semibold">
                {formatCurrency(
                  analytics.committedAmount
                )}
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wide text-[#737373]">
                Available
              </p>

              <p className="font-mono font-semibold text-[#6B705C]">
                {formatCurrency(
                  analytics.remaining
                )}
              </p>
            </div>

          </div>

        </div>

        {/* BACKEND TODO:
            Purchase Order confirmation should use the
            active budget/analytic line and return the
            authoritative committed amount.
        */}

      </Card>

      {/* Budget Lines */}
      <Card
        padding={false}
        className="overflow-hidden"
      >

        <div className="p-6 pb-3">

          <p className={ui.sectionLabel}>
            Budget Lines
          </p>

          <p className="text-sm text-[#737373]">
            Planned and achieved values used for
            budget analysis.
          </p>

        </div>

        {analytics.lines.length === 0 ? (

          <div className="px-6 pb-6 text-sm text-[#737373]">
            No budget lines are available.
          </div>

        ) : (

          <Table
            columns={[
              {
                key: 'analytic_account_id',
                header: 'Analytic Account',
                render: (line) => (
                  <span className="font-medium">
                    {line.analytic_account_id ||
                      '—'}
                  </span>
                ),
              },

              {
                key: 'planned_amount',
                header: 'Planned Amount',
                render: (line) => (
                  <span className="font-mono">
                    {formatCurrency(
                      line.planned_amount
                    )}
                  </span>
                ),
              },

              {
                key: 'practical_amount',
                header: 'Achieved Amount',
                render: (line) => (
                  <span className="font-mono text-[#3D7A4E]">
                    {formatCurrency(
                      line.practical_amount ?? 0
                    )}
                  </span>
                ),
              },

              {
                key: 'remaining',
                header: 'Remaining',
                render: (line) => {

                  const planned =
                    num(
                      line.planned_amount
                    );

                  const achieved =
                    num(
                      line.practical_amount
                    );

                  return (
                    <span className="font-mono">
                      {formatCurrency(
                        Math.max(
                          planned - achieved,
                          0
                        )
                      )}
                    </span>
                  );
                },
              },

              {
                key: 'percentage',
                header: 'Achievement %',
                render: (line) => {

                  const planned =
                    num(
                      line.planned_amount
                    );

                  const achieved =
                    num(
                      line.practical_amount
                    );

                  const percentage =
                    planned > 0
                      ? Math.round(
                          (achieved /
                            planned) *
                            100
                        )
                      : 0;

                  return (
                    <div className="flex items-center gap-2 min-w-28">

                      <div className="w-20 h-2 rounded-full bg-[#E5E3DC] overflow-hidden">

                        <div
                          className="h-full rounded-full bg-[#6B705C]"
                          style={{
                            width: `₹{Math.min(
                              percentage,
                              100
                            )}%`,
                          }}
                        />

                      </div>

                      <span className="text-xs font-mono font-semibold">
                        {percentage}%
                      </span>

                    </div>
                  );
                },
              },
            ]}
            data={analytics.lines}
            keyExtractor={(line) =>
              line.id ||
              line.analytic_account_id ||
              'line'
            }
          />

        )}

      </Card>

    </div>
  );
}