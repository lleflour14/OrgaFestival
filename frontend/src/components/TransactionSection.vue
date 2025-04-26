<template>
  <div class="transactions-section">
    <label><strong>Nouvelle transaction : </strong></label>

    <!-- Formulaire pour ajouter une nouvelle transaction -->
    <form @submit.prevent="addTransaction">
      <!-- Le payeur est l'utilisateur actuel (surname) -->
      <input :value="user.surname" disabled />

      <input v-model="newTransaction.amount" type="number" placeholder="Montant total" required />
      <input v-model="newTransaction.for" placeholder="Objet de la dépense" required />
      <div>Qui participe ?</div>
      <div class="checkbox-group">
        <label v-for="(user, idx) in users" :key="idx">
          <input type="checkbox" :value="user.surname" v-model="newTransaction.repayUsers" />
          {{ user.surname }}
        </label>
      </div>

      <button type="submit">Ajouter</button>
    </form>
  </div>
</template>

<script>
export default {
  props: ['transactions', 'users', 'user'], 

  data() {
    return {
      newTransaction: {
        payer: this.user ? this.user.surname : '',
        amount: '',
        for: '',
        repayUsers: []
      }
    };
  },

  methods: {
    addTransaction() {
      const amount = parseFloat(this.newTransaction.amount);
      if (isNaN(amount) || this.newTransaction.repayUsers.length === 0) {
        alert("Montant invalide ou aucun utilisateur sélectionné");
        return;
      }

      const amountPerUser = parseFloat((amount / this.newTransaction.repayUsers.length).toFixed(2));

      const repayments = this.newTransaction.repayUsers.map(user => ({
        user,
        amount: amountPerUser,
        paid: user === this.user.surname
      }));

      const transaction = {
  payer: this.user.surname,
  amount: amount,
  description: this.newTransaction.for,
  beneficiaries: this.newTransaction.repayUsers,
  repayments: repayments, // ← c’est bien ce champ qu’on utilise
  id: Date.now() // ajoute un id si ce n’est pas encore fait
};



      // Émettre l'événement pour ajouter la transaction
      this.$emit('addTransaction', transaction);

      // Réinitialiser les données du formulaire
      this.newTransaction = {
        amount: '',
        for: '',
        repayUsers: [] // Réinitialisation de la liste des utilisateurs
      };
    }
  },
};
</script>

<style scoped>
.checkbox-group {
  display: flex;
  flex-direction: column;
}

input[type="checkbox"] {
  margin-right: 10px;
}

button {
  margin-top: 15px;
  margin-right: 10px;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
