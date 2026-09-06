'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

import {
  createBudget,
  getBudget,
  updateBudget,
} from '@/lib/api';

import { ui } from '@/lib/theme';

type BudgetState =
  | 'draft'
  | 'confirm'
  | 'revised'
  | 'cancel';

interface FormState {
  name: string;
  period: string;
  date_from: string;
  date_to: string;
  total_amount: string;
  revised_amount: string;
  state: BudgetState;
}

const emptyForm: FormState = {
  name: '',
  period: 'Monthly',
  date_from: '',
  date_to: '',
  total_amount: '0',
  revised_amount: '',
  state: 'draft',
};

export default function BudgetForm({ id }: { id: string }) {
  const router = useRouter();

  const isNew = id === 'new';

  const [form, setForm] =
    useState<FormState>(emptyForm);

  const [loading, setLoading] =
    useState(false);

  const [loadingData, setLoadingData] =
    useState(!isNew);

  const [error, setError] =
    useState('');

  useEffect(() => {
    if (isNew) {
      setLoadingData(false);
      return;
    }

    async function loadBudget() {
      try {
        setLoadingData(true);
        setError('');

        const budget = await getBudget(id);

        const backendState =
          budget?.state ??
          budget?.status ??
          'draft';

        let normalizedState: BudgetState = 'draft';

        if (
          backendState === 'confirm' ||
          backendState === 'confirmed'
        ) {
          normalizedState = 'confirm';
        } else if (
          backendState === 'revised'
        ) {
          normalizedState = 'revised';
        } else if (
          backendState === 'cancel' ||
          backendState === 'cancelled'
        ) {
          normalizedState = 'cancel';
        }

        setForm({
          name: budget?.name ?? '',
          period:
            budget?.period ?? 'Monthly',
          date_from:
            budget?.date_from ?? '',
          date_to:
            budget?.date_to ?? '',
          total_amount: String(
            budget?.total_amount ?? 0
          ),
          revised_amount:
            budget?.revised_amount != null
              ? String(
                  budget.revised_amount
                )
              : '',
          state: normalizedState,
        });
      } catch (err) {
        console.error(
          'Failed to load budget:',
          err
        );

        setError(
          'Unable to load this budget.'
        );
      } finally {
        setLoadingData(false);
      }
    }

    loadBudget();
  }, [id, isNew]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError('');
  }

  function validate() {
    if (!form.name.trim()) {
      return 'Budget name is required.';
    }

    if (!form.date_from) {
      return 'Start date is required.';
    }

    if (!form.date_to) {
      return 'End date is required.';
    }

    if (
      form.date_to < form.date_from
    ) {
      return 'End date cannot be before start date.';
    }

    const amount = Number(
      form.total_amount
    );

    if (
      !Number.isFinite(amount) ||
      amount < 0
    ) {
      return 'Budget amount must be a valid non-negative number.';
    }

    if (form.revised_amount) {
      const revisedAmount = Number(
        form.revised_amount
      );

      if (
        !Number.isFinite(
          revisedAmount
        ) ||
        revisedAmount < 0
      ) {
        return 'Revised budget amount must be a valid non-negative number.';
      }
    }

    return '';
  }

  async function saveBudget(
    state: BudgetState = form.state
  ) {
    const validationError =
      validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    const payload: Record<
      string,
      string | number
    > = {
      name: form.name.trim(),
      period: form.period,
      date_from: form.date_from,
      date_to: form.date_to,
      total_amount: Number(
        form.total_amount
      ),
      state,
    };

    /*
     * FRONTEND ONLY
     *
     * BACKEND TODO:
     * revised_amount needs to be supported by
     * the backend as a separate value.
     *
     * The original approved budget amount
     * should remain preserved when a revision
     * is created.
     */
    if (form.revised_amount) {
      payload.revised_amount =
        Number(form.revised_amount);
    }

    try {
      if (isNew) {
        await createBudget(payload);
      } else {
        await updateBudget(
          id,
          payload
        );
      }

      router.push('/budgets');
    } catch (err: any) {
      console.error(
        'Failed to save budget:',
        err
      );

      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        'Unable to save the budget. Please check the backend/API and try again.';

      setError(String(message));
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    await saveBudget('draft');
  }

  async function handleConfirm() {
    if (isNew) {
      await saveBudget('confirm');
      return;
    }

    /*
     * FRONTEND ONLY
     *
     * BACKEND TODO:
     * Ideally this should call a dedicated
     * workflow endpoint such as:
     *
     * await confirmBudget(id)
     *
     * The backend should:
     * - change the state to confirmed
     * - preserve the approved amount
     * - make the budget available for
     *   Purchase Order budget checking
     */
    await saveBudget('confirm');
  }

  async function handleRevise() {
    if (!form.revised_amount) {
      setError(
        'Please enter a revised budget amount.'
      );
      return;
    }

    const revisedAmount = Number(
      form.revised_amount
    );

    if (
      !Number.isFinite(
        revisedAmount
      ) ||
      revisedAmount < 0
    ) {
      setError(
        'Revised budget amount must be a valid non-negative number.'
      );
      return;
    }

    /*
     * FRONTEND ONLY
     *
     * BACKEND TODO:
     * A proper revision endpoint should create
     * a revision record while preserving the
     * original approved budget.
     *
     * Example:
     *
     * await reviseBudget(id, {
     *   revised_amount: revisedAmount
     * })
     *
     * Do not create a fake endpoint here.
     */
    await saveBudget('revised');
  }

  async function handleCancelBudget() {
    if (isNew) {
      router.push('/budgets');
      return;
    }

    const confirmed =
      window.confirm(
        'Are you sure you want to cancel this budget?'
      );

    if (!confirmed) {
      return;
    }

    /*
     * FRONTEND ONLY
     *
     * BACKEND TODO:
     * Replace this with the real workflow
     * endpoint when available:
     *
     * await cancelBudget(id)
     *
     * Cancelled budgets must not be considered
     * active budgets for Purchase Order
     * budget checking.
     */
    await saveBudget('cancel');
  }

  function getBadgeVariant() {
    if (form.state === 'confirm') {
      return 'confirmed';
    }

    if (form.state === 'cancel') {
      return 'danger';
    }

    if (form.state === 'revised') {
      return 'warning';
    }

    return 'draft';
  }

  function getStateLabel() {
    if (form.state === 'confirm') {
      return 'Confirmed';
    }

    if (form.state === 'revised') {
      return 'Revised';
    }

    if (form.state === 'cancel') {
      return 'Cancelled';
    }

    return 'New';
  }

  const isCancelled =
    form.state === 'cancel';

  const isConfirmed =
    form.state === 'confirm';

  const isRevised =
    form.state === 'revised';

  const canEdit =
    !isCancelled &&
    !isConfirmed;

  const originalAmount =
    Number(form.total_amount) || 0;

  const revisedAmount =
    Number(form.revised_amount) || 0;

  const effectiveAmount =
    revisedAmount > 0
      ? revisedAmount
      : originalAmount;

  if (loadingData) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card>
          <p className="text-sm text-[#737373]">
            Loading budget...
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E5E3DC]">

        <div>
          <p className="text-xs uppercase tracking-widest text-[#A5A58D] font-semibold">
            Budget
          </p>

          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm font-medium text-[#2C2C2C]">
              {isNew
                ? 'New Budget'
                : 'Edit Budget'}
            </span>

            <Badge
              variant={
                getBadgeVariant() as any
              }
            >
              {getStateLabel()}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">

          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              router.push('/budgets')
            }
          >
            Back
          </Button>

          {/* CONFIRM */}
          {!isCancelled &&
            !isConfirmed &&
            !isRevised && (
              <Button
                type="button"
                onClick={
                  handleConfirm
                }
                loading={loading}
              >
                Confirm
              </Button>
            )}

          {/* REVISE */}
          {isConfirmed && (
            <Button
              type="button"
              onClick={
                handleRevise
              }
              loading={loading}
            >
              Save Revision
            </Button>
          )}

          {/* CANCEL */}
          {!isNew &&
            !isCancelled && (
              <Button
                type="button"
                variant="secondary"
                onClick={
                  handleCancelBudget
                }
                disabled={loading}
              >
                Cancel Budget
              </Button>
            )}
        </div>
      </div>

      {/* WORKFLOW */}
      {!isNew && (
        <Card>
          <div>
            <p className={ui.sectionLabel}>
              Budget Workflow
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-3">

              <div
                className={`rounded-lg px-3 py-2 text-xs font-medium ₹{
                  form.state === 'draft'
                    ? 'bg-[#66734A] text-white'
                    : 'bg-[#F1F0EA] text-[#737373]'
                }`}
              >
                1. New
              </div>

              <span className="text-[#B5B3AA]">
                →
              </span>

              <div
                className={`rounded-lg px-3 py-2 text-xs font-medium ₹{
                  form.state === 'confirm'
                    ? 'bg-[#66734A] text-white'
                    : 'bg-[#F1F0EA] text-[#737373]'
                }`}
              >
                2. Confirmed
              </div>

              <span className="text-[#B5B3AA]">
                →
              </span>

              <div
                className={`rounded-lg px-3 py-2 text-xs font-medium ₹{
                  form.state === 'revised'
                    ? 'bg-[#A58A45] text-white'
                    : 'bg-[#F1F0EA] text-[#737373]'
                }`}
              >
                3. Revised
              </div>

              <span className="text-[#B5B3AA]">
                →
              </span>

              <div
                className={`rounded-lg px-3 py-2 text-xs font-medium ₹{
                  form.state === 'cancel'
                    ? 'bg-[#C0392B] text-white'
                    : 'bg-[#F1F0EA] text-[#737373]'
                }`}
              >
                4. Cancelled
              </div>

            </div>
          </div>
        </Card>
      )}

      {/* MAIN FORM */}
      <Card>
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <div>
            <p className={ui.sectionLabel}>
              Budget Details
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* NAME */}
              <div className="md:col-span-2">
                <Input
                  label="Budget Name"
                  name="name"
                  value={form.name}
                  onChange={
                    handleChange
                  }
                  required
                  disabled={!canEdit}
                  placeholder="e.g. January 2027 Operational Budget"
                />
              </div>

              {/* PERIOD */}
              <div>
                <label
                  htmlFor="period"
                  className={ui.label}
                >
                  Budget Period
                </label>

                <select
                  id="period"
                  name="period"
                  value={form.period}
                  onChange={
                    handleChange
                  }
                  disabled={!canEdit}
                  className={`₹{ui.select} ₹{
                    !canEdit
                      ? 'opacity-60 cursor-not-allowed'
                      : ''
                  }`}
                >
                  <option value="Monthly">
                    Monthly
                  </option>

                  <option value="Quarterly">
                    Quarterly
                  </option>

                  <option value="Yearly">
                    Yearly
                  </option>

                  <option value="Custom">
                    Custom
                  </option>
                </select>
              </div>

              {/* ORIGINAL AMOUNT */}
              <Input
                label="Original Budget Amount"
                name="total_amount"
                type="number"
                min="0"
                step="0.01"
                value={
                  form.total_amount
                }
                onChange={
                  handleChange
                }
                disabled={!canEdit}
                placeholder="0.00"
              />

              {/* START DATE */}
              <Input
                label="Start Date"
                name="date_from"
                type="date"
                value={
                  form.date_from
                }
                onChange={
                  handleChange
                }
                disabled={!canEdit}
                required
              />

              {/* END DATE */}
              <Input
                label="End Date"
                name="date_to"
                type="date"
                value={
                  form.date_to
                }
                onChange={
                  handleChange
                }
                disabled={!canEdit}
                required
              />

            </div>
          </div>

          {/* REVISION SECTION */}
          {(isConfirmed || isRevised) && (
            <div className="rounded-xl border border-[#D8C99A] bg-[#FAF8EF] p-5">

              <div className="mb-4">
                <p className={ui.sectionLabel}>
                  Budget Revision
                </p>

                <p className="mt-1 text-xs text-[#737373]">
                  The original approved amount
                  remains preserved. Enter the
                  revised amount separately.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <label className={ui.label}>
                    Original Approved Amount
                  </label>

                  <div className="mt-1 rounded-lg border border-[#E5E3DC] bg-white px-3 py-2.5 text-sm font-medium text-[#2C2C2C]">
                    ₹
                    {originalAmount.toLocaleString(
                      'en-IN',
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </div>
                </div>

                <Input
                  label="Revised Budget Amount"
                  name="revised_amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={
                    form.revised_amount
                  }
                  onChange={
                    handleChange
                  }
                  disabled={isCancelled}
                  placeholder="Enter revised amount"
                />

              </div>

              {revisedAmount > 0 && (
                <div className="mt-4 rounded-lg border border-[#E5E3DC] bg-white px-4 py-3">

                  <div className="flex items-center justify-between">

                    <span className="text-sm text-[#737373]">
                      Effective Budget
                    </span>

                    <span className="text-sm font-semibold text-[#2C2C2C]">
                      ₹
                      {effectiveAmount.toLocaleString(
                        'en-IN',
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </span>

                  </div>

                </div>
              )}

            </div>
          )}

          {/* BUDGET INTEGRATION */}
          {!isNew && (
            <div className="rounded-xl border border-[#E5E3DC] bg-[#FAFAF7] p-5">

              <div className="mb-4">
                <p className={ui.sectionLabel}>
                  Budget Integration
                </p>

                <p className="mt-1 text-xs text-[#737373]">
                  Confirmed budgets can be used
                  for Purchase Order budget
                  checking.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                <div className="rounded-lg bg-white border border-[#E5E3DC] p-3">
                  <p className="text-xs text-[#737373]">
                    Budget
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#2C2C2C]">
                    ₹
                    {effectiveAmount.toLocaleString(
                      'en-IN'
                    )}
                  </p>
                </div>

                <div className="rounded-lg bg-white border border-[#E5E3DC] p-3">
                  <p className="text-xs text-[#737373]">
                    Committed
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#2C2C2C]">
                    —
                  </p>

                  {/*
                   * BACKEND TODO:
                   * Fetch committed amount from
                   * Purchase Orders linked to this
                   * budget / analytic account.
                   */}
                </div>

                <div className="rounded-lg bg-white border border-[#E5E3DC] p-3">
                  <p className="text-xs text-[#737373]">
                    Remaining
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#2C2C2C]">
                    —
                  </p>

                  {/*
                   * BACKEND TODO:
                   *
                   * Remaining Budget =
                   * Effective Budget -
                   * Committed Amount
                   *
                   * This must be calculated from
                   * real Purchase Order data.
                   */}
                </div>

              </div>

              <div className="mt-4 rounded-lg border border-dashed border-[#D8D5CA] px-4 py-3 text-xs text-[#737373]">
                Budget → Purchase Order → Vendor
                Bill
              </div>

            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="rounded-lg border border-[#C0392B]/20 bg-[#C0392B]/5 px-4 py-3 text-sm text-[#C0392B]">
              {error}
            </div>
          )}

          {/* FOOTER ACTIONS */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-[#E5E3DC]">

            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                router.push('/budgets')
              }
              disabled={loading}
            >
              Back
            </Button>

            {!isCancelled && (
              <Button
                type="submit"
                loading={loading}
                disabled={!canEdit}
              >
                {isNew
                  ? 'Create Budget'
                  : 'Save Draft'}
              </Button>
            )}

            {!isNew &&
              !isCancelled && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={
                    handleCancelBudget
                  }
                  disabled={loading}
                >
                  Cancel Budget
                </Button>
              )}

          </div>

        </form>
      </Card>
    </div>
  );
}