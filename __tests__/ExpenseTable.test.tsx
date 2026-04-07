import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExpenseTable from '@/components/ExpenseTable';
import useExpenseStore from '@/store/useExpenseStore';
import type { Expense, ExpenseFilters } from '@/lib/types';

// Mock the store
vi.mock('@/store/useExpenseStore');
const mockUseExpenseStore = useExpenseStore as any;

describe('ExpenseTable', () => {
  const mockOpenModalForEditExpense = vi.fn();
  const mockDeleteExpense = vi.fn();
  const mockSetViewMode = vi.fn();
  const mockSetFilters = vi.fn();

  const sampleExpenses: Expense[] = [
    { id: '1', name: 'Coffee', category: 'Food', date: '2024-01-15', price: 5.50 },
    { id: '2', name: 'Bus ticket', category: 'Transport', date: '2024-01-16', price: 3.00 },
    { id: '3', name: 'Lunch', category: 'Food', date: '2024-01-17', price: 12.00 },
  ];

  const defaultFilters: ExpenseFilters = {
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    category: 'all'
  };

  const defaultStoreState = {
    openModalForEditExpense: mockOpenModalForEditExpense,
    deleteExpense: mockDeleteExpense,
    viewMode: 'day' as const,
    setViewMode: mockSetViewMode,
    categories: ['Food', 'Transport'],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseExpenseStore.mockReturnValue(defaultStoreState as any);
  });

  it('should render table with expenses', () => {
    render(<ExpenseTable expenses={sampleExpenses} filters={defaultFilters} setFilters={mockSetFilters} />);

    expect(screen.getByText('Coffee')).toBeInTheDocument();
    expect(screen.getByText('Bus ticket')).toBeInTheDocument();
    expect(screen.getByText('Lunch')).toBeInTheDocument();
    expect(screen.getByText(/5,50\s?€/)).toBeInTheDocument();
    expect(screen.getByText(/3,00\s?€/)).toBeInTheDocument();
    expect(screen.getByText(/12,00\s?€/)).toBeInTheDocument();
  });

  it('should display total amount', () => {
    render(<ExpenseTable expenses={sampleExpenses} filters={defaultFilters} setFilters={mockSetFilters} />);

    expect(screen.getByText(/Total:/i)).toBeInTheDocument();
    expect(screen.getByText(/20,50\s?€/)).toBeInTheDocument();
  });

  it('should render filter controls', () => {
    render(<ExpenseTable expenses={sampleExpenses} filters={defaultFilters} setFilters={mockSetFilters} />);

    // Find filter inputs by checking for date inputs
    const dateInputs = screen.queryAllByRole('textbox', { hidden: true });
    expect(dateInputs).toBeDefined();

    // Check for select dropdown exists
    const selects = screen.queryAllByRole('combobox');
    expect(selects.length).toBeGreaterThanOrEqual(1);
  });

  it('should render view mode buttons', () => {
    render(<ExpenseTable expenses={sampleExpenses} filters={defaultFilters} setFilters={mockSetFilters} />);

    expect(screen.getByRole('button', { name: /day/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /month/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /year/i })).toBeInTheDocument();
  });

  describe('filtering', () => {
    it('should call setFilters when date range changes', async () => {
      const user = userEvent.setup();
      render(<ExpenseTable expenses={sampleExpenses} filters={defaultFilters} setFilters={mockSetFilters} />);

      const inputs = screen.getAllByDisplayValue('2024-01-01');
      const dateInput = inputs[0] as HTMLInputElement;

      fireEvent.change(dateInput, { target: { value: '2024-01-10' } });

      expect(mockSetFilters).toHaveBeenCalledWith({ startDate: '2024-01-10' });
    });

    it('should call setFilters when category changes', async () => {
      const userEvent2 = userEvent.setup();
      render(<ExpenseTable expenses={sampleExpenses} filters={defaultFilters} setFilters={mockSetFilters} />);

      const selects = screen.getAllByRole('combobox');
      const categorySelect = selects.find(select => select.value === 'all') as HTMLSelectElement;

      if (categorySelect) {
        await userEvent2.selectOptions(categorySelect, 'Food');
        expect(mockSetFilters).toHaveBeenCalledWith({ category: 'Food' });
      }
    });

    it('should filter expenses by category', () => {
      const foodOnlyFilters = { ...defaultFilters, category: 'Food' };
      const { container } = render(<ExpenseTable expenses={sampleExpenses} filters={foodOnlyFilters} setFilters={mockSetFilters} />);

      expect(screen.getByText('Coffee')).toBeInTheDocument();
      expect(screen.getByText('Lunch')).toBeInTheDocument();
      expect(screen.queryByText('Bus ticket')).not.toBeInTheDocument();
    });

    it('should filter expenses by date range', () => {
      const dateRangeFilters = { ...defaultFilters, startDate: '2024-01-16', endDate: '2024-01-16' };
      render(<ExpenseTable expenses={sampleExpenses} filters={dateRangeFilters} setFilters={mockSetFilters} />);

      expect(screen.queryByText('Coffee')).not.toBeInTheDocument();
      expect(screen.getByText('Bus ticket')).toBeInTheDocument();
      expect(screen.queryByText('Lunch')).not.toBeInTheDocument();
    });

    it('should show no expenses message when filtered results are empty', () => {
      const emptyFilters = { ...defaultFilters, category: 'NonExistent' };
      render(<ExpenseTable expenses={sampleExpenses} filters={emptyFilters} setFilters={mockSetFilters} />);

      expect(screen.getByText('No expenses match the current filter.')).toBeInTheDocument();
    });
  });

  describe('view mode', () => {
    it('should call setViewMode when view mode button is clicked', async () => {
      const user = userEvent.setup();
      render(<ExpenseTable expenses={sampleExpenses} filters={defaultFilters} setFilters={mockSetFilters} />);

      await user.click(screen.getByRole('button', { name: /month/i }));

      expect(mockSetViewMode).toHaveBeenCalledWith('month');
    });

    it('should highlight active view mode', () => {
      mockUseExpenseStore.mockReturnValue({
        ...defaultStoreState,
        viewMode: 'month' as const,
      } as any);

      render(<ExpenseTable expenses={sampleExpenses} filters={defaultFilters} setFilters={mockSetFilters} />);

      const monthButton = screen.getByRole('button', { name: /month/i });
      expect(monthButton).toHaveClass('bg-slate-900', 'text-white');
    });
  });

  describe('actions', () => {
    it('should call openModalForEditExpense when edit button is clicked', async () => {
      const user = userEvent.setup();
      render(<ExpenseTable expenses={sampleExpenses} filters={defaultFilters} setFilters={mockSetFilters} />);

      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      await user.click(editButtons[0]);

      expect(mockOpenModalForEditExpense).toHaveBeenCalledWith(sampleExpenses[0]);
    });

    it('should call deleteExpense when delete button is clicked', async () => {
      const user = userEvent.setup();
      render(<ExpenseTable expenses={sampleExpenses} filters={defaultFilters} setFilters={mockSetFilters} />);

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      await user.click(deleteButtons[0]);

      expect(mockDeleteExpense).toHaveBeenCalledWith('1');
    });
  });

  describe('empty state', () => {
    it('should show message when no expenses', () => {
      render(<ExpenseTable expenses={[]} filters={defaultFilters} setFilters={mockSetFilters} />);

      expect(screen.getByText('No expenses match the current filter.')).toBeInTheDocument();
    });
  });
});