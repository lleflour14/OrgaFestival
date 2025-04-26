const express = require('express');
const router = express.Router();
const { readExcelFile } = require('../utils/excelManager');
const path = require('path');
const filePath = path.join(__dirname, '..', 'users.xlsx');

// GET /api/transactions
router.get('/', async (req, res) => {
  try {
    const users = await readExcelFile(filePath);
    const allTransactions = users.flatMap(user => user.transactions || []);
    res.json(allTransactions);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du chargement des transactions.' });
  }
});

module.exports = router;
