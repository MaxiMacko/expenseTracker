'use client';

import 'react-datepicker/dist/react-datepicker.css';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import useExpenseStore from '@/store/useExpenseStore';
import type { Expense } from '@/lib/types';

type ExpenseModalProps = {
  open: boolean;
  onClose: () => void;
};

const CategoryField = ({
  categories,
  value,
  onChange,
  onAddCategory
}: {
  categories: string[];
  value: string;
  onChange: (value: string) => void;
  onAddCategory: (category: string) => void;
}) => {
  const [isTextMode, setIsTextMode] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    if (!isTextMode) setNewCategory('');
  }, [isTextMode]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <label className="block text-sm font-semibold text-slate-700">Category</label>
        <button
          type="button"
          onClick={() => setIsTextMode((current) => !current)}
          className="text-sm font-semibold text-sky-600 transition hover:text-sky-800"
        >
          {isTextMode ? 'Use existing' : 'Add new'}
        </button>
      </div>
      {isTextMode ? (
        <div className="space-y-2">
          <input
            type="text"
            value={newCategory}
            onChange={(event) => setNewCategory(event.target.value)}
            placeholder="New category"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500"
          />
          <button
            type="button"
            onClick={() => {
              const trimmed = newCategory.trim();
              if (trimmed) {
                onChange(trimmed);
                onAddCategory(trimmed);
              }
            }}
            className="rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            Save category
          </button>
        </div>
      ) : (
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default function ExpenseModal({ open, onClose }: ExpenseModalProps) {
  const { editingExpense, addExpense, updateExpense, categories, addCategory } = useExpenseStore();
  const [form, setForm] = useState({ name: '', category: '', date: new Date(), price: 0 });

  useEffect(() => {
    if (editingExpense) {
      setForm({
        name: editingExpense.name,
        category: editingExpense.category,
        date: new Date(editingExpense.date),
        price: editingExpense.price
      });
    } else {
      setForm({ name: '', category: categories[0] ?? '', date: new Date(), price: 0 });
    }
  }, [editingExpense, categories]);

  const canSubmit = form.name.trim() !== '' && form.category.trim() !== '' && form.price > 0;

  const handleSubmit = async () => {
    const payload: Expense = {
      id: editingExpense?.id ?? crypto.randomUUID(),
      name: form.name.trim(),
      category: form.category.trim(),
      date: form.date.toISOString().slice(0, 10),
      price: form.price
    };
    if (editingExpense) {
      await updateExpense(payload);
    } else {
      await addExpense(payload);
    }
    onClose();
  };

  const modalClass = open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none';

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 transition ${modalClass}`}>
      <div className="w-full max-w-2xl rounded-[32px] bg-white p-6 shadow-soft">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{editingExpense ? 'Edit expense' : 'New expense'}</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">{editingExpense ? 'Update expense item' : 'Add a new expense'}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Close
          </button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Name</span>
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Expense name"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500"
            />
          </label>

          <div>
            <CategoryField
              categories={categories}
              value={form.category}
              onChange={(value) => setForm((prev) => ({ ...prev, category: value }))}
              onAddCategory={addCategory}
            />
          </div>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Date</span>
            <DatePicker
              selected={form.date}
              onChange={(date: Date | null) => date && setForm((prev) => ({ ...prev, date }))}
              dateFormat="yyyy-MM-dd"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Price</span>
            <input
              type="number"
              value={form.price}
              min={0}
              step="0.01"
              onChange={(event) => setForm((prev) => ({ ...prev, price: Number(event.target.value) }))}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500"
            />
          </label>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {editingExpense ? 'Save changes' : 'Add expense'}
          </button>
        </div>
      </div>
    </div>
  );
}
