'use client';

import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import useExpenseStore from '@/store/useExpenseStore';
import { formatCurrency } from '@/lib/utils';

const COLORS = ['#0284c7', '#fb7185', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#f97316'];
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function ChartsTab() {
  const { expenses, chartMode, setChartMode } = useExpenseStore();
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const todayIso = today.toISOString().slice(0, 10);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const date = new Date(expense.date);
      if (chartMode === 'day') {
        return expense.date === todayIso;
      }
      if (chartMode === 'month') {
        return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
      }
      return date.getFullYear() === currentYear;
    });
  }, [chartMode, expenses, currentMonth, currentYear, todayIso]);

  const categoryData = useMemo(() => {
    const totals = filteredExpenses.reduce<Record<string, number>>((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.price;
      return acc;
    }, {});
    return Object.entries(totals).map(([name, value]) => ({ name, value }));
  }, [filteredExpenses]);

  const monthlyData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, index) => ({ month: MONTH_LABELS[index], value: 0 }));
    expenses.forEach((expense) => {
      const date = new Date(expense.date);
      if (date.getFullYear() === currentYear) {
        months[date.getMonth()].value += expense.price;
      }
    });
    return months;
  }, [expenses, currentYear]);

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
              className={`rounded-full px-4 py-2 font-semibold transition ${chartMode === mode ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
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
              <p className="mt-1 text-sm text-slate-500">Current {chartMode} totals</p>
            </div>
            <div className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600">
              {chartMode}
            </div>
          </div>
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
