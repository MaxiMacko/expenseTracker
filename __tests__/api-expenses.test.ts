import { NextRequest } from 'next/server';
import { GET, POST, PATCH, DELETE } from '@/app/api/expenses/route';
import { prisma } from '@/lib/prisma';

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, options) => ({ data, options }))
  }
}));

jest.mock('@/lib/prisma', () => ({
  prisma: {
    expense: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }
  }
}));

const mockedPrisma = prisma as unknown as {
  expense: {
    findMany: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
};

describe('/api/expenses', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return expenses from the database', async () => {
      mockedPrisma.expense.findMany.mockResolvedValueOnce([
        {
          id: '1',
          name: 'Coffee',
          category: 'Food',
          date: new Date('2024-01-01'),
          price: 5.5
        }
      ]);

      const response = await GET();

      expect(response.data).toEqual({
        ok: true,
        expenses: [
          {
            id: '1',
            name: 'Coffee',
            category: 'Food',
            date: '2024-01-01',
            price: 5.5
          }
        ]
      });
    });
  });

  describe('POST', () => {
    it('should validate required fields', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({})
      } as unknown as NextRequest;

      const response = await POST(mockRequest);

      expect(response.data).toEqual({ ok: false, error: 'Missing required fields' });
      expect(response.options).toEqual({ status: 400 });
    });

    it('should accept valid expense data', async () => {
      const expenseData = {
        name: 'Coffee',
        category: 'Food',
        date: '2024-01-01',
        price: 5.5
      };

      mockedPrisma.expense.create.mockResolvedValueOnce({
        id: '1',
        name: expenseData.name,
        category: expenseData.category,
        date: new Date(expenseData.date),
        price: expenseData.price
      });

      const mockRequest = {
        json: jest.fn().mockResolvedValue(expenseData)
      } as unknown as NextRequest;

      const response = await POST(mockRequest);

      expect(response.data).toEqual({
        ok: true,
        message: 'Expense created successfully.',
        item: {
          id: '1',
          name: 'Coffee',
          category: 'Food',
          date: '2024-01-01',
          price: 5.5
        }
      });
    });
  });

  describe('PATCH', () => {
    it('should validate expense ID', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({})
      } as unknown as NextRequest;

      const response = await PATCH(mockRequest);

      expect(response.data).toEqual({ ok: false, error: 'Missing expense ID' });
      expect(response.options).toEqual({ status: 400 });
    });

    it('should accept valid update data', async () => {
      const updateData = {
        id: '123',
        name: 'Updated Coffee',
        category: 'Food',
        date: '2024-01-01',
        price: 6.0
      };

      mockedPrisma.expense.update.mockResolvedValueOnce({
        id: '123',
        name: 'Updated Coffee',
        category: 'Food',
        date: new Date('2024-01-01'),
        price: 6.0
      });

      const mockRequest = {
        json: jest.fn().mockResolvedValue(updateData)
      } as unknown as NextRequest;

      const response = await PATCH(mockRequest);

      expect(response.data).toEqual({
        ok: true,
        message: 'Expense updated successfully.',
        item: {
          id: '123',
          name: 'Updated Coffee',
          category: 'Food',
          date: '2024-01-01',
          price: 6.0
        }
      });
    });
  });

  describe('DELETE', () => {
    it('should validate expense ID in query params', async () => {
      const mockRequest = {
        url: 'http://localhost/api/expenses'
      } as NextRequest;

      const response = await DELETE(mockRequest);

      expect(response.data).toEqual({ ok: false, error: 'Missing expense ID' });
      expect(response.options).toEqual({ status: 400 });
    });

    it('should accept valid delete request', async () => {
      mockedPrisma.expense.delete.mockResolvedValueOnce({});
      const mockRequest = {
        url: 'http://localhost/api/expenses?id=123'
      } as NextRequest;

      const response = await DELETE(mockRequest);

      expect(response.data).toEqual({ ok: true, message: 'Expense deleted successfully.', id: '123' });
    });
  });
});
