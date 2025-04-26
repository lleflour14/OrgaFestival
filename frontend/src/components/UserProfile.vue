<template>
  <div v-if="user">
    <div class="user-details">
      <div v-if="user && user.surname">
  <h1>{{ user.surname }} - Profil</h1>
  <br/>
  <h2>Infos :</h2>
</div>

      <!-- Formulaire d'édition -->
      <UserEditForm
        v-if="isEditing"
        :user="user"
        :jours="jours"
        @cancel="cancelEdit"
        @save="saveEdit"
      />
      
      <!-- Affichage des détails utilisateur -->
      <div v-else>
        <div><label><strong>Bénévole :</strong></label> {{ user.isVolunteer ? 'Oui' : 'Non' }}</div>
        <div><label><strong>Jours de présence :</strong></label> {{ user.presenceDays.join(', ') }}</div>
        <div>
          <label><strong>Ce que j'amène :</strong></label>
          <ul>
            <li v-for="(item, i) in user.gear" :key="i">{{ item.item }} : {{ item.quantity }}</li>
          </ul>
        </div>
        <button @click="$emit('edit')">Modifier</button>
      </div>

      <div v-if="userRepayments.length">
  <h3>💰 Je dois :</h3>
  <ul>
    <li v-for="(repayment, index) in userRepayments" :key="index">
      <span>
        À {{ repayment.payer }} – {{ repayment.amount }}€ pour "{{ repayment.description }}"
      </span>
      <input
        type="checkbox"
        v-model="repayment.paid"
        @change="markAsPaid(repayment)"
      />
      Remboursé
    </li>
  </ul>
</div>


      <!-- Section des transactions -->
      <TransactionSection
        :transactions="transactions"
        :users="users"
        :user="user"
        :newTransaction="newTransaction"
        @addTransaction="$emit('addTransaction', $event)"
        @deleteTransaction="$emit('deleteTransaction', $event)"
        @updateNewTransaction="$emit('updateNewTransaction', $event)"
      />
    </div>
  </div>
</template>

<script>
import UserEditForm from './UserEditForm.vue';
import TransactionSection from './TransactionSection.vue';
import axios from 'axios';

export default {
  props: {
    user: Object, // Propriété user (utilisateur sélectionné)
    users: Array, // Liste des utilisateurs
    jours: Array, // Jours de présence
    isEditing: Boolean, // Indicateur d'édition
    transactions: Array,
    newTransaction: {
      type: Object,
      default: () => ({ repayUsers: [] }) // Structure de la nouvelle transaction
    }
  },
  components: { UserEditForm, TransactionSection }, // Importation des composants enfants
  methods: {
    cancelEdit() {
      this.$emit('cancel'); // Émettre l'événement pour annuler l'édition
    },
    saveEdit(data) {
      this.$emit('save', data); // Émettre l'événement pour sauvegarder les modifications
    },
    async markAsPaid(repayment) {
    // Mets à jour le statut "paid" dans la transaction correspondante dans this.transactions
    const tx = this.transactions.find(t => t.id === repayment.transactionId);
    if (tx) {
      const repayment = tx.repayments.find(r => r.userId === this.user.surname);
      if (repayment) {
        repayment.paid = true;
        // Si tous ont remboursé, supprime la transaction
        const allPaid = tx.repayments.every(r => r.paid);
        if (allPaid) {
          this.$emit('deleteTransaction', repayment.transactionId);
        }
      }
    }
  }

  },
computed: {
  userRepayments() {
    if (!this.user.surname || !this.transactions) return [];

    return this.transactions.flatMap(t =>
      (t.repayments || [])
        .filter(r => r.userId === this.user.surname && !r.paid)
        .map(r => ({
          transactionId: t.id,
          payer: t.payer,
          amount: r.amount,
          description: t.description,
          paid: r.paid
        }))
    );
  }
}

};
</script>

<style scoped>
/* Style pour le profil utilisateur */
.user-details {
  margin-top: 20px;
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
