import express from 'express';
import pool from '../db/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM customers ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, address, pan_card, gstin, gst_registered, status } = req.body;
    const result = await pool.query(
      `INSERT INTO customers (name, address, pan_card, gstin, gst_registered, status)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, address, pan_card, gstin, gst_registered, status]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;