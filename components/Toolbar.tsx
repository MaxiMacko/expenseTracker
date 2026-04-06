type ToolbarProps = {
  onAddExpense: () => void;
};

export default function Toolbar({ onAddExpense }: ToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Expense tracker</p>
        <h1 className="mt-1 text-3xl font-semibold text-slate-900">Manage spending with clarity</h1>
      </div>
      <button
        type="button"
        onClick={onAddExpense}
        className="inline-flex items-center justify-center rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
      >
        Add Expense
      </button>
    </div>
  );
}
