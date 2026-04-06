import { NextRequest } from 'next/server';
import { GET, POST, PATCH, DELETE } from '@/app/api/expenses/route';

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, options) => ({ data, options })),
  },
}));

describe('/api/expenses', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return success message', async () => {
      const response = await GET();

      expect(response.data).toEqual({
        ok: true,
        message: 'Client storage is the source of truth.'
      });
    });
  });

  describe('POST', () => {
    it('should validate required fields', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({}),
      } as unknown as NextRequest;

      const response = await POST(mockRequest);

      expect(response.data).toEqual({
        ok: false,
        error: 'Missing required fields'
      });
      expect(response.options).toEqual({ status: 400 });
    });

    it('should validate name field', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          category: 'Food',
          date: '2024-01-01',
          price: 10
        }),
      } as unknown as NextRequest;

      const response = await POST(mockRequest);

      expect(response.data).toEqual({
        ok: false,
        error: 'Missing required fields'
      });
      expect(response.options).toEqual({ status: 400 });
    });

    it('should validate category field', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          name: 'Coffee',
          date: '2024-01-01',
          price: 10
        }),
      } as unknown as NextRequest;

      const response = await POST(mockRequest);

      expect(response.data).toEqual({
        ok: false,
        error: 'Missing required fields'
      });
      expect(response.options).toEqual({ status: 400 });
    });

    it('should validate date field', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          name: 'Coffee',
          category: 'Food',
          price: 10
        }),
      } as unknown as NextRequest;

      const response = await POST(mockRequest);

      expect(response.data).toEqual({
        ok: false,
        error: 'Missing required fields'
      });
      expect(response.options).toEqual({ status: 400 });
    });

    it('should validate price field', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          name: 'Coffee',
          category: 'Food',
          date: '2024-01-01'
        }),
      } as unknown as NextRequest;

      const response = await POST(mockRequest);

      expect(response.data).toEqual({
        ok: false,
        error: 'Missing required fields'
      });
      expect(response.options).toEqual({ status: 400 });
    });

    it('should accept valid expense data', async () => {
      const expenseData = {
        name: 'Coffee',
        category: 'Food',
        date: '2024-01-01',
        price: 5.50
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(expenseData),
      } as unknown as NextRequest;

      const response = await POST(mockRequest);

      expect(response.data).toEqual({
        ok: true,
        message: 'Expense create validated.',
        item: expenseData
      });
    });
  });

  describe('PATCH', () => {
    it('should validate expense ID', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({}),
      } as unknown as NextRequest;

      const response = await PATCH(mockRequest);

      expect(response.data).toEqual({
        ok: false,
        error: 'Missing expense ID'
      });
      expect(response.options).toEqual({ status: 400 });
    });

    it('should accept valid update data', async () => {
      const updateData = {
        id: '123',
        name: 'Updated Coffee',
        category: 'Food',
        date: '2024-01-01',
        price: 6.00
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(updateData),
      } as unknown as NextRequest;

      const response = await PATCH(mockRequest);

      expect(response.data).toEqual({
        ok: true,
        message: 'Expense update validated.',
        item: updateData
      });
    });
  });

  describe('DELETE', () => {
    it('should validate expense ID in query params', async () => {
      const mockRequest = {
        url: 'http://localhost/api/expenses',
      } as NextRequest;

      const response = await DELETE(mockRequest);

      expect(response.data).toEqual({
        ok: false,
        error: 'Missing expense ID'
      });
      expect(response.options).toEqual({ status: 400 });
    });

    it('should accept valid delete request', async () => {
      const mockRequest = {
        url: 'http://localhost/api/expenses?id=123',
      } as NextRequest;

      const response = await DELETE(mockRequest);

      expect(response.data).toEqual({
        ok: true,
        message: 'Expense delete validated.',
        id: '123'
      });
    });
  });
});