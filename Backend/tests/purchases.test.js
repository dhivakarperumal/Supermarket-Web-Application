const request = require('supertest');
const express = require('express');

// We don't want to spin up the actual app because it connects to the real DB.
// Instead we mock the DB, and import the router directly.
const mockPool = {
  query: jest.fn(),
  getConnection: jest.fn()
};

jest.mock('../src/config/db', () => ({
  pool: mockPool,
  getPool: () => mockPool
}));

const { getPool } = require('../src/config/db');
const pool = getPool();
const purchaseRoutes = require('../src/routers/purchaseRoutes');

const app = express();
app.use(express.json());
app.use('/api/purchases', purchaseRoutes);

describe('Purchase Management API Tests', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/purchases/dashboard/stats', () => {
    it('should return dashboard stats successfully', async () => {
      pool.query.mockResolvedValue([[{ val: 1000, cnt: 5 }]]); // mock all stats queries to return a basic object
      pool.query.mockResolvedValueOnce([[{ val: 5000, cnt: 1 }]]); // today
      pool.query.mockResolvedValueOnce([[{ val: 15000, cnt: 3 }]]); // week
      pool.query.mockResolvedValueOnce([[{ val: 50000, cnt: 10 }]]); // month
      pool.query.mockResolvedValueOnce([[{ val: 500000, cnt: 100 }]]); // overall
      pool.query.mockResolvedValueOnce([[{ cnt: 5 }]]); // pending orders
      pool.query.mockResolvedValueOnce([[{ val: 20000 }]]); // outstanding
      pool.query.mockResolvedValueOnce([[{ cnt: 10 }]]); // suppliers
      pool.query.mockResolvedValueOnce([[{ cnt: 2, val: 500 }]]); // returns
      pool.query.mockResolvedValueOnce([[{ val: 4000 }]]); // paid
      pool.query.mockResolvedValueOnce([[{ val: 1000 }]]); // unpaid
      pool.query.mockResolvedValueOnce([[{ month: 'Jan 2026', total: 1000, count: 1 }]]); // monthly trend
      pool.query.mockResolvedValueOnce([[{ name: 'Supplier A', value: 1000 }]]); // supplier wise
      pool.query.mockResolvedValueOnce([[{ name: 'Product A', qty: 10, value: 1000 }]]); // top products

      const res = await request(app).get('/api/purchases/dashboard/stats');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.stats.today.amount).toBe(5000);
      expect(res.body.stats.week.amount).toBe(15000);
      expect(res.body.stats.pendingPOs).toBe(5);
    });
  });

  describe('GET /api/purchases/suppliers', () => {
    it('should return a list of suppliers', async () => {
      const mockSuppliers = [
        { id: 1, supplier_name: 'Supplier A', status: 'Active' },
        { id: 2, supplier_name: 'Supplier B', status: 'Inactive' }
      ];
      pool.query.mockResolvedValueOnce([mockSuppliers]);

      const res = await request(app).get('/api/purchases/suppliers');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.suppliers).toHaveLength(2);
      expect(res.body.suppliers[0].supplier_name).toBe('Supplier A');
    });
  });

  describe('POST /api/purchases/suppliers', () => {
    it('should create a new supplier', async () => {
      const newSupplier = {
        supplier_name: 'Supplier C',
        contact_person: 'John Doe',
        phone: '1234567890'
      };

      pool.query.mockResolvedValueOnce([{ insertId: 3 }]);

      const res = await request(app).post('/api/purchases/suppliers').send(newSupplier);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('added successfully');
      expect(res.body.id).toBe(3);
    });
  });

  describe('GET /api/purchases/orders', () => {
    it('should fetch purchase orders', async () => {
      pool.query.mockResolvedValueOnce([[{ id: 1, po_number: 'PO-001', status: 'Pending' }]]);
      const res = await request(app).get('/api/purchases/orders');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.orders[0].po_number).toBe('PO-001');
    });
  });

  describe('POST /api/purchases/orders', () => {
    it('should create a new purchase order', async () => {
      pool.query.mockResolvedValueOnce([[{ count: 0 }]]); // Count mock for PO number generation
      pool.query.mockResolvedValueOnce([{ insertId: 1 }]); // Insert PO
      
      const res = await request(app).post('/api/purchases/orders').send({
        supplier_id: 1,
        expected_delivery_date: '2026-12-31'
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.po_number).toContain('PO-');
    });
  });

});
