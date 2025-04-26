const express = require('express');
const router = express.Router();
const { readExcelFile } = require('../utils/excelManager');;
const path = require('path');
const filePath = path.join(__dirname, '..', 'users.xlsx');

router.get('/', async (req, res) => {
  try {
    const data = await readExcelFile(filePath);
    const groupedGears = {};

    data.forEach(user => {
      if (Array.isArray(user.gear)) {
        user.gear.forEach(g => {
          if (g.item && g.quantity) {
            if (!groupedGears[user.surname]) {
              groupedGears[user.surname] = [];
            }
            groupedGears[user.surname].push(`${g.item} x${g.quantity}`);
          }
        });
      }
    });

    res.json({ groupedGears });
  } catch (error) {
    console.error('Erreur lecture gear:', error);
    res.status(500).json({ error: 'Impossible de lire les affaires' });
  }
});


module.exports = router;
