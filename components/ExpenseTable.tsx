'use client';

import { useMemo } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import useExpenseStore from '@/store/useExpenseStore';
import type { Expense, ExpenseFilters } from '@/lib/types';
import { formatCurrency, formatExpenseDate } from '@/lib/utils';

const columnHelper = createColumnHelper<Expense>();

const columns = (viewMode: string, onEdit: (expense: Expense) => void, onDelete: (id: string) => void) => [
  columnHelper.accessor('date', {
    header: 'Date',
    cell: (info) => formatExpenseDate(info.getValue(), viewMode as any)
  }),
  columnHelper.accessor('category', {
    header: 'Category',
    cell: (info) => info.getValue()
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => info.getValue()
  }),
  columnHelper.accessor('price', {
    header: 'Price',
    cell: (info) => formatCurrency(info.getValue())
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onEdit(row.original)}
          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(row.original.id)}
          className="rounded-full border border-slate-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
        >
          Delete
        </button>
      </div>
    )
  })
];

type ExpenseTableProps = {
  expenses: Expense[];
  filters: ExpenseFilters;
  setFilters: (filters: Partial<ExpenseFilters>) => void;
};

export default function ExpenseTable({ expenses, filters, setFilters }: ExpenseTableProps) {
  const { openModalForEditExpense, deleteExpense, viewMode, setViewMode, categories } = useExpenseStore();

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((expense) => {
        const date = expense.date;
        if (filters.category !== 'all' && expense.category !== filters.category) return false;
        if (filters.startDate && date < filters.startDate) return false;
        if (filters.endDate && date > filters.endDate) return false;
        return true;
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [expenses, filters]);

  const total = useMemo(() => filteredExpenses.reduce((sum, item) => sum + item.price, 0), [filteredExpenses]);

  const table = useReactTable({
    data: filteredExpenses,
    columns: columns(viewMode, openModalForEditExpense, deleteExpense),
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Date from</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(event) => setFilters({ startDate: event.target.value })}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500"
          />
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Date to</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(event) => setFilters({ endDate: event.target.value })}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500"
          />
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Category</label>
          <select
            value={filters.category}
            onChange={(event) => setFilters({ category: event.target.value })}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500"
          >
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>View:</span>
          {(['day', 'month', 'year'] as const).map((mode) => (
            <button
              type="button"
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${viewMode === mode ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
            >
              {mode}
            </button>
          ))}
        </div>
        <div className="text-sm font-semibold text-slate-700">
          Total: <span className="text-slate-900">{formatCurrency(total)}</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 font-semibold text-slate-600">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-4 align-top text-slate-700">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                  No expenses match the current filter.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
