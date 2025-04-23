<template>
    <div class="profile-page">
        <h1>Liste des utilisateurs</h1>

        <UserList :users="users" @selectUser="goToUserProfile" />

        <UserProfile v-if="selectedUser" :user="selectedUser" :users="users":jours="jours" :isEditing="isEditing"
            :transactions="transactions"  @edit="editUser" @cancel="cancelEdit"
            @save="updateUser" @addTransaction="addTransaction" @deleteTransaction="deleteTransaction" />
        
    </div>
</template>

<script>
import axios from 'axios';
import UserList from '../components/UserList.vue';
import UserProfile from '../components/UserProfile.vue';
import TransactionSection from '../components/TransactionSection.vue';
import UserEditForm from '../components/UserEditForm.vue';


export default {
    components: { UserList, UserProfile,TransactionSection,UserEditForm },
    data() {
        return {
            users: [],
            user: Object,
            selectedUser: null,
            isEditing: false,
            jours: ['jeudi', 'vendredi', 'samedi', 'dimanche'],
            transactions: [],
            newTransaction: {
                payer: '',
                amount: '',
                for: '',
                repayers: []
            }
        };
    },
    methods: {
        async fetchUsers() {
            try {
                const res = await axios.get('http://localhost:3000/api/users');
                this.users = res.data;
            } catch (e) {
                console.error('Erreur fetch users:', e);
            }
        },

        goToUserProfile(id) {
            this.$router.push({ name: 'Profile', params: { id } });
        },

        async fetchUserInfo(id) {
            try {
                const res = await axios.get(`http://localhost:3000/api/users/${id}`);
                this.selectedUser = res.data;
                await this.fetchTransactions(id);
            } catch (e) {
                console.error('Erreur fetch user:', e);
            }
        },

        async fetchTransactions(id) {
    try {
        const res = await axios.get(`http://localhost:3000/api/users/${id}/transactions`);
        this.transactions = res.data.map(t => {

            // Si la transaction contient déjà des 'repayments', on les conserve.
            const repayments = t.repayments && Array.isArray(t.repayments) 
                ? t.repayments 
                : [];

            // Si la transaction ne contient pas de 'repayments', on les crée avec les bénéficiaires.
            if (repayments.length === 0 && Array.isArray(t.beneficiaries)) {
                const amountPerUser = t.beneficiaries.length > 0
                    ? parseFloat((t.amount / t.beneficiaries.length).toFixed(2))
                    : 0;

                repayments.push(...t.beneficiaries.map(user => ({
                    userId: user, // Assurez-vous que le nom du champ correspond à ce que vous avez
                    amount: amountPerUser,
                    paid: false
                })));
            }

            // Retourne la transaction avec les repayments modifiés ou ajoutés
            return {
                ...t,
                repayments
            };
        });

    } catch (e) {
        console.error('Erreur fetch transactions:', e);
    }
},

        selectUser(user) {
      this.selectedUser = user; // Ici tu mets l'utilisateur sélectionné
    },
        editUser() {
            this.isEditing = true;
        },
        cancelEdit() {
            this.isEditing = false;
            this.fetchUserInfo(this.selectedUser.id);
        },

        async updateUser(updatedUser) {
    try {
        const res = await axios.put(
            `http://localhost:3000/api/users/${this.selectedUser.id}`, 
            updatedUser,  // Ajoute les données dans le corps de la requête
            {
                headers: {
                    'Content-Type': 'application/json',  // Assure-toi que c'est bien défini
                }
            }
        );
        if (res.status === 200) {
            alert('Utilisateur mis à jour !');
            this.isEditing = false;
            this.fetchUserInfo(this.selectedUser.id);
        }
    } catch (e) {
        console.error('Erreur mise à jour user:', e);
    }
},

        async addTransaction(transaction) {
  try {
    console.log('🎯 Données à envoyer :', transaction);

    const response = await fetch(`http://localhost:3000/api/users/${this.selectedUser.id}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erreur lors de l’ajout');

    console.log('✅ Transaction ajoutée :', data);
    this.fetchTransactions(this.selectedUser.id)
  } catch (error) {
    console.error('❌ Erreur :', error.message);
  }
},
        async deleteTransaction(index) {
            const confirmed = confirm("Tu es sûr·e ?");
            if (!confirmed) return;
            try {
                await axios.delete(`http://localhost:3000/api/users/${this.selectedUser.id}/transactions/${index}`);
                this.transactions.splice(index, 1);
                this.fetchTransactions(this.selectedUser.id)
            } catch (e) {
                console.error("Erreur suppression transaction :", e);
            }
        }
    },
    mounted() {
        this.fetchUsers();
        const id = this.$route.params.id;
        if (id) this.fetchUserInfo(id);
    },
    watch: {
        '$route.params.id'(id) {
            if (id) this.fetchUserInfo(id);
        }
    }
};
</script>

<style scoped>
.profile-page {
    padding: 20px;
}

h1 {
    font-size: 2em;
    text-align: center;
}
</style>