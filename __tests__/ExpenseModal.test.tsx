import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExpenseModal from '@/components/ExpenseModal';
import useExpenseStore from '@/store/useExpenseStore';
import type { Expense } from '@/lib/types';

// Mock the store
jest.mock('@/store/useExpenseStore');
const mockUseExpenseStore = useExpenseStore as jest.MockedFunction<typeof useExpenseStore>;

// Mock date picker
jest.mock('react-datepicker', () => {
  return ({ selected, onChange, dateFormat, className }: any) => (
    <input
      type="date"
      value={selected ? selected.toISOString().slice(0, 10) : ''}
      onChange={(e) => onChange(new Date(e.target.value))}
      className={className}
      data-testid="date-picker"
    />
  );
});

describe('ExpenseModal', () => {
  const mockAddExpense = jest.fn();
  const mockUpdateExpense = jest.fn();
  const mockAddCategory = jest.fn();
  const mockOnClose = jest.fn();

  const defaultStoreState = {
    editingExpense: null,
    addExpense: mockAddExpense,
    updateExpense: mockUpdateExpense,
    categories: ['Food', 'Transport'],
    addCategory: mockAddCategory,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseExpenseStore.mockReturnValue(defaultStoreState as any);
  });

  describe('new expense modal', () => {
    it('should render modal when open', () => {
      render(<ExpenseModal open={true} onClose={mockOnClose} />);

      expect(screen.getByText('New expense')).toBeInTheDocument();
      expect(screen.getByText('Add a new expense')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Expense name')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Food')).toBeInTheDocument();
      expect(screen.getByTestId('date-picker')).toBeInTheDocument();
      expect(screen.getByDisplayValue('0')).toBeInTheDocument();
    });

    it('should not render when closed', () => {
      const { container } = render(<ExpenseModal open={false} onClose={mockOnClose} />);

      const modal = container.querySelector('[class*="opacity-0"]');
      expect(modal).toBeInTheDocument();
      expect(modal).toHaveClass('opacity-0');
    });

    it('should call onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      render(<ExpenseModal open={true} onClose={mockOnClose} />);

      await user.click(screen.getByRole('button', { name: /close/i }));

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should add expense when form is submitted', async () => {
      const user = userEvent.setup();
      mockAddExpense.mockResolvedValue(undefined);

      render(<ExpenseModal open={true} onClose={mockOnClose} />);

      await user.type(screen.getByPlaceholderText('Expense name'), 'Coffee');
      const priceInput = screen.getByDisplayValue('0');
      await user.clear(priceInput);
      await user.type(priceInput, '5.50');
      await user.click(screen.getByRole('button', { name: /add expense/i }));

      await waitFor(() => {
        expect(mockAddExpense).toHaveBeenCalledWith({
          id: expect.any(String),
          name: 'Coffee',
          category: 'Food',
          date: expect.any(String),
          price: 5.5
        });
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      });
    });

    it('should disable submit button when form is invalid', () => {
      render(<ExpenseModal open={true} onClose={mockOnClose} />);

      const submitButton = screen.getByRole('button', { name: /add expense/i });
      expect(submitButton).toBeDisabled();
    });

    it('should enable submit button when form is valid', async () => {
      const user = userEvent.setup();
      render(<ExpenseModal open={true} onClose={mockOnClose} />);

      await user.type(screen.getByPlaceholderText('Expense name'), 'Coffee');
      const priceInput = screen.getByDisplayValue('0');
      await user.clear(priceInput);
      await user.type(priceInput, '5.50');

      const submitButton = screen.getByRole('button', { name: /add expense/i });
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('edit expense modal', () => {
    const editingExpense: Expense = {
      id: '1',
      name: 'Existing Coffee',
      category: 'Food',
      date: '2024-01-01',
      price: 4.50
    };

    beforeEach(() => {
      mockUseExpenseStore.mockReturnValue({
        ...defaultStoreState,
        editingExpense,
      } as any);
    });

    it('should render edit modal with existing data', () => {
      render(<ExpenseModal open={true} onClose={mockOnClose} />);

      expect(screen.getByText('Edit expense')).toBeInTheDocument();
      expect(screen.getByText('Update expense item')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Existing Coffee')).toBeInTheDocument();
      expect(screen.getByDisplayValue('4.5')).toBeInTheDocument();
    });

    it('should update expense when form is submitted', async () => {
      const user = userEvent.setup();
      mockUpdateExpense.mockResolvedValue(undefined);

      render(<ExpenseModal open={true} onClose={mockOnClose} />);

      await user.clear(screen.getByDisplayValue('Existing Coffee'));
      await user.type(screen.getByDisplayValue(''), 'Latte');
      const priceInput = screen.getByDisplayValue('4.5');
      await user.clear(priceInput);
      await user.type(priceInput, '6.00');
      await user.click(screen.getByRole('button', { name: /save changes/i }));

      await waitFor(() => {
        expect(mockUpdateExpense).toHaveBeenCalledWith({
          id: '1',
          name: 'Latte',
          category: 'Food',
          date: expect.any(String),
          price: 6
        });
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('category management', () => {
    it('should show category dropdown by default', () => {
      render(<ExpenseModal open={true} onClose={mockOnClose} />);

      expect(screen.getByDisplayValue('Food')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add new/i })).toBeInTheDocument();
    });

    it('should switch to text input for new category', async () => {
      const user = userEvent.setup();
      render(<ExpenseModal open={true} onClose={mockOnClose} />);

      await user.click(screen.getByRole('button', { name: /add new/i }));

      expect(screen.getByPlaceholderText('New category')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /save category/i })).toBeInTheDocument();
    });

    it('should add new category and switch back to dropdown', async () => {
      const user = userEvent.setup();
      render(<ExpenseModal open={true} onClose={mockOnClose} />);

      await user.click(screen.getByRole('button', { name: /add new/i }));
      await user.type(screen.getByPlaceholderText('New category'), 'Entertainment');
      await user.click(screen.getByRole('button', { name: /save category/i }));

      expect(mockAddCategory).toHaveBeenCalledWith('Entertainment');
      expect(screen.getByDisplayValue('Entertainment')).toBeInTheDocument();
    });
  });

  describe('form validation', () => {
    it('should require name', async () => {
      const user = userEvent.setup();
      render(<ExpenseModal open={true} onClose={mockOnClose} />);

      const priceInput = screen.getByDisplayValue('0');
      await user.clear(priceInput);
      await user.type(priceInput, '5.50');

      expect(screen.getByRole('button', { name: /add expense/i })).toBeDisabled();
    });

    it('should require positive price', async () => {
      const user = userEvent.setup();
      render(<ExpenseModal open={true} onClose={mockOnClose} />);

      await user.type(screen.getByPlaceholderText('Expense name'), 'Coffee');

      expect(screen.getByRole('button', { name: /add expense/i })).toBeDisabled();
    });
  });
});