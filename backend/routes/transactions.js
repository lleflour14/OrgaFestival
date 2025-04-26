const express = require('express');
const router = express.Router();
const { readExcelFile, writeExcelFile } = require('../utils/excelManager');
const path = require('path');
const filePath = path.join(__dirname, '..', 'users.xlsx');

router.get('/', async (req, res) => {
  try {
    const users = await readExcelFile(filePath);
    const allTransactions = users.flatMap(user => user.transactions || []);
    res.json(allTransactions);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du chargement des transactions.' });
  }
});

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

    // Ajouter une transaction visible chez chaque bénéficiaire
    for (const beneficiaryId of beneficiaries) {
      const beneficiaryIndex = users.findIndex(u => String(u.surname) === String(beneficiaryId));
      if (beneficiaryIndex !== -1) {
        users[beneficiaryIndex].transactions = users[beneficiaryIndex].transactions || [];
        users[beneficiaryIndex].transactions.push({
          transactionId: transaction.id,  // 🔁 pour correspondre au format attendu
          payer,
          amount: parseFloat(amountPerPerson),
          description,
          repayments: [
            {
              userId: beneficiaryId,
              amount: parseFloat(amountPerPerson),
              paid: false
            }
          ],
          paid: false
        });
        console.log(users[beneficiaryIndex].transactions)
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
      t => String(t.id) !== String(transactionId)
    );
    await writeExcelFile(filePath, users);
    res.json({ message: 'Transaction supprimée' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

router.patch('/:id/transactions/:transactionId', async (req, res) => {
  try {
    const { id, transactionId } = req.params;
    const { paid } = req.body; // true ou false
    const users = await readExcelFile(filePath);

    const user = users.find(u => String(u.id) === String(id));
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    if (user.transactions) {
      const transaction = user.transactions.find(
        t => (t.id || t.transactionId) === transactionId
      );
      if (transaction) {
        transaction.paid = paid;
        await writeExcelFile(filePath, users);
        return res.json({ message: 'Statut mis à jour' });
      }
    }

    res.status(404).json({ error: 'Transaction non trouvée' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
});



module.exports = router;
