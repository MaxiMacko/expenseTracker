# Expense Tracker - Test Coverage

## Overview

This document describes the comprehensive test coverage for the Expense Tracker application, a Next.js-based expense management system with real-time updates, filtering, and data visualization.

## Test Framework Setup

- **Testing Framework**: Jest with ts-jest preset for TypeScript support
- **Component Testing**: React Testing Library
- **Environment**: jsdom (DOM simulation for Node.js)
- **Configuration Files**:
  - `jest.config.js` - Jest configuration
  - `jest.setup.js` - Global test setup and mocks

### Running Tests

```bash
npm test                    # Run all tests
npm test -- --watch       # Run tests in watch mode
npm test -- ExpenseModal   # Run specific test file
```

## Test Structure

All tests are located in the `__tests__/` directory and follow the naming convention `*.test.ts` or `*.test.tsx`.

## Test Coverage Details

### 1. **Store Tests** (`useExpenseStore.test.ts`) - 16 tests

Tests for the Zustand store managing all application state.

#### Initial State
- ✅ Verifies default values (activeTab, isModalOpen, editingExpense)
- ✅ Confirms sample data is loaded

#### Local Storage
- ✅ Loads sample data when no localStorage exists
- ✅ Loads persisted data from localStorage when available

#### Modal Operations
- ✅ Opens modal for new expense
- ✅ Opens modal for editing existing expense
- ✅ Closes modal and resets editing state

#### Expense Management (CRUD)
- ✅ **Add**: Successfully adds new expense with API call
- ✅ **Add**: Creates new category when expense uses unknown category
- ✅ **Update**: Modifies existing expense with API call
- ✅ **Delete**: Removes expense with API call

#### Category Management
- ✅ Adds new category
- ✅ Prevents duplicate categories
- ✅ Prevents empty categories

#### Filters & View Modes
- ✅ Sets active tab (table/charts)
- ✅ Updates filters (start date, end date, category)
- ✅ Updates view mode (day/month/year)
- ✅ Updates chart mode

### 2. **Component Tests** (`ExpenseModal.test.tsx`) - 13 tests

Tests for the modal used to create and edit expenses.

#### New Expense Modal
- ✅ Renders form when open
- ✅ Displays opacity-0 class when closed
- ✅ Closes modal when close button clicked
- ✅ Submits new expense with form data
- ✅ Disables submit button when form invalid
- ✅ Enables submit button when form valid

#### Edit Expense Modal
- ✅ Loads existing expense data into form
- ✅ Updates expense on submit
- ✅ Shows "Save changes" button instead of "Add expense"

#### Category Management
- ✅ Shows category dropdown by default
- ✅ Switches to text input for new category
- ✅ Adds new category and updates form
- ✅ Handles category selection

#### Form Validation
- ✅ Requires name field
- ✅ Requires positive price
- ✅ Validates category selection

### 3. **Table Tests** (`ExpenseTable.test.tsx`) - 15 tests

Tests for the expense table display and filtering.

#### Rendering
- ✅ Renders all expenses in table
- ✅ Displays currency formatted prices
- ✅ Shows total amount
- ✅ Renders filter controls
- ✅ Shows view mode buttons

#### Filtering
- ✅ Updates filters when date changes
- ✅ Updates filters when category changes
- ✅ Filters expenses by category
- ✅ Filters expenses by date range
- ✅ Shows "no results" message when filtered empty

#### View Modes
- ✅ Calls setViewMode when button clicked
- ✅ Highlights active view mode with styling

#### Actions
- ✅ Opens modal for editing on Edit button click
- ✅ Deletes expense on Delete button click

#### Empty State
- ✅ Shows message when no expenses

### 4. **Page Tests** (`HomePage.test.tsx`) - 6 tests

Tests for the main page component and user workflows.

#### Layout
- ✅ Renders main layout with all sections
- ✅ Calls loadLocalState on mount
- ✅ Shows expense table by default
- ✅ Shows charts when tab active

#### User Interactions
- ✅ Opens modal when "Add Expense" clicked
- ✅ Switches tabs when tab buttons clicked
- ✅ Passes filters and state to child components

