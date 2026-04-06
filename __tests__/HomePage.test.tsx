import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from '@/app/page';
import useExpenseStore from '@/store/useExpenseStore';

// Mock the store
jest.mock('@/store/useExpenseStore');
const mockUseExpenseStore = useExpenseStore as jest.MockedFunction<typeof useExpenseStore>;

// Mock components
jest.mock('@/components/ExpenseModal', () => {
  return function MockExpenseModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    return open ? <div data-testid="expense-modal">Expense Modal</div> : null;
  };
});

jest.mock('@/components/ExpenseTable', () => {
  return function MockExpenseTable({ expenses, filters, setFilters }: any) {
    return (
      <div data-testid="expense-table">
        <div>Expenses: {expenses.length}</div>
        <button onClick={() => setFilters({ category: 'Food' })}>Filter Food</button>
      </div>
    );
  };
});

jest.mock('@/components/ChartsTab', () => {
  return function MockChartsTab() {
    return <div data-testid="charts-tab">Charts Tab</div>;
  };
});

jest.mock('@/components/Toolbar', () => {
  return function MockToolbar({ onAddExpense }: { onAddExpense: () => void }) {
    return (
      <div data-testid="toolbar">
        <button onClick={onAddExpense}>Add Expense</button>
      </div>
    );
  };
});

jest.mock('@/components/TabSwitcher', () => {
  return function MockTabSwitcher({ activeTab, setActiveTab }: any) {
    return (
      <div data-testid="tab-switcher">
        <button onClick={() => setActiveTab('table')}>Table</button>
        <button onClick={() => setActiveTab('charts')}>Charts</button>
        <div>Active: {activeTab}</div>
      </div>
    );
  };
});

describe('HomePage', () => {
  const mockLoadLocalState = jest.fn();
  const mockOpenModalForNewExpense = jest.fn();
  const mockCloseModal = jest.fn();
  const mockSetFilters = jest.fn();
  const mockSetActiveTab = jest.fn();

  const defaultStoreState = {
    activeTab: 'table' as const,
    loadLocalState: mockLoadLocalState,
    isModalOpen: false,
    closeModal: mockCloseModal,
    openModalForNewExpense: mockOpenModalForNewExpense,
    expenses: [
      { id: '1', name: 'Coffee', category: 'Food', date: '2024-01-01', price: 5.50 }
    ],
    filters: {
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      category: 'all'
    },
    setFilters: mockSetFilters,
    setActiveTab: mockSetActiveTab
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseExpenseStore.mockReturnValue(defaultStoreState as any);
  });

  it('should render main layout', () => {
    render(<HomePage />);

    expect(screen.getByTestId('toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('tab-switcher')).toBeInTheDocument();
    expect(screen.getByTestId('expense-table')).toBeInTheDocument();
    expect(screen.queryByTestId('charts-tab')).not.toBeInTheDocument();
  });

  it('should call loadLocalState on mount', () => {
    render(<HomePage />);

    expect(mockLoadLocalState).toHaveBeenCalledTimes(1);
  });

  it('should show expense table by default', () => {
    render(<HomePage />);

    expect(screen.getByTestId('expense-table')).toBeInTheDocument();
    expect(screen.getByText('Expenses: 1')).toBeInTheDocument();
  });

  it('should show charts tab when active tab is charts', () => {
    mockUseExpenseStore.mockReturnValue({
      ...defaultStoreState,
      activeTab: 'charts' as const,
    } as any);

    render(<HomePage />);

    expect(screen.queryByTestId('expense-table')).not.toBeInTheDocument();
    expect(screen.getByTestId('charts-tab')).toBeInTheDocument();
  });

  describe('toolbar interactions', () => {
    it('should call openModalForNewExpense when add expense button is clicked', async () => {
      const user = userEvent.setup();
      render(<HomePage />);

      await user.click(screen.getByRole('button', { name: /add expense/i }));

      expect(mockOpenModalForNewExpense).toHaveBeenCalledTimes(1);
    });
  });

  describe('tab switching', () => {
    it('should call setActiveTab when table tab is clicked', async () => {
      const user = userEvent.setup();
      render(<HomePage />);

      const tableButton = screen.getByRole('button', { name: /table/i });
      await user.click(tableButton);

      expect(mockSetActiveTab).toHaveBeenCalledWith('table');
    });

    it('should call setActiveTab when charts tab is clicked', async () => {
      const user = userEvent.setup();
      render(<HomePage />);

      const chartsButton = screen.getByRole('button', { name: /charts/i });
      await user.click(chartsButton);

      expect(mockSetActiveTab).toHaveBeenCalledWith('charts');
    });
  });

  describe('modal state', () => {
    it('should show modal when isModalOpen is true', () => {
      mockUseExpenseStore.mockReturnValue({
        ...defaultStoreState,
        isModalOpen: true,
      } as any);

      render(<HomePage />);

      expect(screen.getByTestId('expense-modal')).toBeInTheDocument();
    });

    it('should not show modal when isModalOpen is false', () => {
      render(<HomePage />);

      expect(screen.queryByTestId('expense-modal')).not.toBeInTheDocument();
    });
  });

  describe('filtering', () => {
    it('should pass filters to ExpenseTable', () => {
      render(<HomePage />);

      expect(screen.getByText('Expenses: 1')).toBeInTheDocument();
    });

    it('should call setFilters when table filter changes', async () => {
      const user = userEvent.setup();
      render(<HomePage />);

      await user.click(screen.getByRole('button', { name: /filter food/i }));

      expect(mockSetFilters).toHaveBeenCalledWith({ category: 'Food' });
    });
  });
});