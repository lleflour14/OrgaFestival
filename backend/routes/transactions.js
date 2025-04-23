const express = require('express');
const router = express.Router();
const { readExcelFile, writeExcelFile } = require('../utils/excelManager');
const path = require('path');
const filePath = path.join(__dirname, '..', 'users.xlsx');

// 🟢 Récupérer les transactions d’un utilisateur
router.get('/:id/transactions', async (req, res) => {
  try {
    const userId = req.params.id;
    const users = await readExcelFile(filePath);
    const user = users.find(u => String(u.id) === String(userId));
    
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    res.json(user.transactions || []);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la lecture des transactions' });
  }
});

// 🟢 Ajouter une transaction avec partages et remboursements
router.post('/:id/transactions', async (req, res) => {
  try {
    const { payer, amount, description, beneficiaries } = req.body;

    if (!payer || !amount || !description || !Array.isArray(beneficiaries) || beneficiaries.length === 0) {
      return res.status(400).json({ error: 'Données incomplètes pour créer la transaction.' });
    }

    const users = await readExcelFile(filePath);
    const payerIndex = users.findIndex(u => String(u.id) === String(req.params.id));
    if (payerIndex === -1) return res.status(404).json({ message: 'Payeur non trouvé' });

    const amountPerPerson = (parseFloat(amount) / beneficiaries.length).toFixed(2);

    const transaction = {
      id: Date.now().toString(),
      payer,
      amount: parseFloat(amount),
      description,
      repayments: beneficiaries.map(userId => ({
        userId,
        amount: parseFloat(amountPerPerson),
        paid: false
      }))
    };

    // Ajouter la transaction au payeur
    users[payerIndex].transactions = users[payerIndex].transactions || [];
    users[payerIndex].transactions.push(transaction);

    // Ajouter une transaction visible chez chaque bénéficiaire
    for (const beneficiaryId of beneficiaries) {
      const beneficiaryIndex = users.findIndex(u => String(u.id) === String(beneficiaryId));
      if (beneficiaryIndex !== -1) {
        users[beneficiaryIndex].transactions = users[beneficiaryIndex].transactions || [];
        users[beneficiaryIndex].transactions.push({
          id: transaction.id,
          payer,
          amount: parseFloat(amountPerPerson),
          description,
          repayTo: req.params.id, // ID du payeur
          paid: false
        });
      }
    }

    await writeExcelFile(filePath, users);
    res.status(201).json(transaction);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de l\'ajout de la transaction' });
  }
});

router.delete('/:id/transactions/:transactionId', async (req, res) => {
  try {
    const { id, transactionId } = req.params;
    const users = await readExcelFile(filePath);

    const user = users.find(u => u.id.toString() === id.toString());
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    user.transactions = (user.transactions || []).filter(
      t => t.id.toString() !== transactionId.toString()
    );
    await writeExcelFile(filePath, users);
    res.json({ message: 'Transaction supprimée' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});




module.exports = router;