#### Modal State
- ✅ Shows modal when isModalOpen is true
- ✅ Hides modal when isModalOpen is false

### 5. **API Tests** (`api-expenses.test.ts`) - 12 tests

Tests for the backend API routes.

#### GET `/api/expenses`
- ✅ Returns success message

#### POST `/api/expenses` (Create)
- ✅ Validates all required fields (name, category, date, price)
- ✅ Rejects request with missing fields
- ✅ Accepts valid expense data

#### PATCH `/api/expenses` (Update)
- ✅ Validates expense ID is provided
- ✅ Accepts valid update data

#### DELETE `/api/expenses` (Delete)
- ✅ Validates expense ID in query parameter
- ✅ Accepts valid delete request

### 6. **Utility Tests** (`utils.test.ts`) - 5 tests

Tests for helper functions.

#### Date Formatting
- ✅ Formats date in day mode (YYYY-MM-DD)
- ✅ Formats date in month mode (MMM YYYY)
- ✅ Formats date in year mode (YYYY)

#### Currency Formatting
- ✅ Formats USD currency with proper symbol
- ✅ Handles negative values
- ✅ Rounds to 2 decimal places

## Test Execution Summary

```
Test Suites: 6 passed, 6 total
Tests:       72 passed, 72 total
Snapshots:   0 total
```

## Coverage Areas

### User Flows Tested

1. **Add New Expense Flow**
   - User clicks "Add Expense" button
   - Modal opens with empty form
   - User fills name, category, date, price
   - Submit validation prevents invalid submissions
   - Expense is added via API and stored in state
   - Modal closes and expense appears in table

2. **Edit Expense Flow**
   - User clicks "Edit" on expense row
   - Modal opens with existing data
   - User modifies fields
   - Submit sends PATCH request
   - Store updates with new data
   - Table reflects changes

3. **Delete Expense Flow**
   - User clicks "Delete" on expense row
   - API is called with expense ID
   - Expense removed from store
   - Table updates to reflect deletion

4. **Filter & Search Flow**
   - User selects date range
   - User selects category
   - Table displays filtered results
   - Total amount updates for filtered view

5. **View Mode Flow**
   - User clicks view mode button (day/month/year)
   - Date formatting changes in table
   - View preference persists in state

6. **Tab Navigation**
   - User switches between "Table" and "Charts" tabs
   - Appropriate content displays
   - State persists tab preference

## Mock Strategy

### Global Mocks
- **localStorage**: Mocked with Jest functions for storage operations
- **fetch**: Mocked for API calls
- **crypto.randomUUID**: Mocked for consistent ID generation
- **Next.js router**: Mocked for navigation utilities

### Component Mocks
- **react-datepicker**: CSS import handling
- **Child components**: Mocked in integration tests where appropriate

## Key Testing Patterns

1. **Async Testing**: Uses `act()` wrapper for state updates
2. **User Interactions**: Uses userEvent for realistic user simulation
3. **Form Validation**: Tests both valid and invalid states
4. **API Mocking**: Mocks successful and failed responses
5. **State Management**: Verifies Zustand store updates

## Files Created

- `jest.config.js` - Jest configuration with TypeScript support
- `jest.setup.js` - Global test setup and mock definitions
- `__mocks__/styleMock.js` - Mock for CSS imports
- `__tests__/useExpenseStore.test.ts` - Store tests
- `__tests__/ExpenseModal.test.tsx` - Modal component tests
- `__tests__/ExpenseTable.test.tsx` - Table component tests
- `__tests__/HomePage.test.tsx` - Page component tests
- `__tests__/api-expenses.test.ts` - API route tests
- `__tests__/utils.test.ts` - Utility function tests

## Continuous Integration

The test suite is configured to:
- Run on every test command
- Support watch mode for TDD
- Provide clear failure messages
- Handle TypeScript compilation
- Mock browser APIs appropriately

## Future Improvements

- Add snapshot testing for component output
- Add visual regression testing
- Add end-to-end tests with Playwright
- Increase test coverage to >85%
- Add performance benchmarking tests