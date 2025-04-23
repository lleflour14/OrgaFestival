const express = require('express');
const router = express.Router();
const { readExcelFile, writeExcelFile } = require('../utils/excelManager');
const filePath = './data/users.xlsx';

// Ajouter ou modifier des affaires pour un utilisateur
router.put('/:id/gear', async (req, res) => {
  try {
    const { gear } = req.body;
    const users = await readExcelFile(filePath);
    const index = users.findIndex(u => u.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    users[index].gear = gear;
    await writeExcelFile(filePath, users);
    res.json(users[index]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour des affaires' });
  }
});

module.exports = router;
