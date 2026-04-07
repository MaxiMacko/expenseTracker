'use client';

import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import useExpenseStore from '@/store/useExpenseStore';
import { formatCurrency } from '@/lib/utils';
import type { Expense } from '@/lib/types';

const COLORS = ['#0284c7', '#fb7185', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#f97316'];
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface ChartsTabProps {
  mockExpenses?: Expense[];
  mockChartMode?: 'day' | 'month' | 'year';
}

export default function ChartsTab({ mockExpenses, mockChartMode }: ChartsTabProps = {}) {
  const store = useExpenseStore();
  const { expenses, chartMode, setChartMode } = store;

  // Use mock data if provided, otherwise use store data
  const actualExpenses = mockExpenses || expenses;
  const actualChartMode = mockChartMode || chartMode;
  const [enabledCategories, setEnabledCategories] = useState<Set<string>>(new Set());
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const todayIso = today.toISOString().slice(0, 10);

  const filteredExpenses = useMemo(() => {
    return actualExpenses.filter((expense) => {
      const date = new Date(expense.date);
      if (actualChartMode === 'day') {
        return expense.date === todayIso;
      }
      if (actualChartMode === 'month') {
        return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
      }
      return date.getFullYear() === currentYear;
    });
  }, [actualChartMode, actualExpenses, currentMonth, currentYear, todayIso]);

  const categoryData = useMemo(() => {
    const totals = filteredExpenses.reduce<Record<string, number>>((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.price;
      return acc;
    }, {});

    // If no categories are enabled, show all categories
    const categoriesToShow = enabledCategories.size === 0 ? Object.keys(totals) : Array.from(enabledCategories);

    return Object.entries(totals)
      .filter(([name]) => categoriesToShow.includes(name))
      .map(([name, value]) => ({ name, value }));
  }, [filteredExpenses, enabledCategories]);

  const monthlyData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, index) => ({ month: MONTH_LABELS[index], value: 0 }));
    actualExpenses.forEach((expense) => {
      const date = new Date(expense.date);
      if (date.getFullYear() === currentYear) {
        months[date.getMonth()].value += expense.price;
      }
    });
    return months;
  }, [actualExpenses, currentYear]);

  // Get all available categories from current filtered expenses
  const allCategories = useMemo(() => {
    const totals = filteredExpenses.reduce<Record<string, number>>((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.price;
      return acc;
    }, {});
    return Object.keys(totals).sort();
  }, [filteredExpenses]);

  const toggleCategory = (category: string) => {
    const newEnabled = new Set(enabledCategories);
    if (newEnabled.has(category)) {
      newEnabled.delete(category);
    } else {
      newEnabled.add(category);
    }
    setEnabledCategories(newEnabled);
  };

  const toggleAllCategories = () => {
    if (enabledCategories.size === allCategories.length) {
      setEnabledCategories(new Set());
    } else {
      setEnabledCategories(new Set(allCategories));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Analytics mode</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">Category & monthly trends</h2>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          {(['day', 'month', 'year'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setChartMode(mode)}
              className={`rounded-full px-4 py-2 font-semibold transition ${actualChartMode === mode ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-900">Expenses by category</p>
              <p className="mt-1 text-sm text-slate-500">Current {actualChartMode} totals</p>
            </div>
            <div className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600">
              {actualChartMode}
            </div>
          </div>

          {/* Category Toggle Checkboxes */}
          {allCategories.length > 0 && (
            <div className="mb-6 flex items-center gap-3 flex-wrap">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabledCategories.size === allCategories.length}
                  onChange={toggleAllCategories}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded"
                />
                <span className="ml-2 text-xs font-semibold text-slate-700">All</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {allCategories.map((category) => (
                  <label key={category} className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enabledCategories.size === 0 || enabledCategories.has(category)}
                      onChange={() => toggleCategory(category)}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded"
                    />
                    <span className="ml-2 text-xs font-medium text-slate-600">{category}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie dataKey="value" data={categoryData} outerRadius={120} innerRadius={60} paddingAngle={4} nameKey="name">
                  {categoryData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <p className="text-sm font-semibold text-slate-900">Monthly spend - current year</p>
            <p className="mt-1 text-sm text-slate-500">Each bar shows the total for a month.</p>
          </div>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 16, right: 10, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis tickFormatter={(value) => `€${value}`} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="value" fill="#0284c7" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}
