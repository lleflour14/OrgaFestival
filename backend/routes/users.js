const express = require('express');
const router = express.Router();
const { readExcelFile, writeExcelFile } = require('../utils/excelManager');;
const path = require('path');
const filePath = path.join(__dirname, '..', 'users.xlsx');

router.get('/', async (req, res) => {
  try {
    const data = await readExcelFile(filePath);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la lecture' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const data = await readExcelFile(filePath);
    const user = data.find(u => u.id == req.params.id);
    user ? res.json(user) : res.status(404).json({ message: 'Utilisateur non trouvé' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/', async (req, res) => {
  try {
    const users = await readExcelFile(filePath);
    const newUser = { id: Date.now().toString(), ...req.body, transactions: [] };
    users.push(newUser);
    await writeExcelFile(filePath, users);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedData = req.body;

    let users = await readExcelFile(filePath);
    const index = users.findIndex(u => String(u.id) === userId);

    if (index === -1) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    users[index] = { ...users[index], ...updatedData };
    
    await writeExcelFile(filePath, users);
    res.json({ message: 'Utilisateur mis à jour', user: users[index] });
  } catch (err) {
    console.error('❌ Erreur PUT utilisateur :', err);
    res.status(500).json({ error: 'Erreur serveur lors de la mise à jour' });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id; // ne parse pas en int
    console.log("🔍 Suppression de l'utilisateur avec l'id :", userId);

    let users = await readExcelFile(filePath);
    users = users.filter(u => String(u.id) !== userId); // compare en string

    await writeExcelFile(filePath, users);
    res.status(204).send();
  } catch (err) {
    console.error("❌ Erreur lors de la suppression de l'utilisateur :", err);
    res.status(500).json({ error: "Erreur serveur lors de la suppression" });
  }
});




module.exports = router;
