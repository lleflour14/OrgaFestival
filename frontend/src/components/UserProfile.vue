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
      
      <div>
        <h2>Remboursements : </h2>
  <label><strong>Je dois :</strong></label>
  <ul>
    <li v-for="(transaction, i) in userRepayments" :key="i">
      <div>
        {{ transaction.payer }} a payé {{ transaction.amount }}€ pour {{ transaction.description }}
        <div v-for="(repayment, j) in transaction.repayments" :key="j">
          <div v-if="repayment.user === user.surname">
            Je dois {{ repayment.amount }}€
            <input
              type="checkbox"
              v-model="repayment.paid"
              @change="checkIfAllPaid(transaction)"
            /> Remboursé
          </div>
        </div>
      </div>
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

export default {
  props: {
    user: Object, // Propriété user (utilisateur sélectionné)
    users: Array, // Liste des utilisateurs
    jours: Array, // Jours de présence
    isEditing: Boolean, // Indicateur d'édition
    transactions: {
      type: Array,
      default: () => [] // Transactions par défaut
    },
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
    checkIfAllPaid(transaction) {
  const allPaid = transaction.repayments.every(r => r.paid);
  if (allPaid) {
    this.$emit('deleteTransaction', transaction.id);
  }
}

  },
  computed: {
  userRepayments() {
    return this.transactions.filter(transaction =>
      transaction.repayments?.some(r => r.user === this.user.surname)
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
