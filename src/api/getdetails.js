const express = require('express');
const { Pool } = require('pg');
 const { db } = require('../config/dbConfig');

const app = express();
const PORT = 3000;
 
const pool = new Pool(db)
 
app.get('/api/mapper', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "mapper" order by id asc');
    res.json(result.rows);
  } catch (err) {
    console.error('Error querying database:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
 
app.get('/api/mapper/state/:state_id', async (req, res) => {
  const stateId = req.params.state_id;
  try {
    const result = await pool.query('SELECT * FROM "mapper" WHERE state_id = $1', [stateId]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error querying database by state_id:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
 
// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});