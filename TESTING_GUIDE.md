# Expense Tracker - Test Quick Start Guide

## 🎯 Quick Summary

**72 tests** have been implemented covering all major user flows in the Expense Tracker application:

- ✅ Store management (state & persistence)
- ✅ Component rendering & interactions  
- ✅ Form validation & submission
- ✅ Filtering & search
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ API routes
- ✅ Utility functions

## 🚀 Running Tests

### Run all tests once:
```bash
npm test
```

### Run tests in watch mode (recommended for development):
```bash
npm test:watch
```

### Run specific test suite:
```bash
npm test -- useExpenseStore     # Store tests
npm test -- ExpenseModal         # Modal tests
npm test -- ExpenseTable         # Table tests
npm test -- HomePage             # Page tests
npm test -- api-expenses         # API tests
npm test -- utils                # Utility tests
```

### Show test coverage:
```bash
npm test -- --coverage
```

## 📋 What's Tested

### 1. **State Management** (16 tests)
- Loading and persisting data
- Adding, updating, deleting expenses
- Category management
- Filter and view preferences

### 2. **Expense Creation** (13 tests)
- Form rendering
- Field validation
- Category creation
- Submit handling

### 3. **Expense Viewing** (15 tests)
- Table rendering
- Filtering by date and category
- View mode switching
- Edit/delete actions

### 4. **Page Integration** (6 tests)
- Layout structure
- Tab switching
- Modal state
- Component interactions

### 5. **API Validation** (12 tests)
- Create endpoint (POST)
- Update endpoint (PATCH)
- Delete endpoint (DELETE)
- Request validation

### 6. **Utilities** (5 tests)
- Date formatting
- Currency formatting

## 📁 Test Files Location

```
__tests__/
├── HomePage.test.tsx              # Main page tests
├── ExpenseModal.test.tsx           # Add/edit modal tests
├── ExpenseTable.test.tsx           # Table & filtering tests
├── useExpenseStore.test.ts         # State management tests
├── api-expenses.test.ts            # API route tests
└── utils.test.ts                   # Utility function tests
```

## 🔧 Configuration Files

- `jest.config.js` - Jest configuration
- `jest.setup.js` - Global test setup
- `__mocks__/styleMock.js` - CSS mock

## ✅ All Tests Pass

```
Test Suites: 6 passed, 6 total
Tests:       72 passed, 72 total
```

## 🎓 User Flows Covered

1. **Add New Expense** → Form validation → API submission → Appears in table ✅
2. **Edit Expense** → Load existing data → Modify → Save → Updates reflect ✅  
3. **Delete Expense** → Click delete → API call → Removed from view ✅
4. **Filter Expenses** → By date range → By category → Table updates ✅
5. **Switch Views** → Day/month/year mode → Date formatting changes ✅
6. **Navigate Tabs** → Table ↔ Charts → Content switches ✅

## 📖 For More Details

See `TEST_COVERAGE.md` for comprehensive documentation of all test cases.

## 🛠️ Common Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests once |
| `npm test:watch` | Run tests in watch mode |
| `npm test -- --coverage` | Show coverage report |
| `npm test -- Modal` | Run specific suite |
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |