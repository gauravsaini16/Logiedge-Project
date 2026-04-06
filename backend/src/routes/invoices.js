import express from 'express';
import pool from '../db/db.js';

const router = express.Router();

function generateInvoiceId() {
  return 'INVC' + Math.floor(100000 + Math.random() * 900000);
}

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT i.*, c.name as customer_name
       FROM invoices i
       JOIN customers c ON c.id = i.customer_id
       ORDER BY i.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/customer/:customerId', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT i.*, c.name as customer_name
       FROM invoices i
       JOIN customers c ON c.id = i.customer_id
       WHERE i.customer_id = $1
       ORDER BY i.created_at DESC`,
      [req.params.customerId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:invoiceId', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT i.*, c.name as customer_name, c.address,
              c.pan_card, c.gstin, c.gst_registered
       FROM invoices i
       JOIN customers c ON c.id = i.customer_id
       WHERE i.invoice_id = $1`,
      [req.params.invoiceId]
    );
    if (!result.rows.length)
      return res.status(404).json({ error: 'Invoice not found' });

    const items = await pool.query(
      `SELECT ii.*, it.name as item_name
       FROM invoice_items ii
       JOIN items it ON it.id = ii.item_id
       WHERE ii.invoice_id = $1`,
      [result.rows[0].id]
    );
    res.json({ ...result.rows[0], items: items.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { customer_id, items } = req.body;

    const customerResult = await pool.query(
      'SELECT * FROM customers WHERE id = $1',
      [customer_id]
    );
    const customer = customerResult.rows[0];

    const subtotal = items.reduce(
      (sum, i) => sum + i.quantity * i.unit_price, 0
    );
    const gstAmount = customer.gst_registered ? 0 : subtotal * 0.18;
    const total = subtotal + gstAmount;

    let invoiceId;
    let unique = false;
    while (!unique) {
      invoiceId = generateInvoiceId();
      const check = await pool.query(
        'SELECT id FROM invoices WHERE invoice_id = $1',
        [invoiceId]
      );
      if (check.rows.length === 0) unique = true;
    }

    const inv = await pool.query(
      `INSERT INTO invoices (invoice_id, customer_id, subtotal, gst_amount, total)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [invoiceId, customer_id, subtotal, gstAmount, total]
    );
    const invRow = inv.rows[0];

    for (const item of items) {
      await pool.query(
        `INSERT INTO invoice_items (invoice_id, item_id, quantity, unit_price, line_total)
         VALUES ($1, $2, $3, $4, $5)`,
        [invRow.id, item.item_id, item.quantity, item.unit_price,
         item.quantity * item.unit_price]
      );
    }
    res.json(invRow);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;