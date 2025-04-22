<template>
    <div class="profile-page">
        <div>
            <h1>Liste des utilisateurs</h1>
            <div class="user-buttons">
                <div v-for="user in users" :key="user.id" class="user-card">
                    <button @click="goToUserProfile(user.id)">
                        {{ user.surname }}
                    </button>
                </div>
            </div>


            <!-- Profil sélectionné -->
            <div v-if="selectedUser">
                <div class="user-details">
                    <h2>{{ selectedUser.surname }} - Profil</h2>

                    <!-- Formulaire édition -->
                    <div v-if="isEditing">
                        <form @submit.prevent="updateUser">
                            <div>
                                <label>Bénévole</label>
                                <input type="checkbox" v-model="selectedUser.isVolunteer" />
                            </div>

                            <div>
                                <label>Jours de présence</label>
                                <div class="checkbox-group">
                                    <label v-for="day in jours" :key="day">
                                        <input type="checkbox" :value="day" v-model="selectedUser.presenceDays" />
                                        {{ day }}
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label>Ce que j'amène</label>
                                <ul>
                                    <li v-for="(item, index) in selectedUser.gear" :key="index">
                                        <input type="text" v-model="item.item" placeholder="Objet" />
                                        <input type="number" v-model.number="item.quantity" placeholder="Quantité" />
                                    </li>
                                </ul>
                                <button type="button" @click="addGearItem">Ajouter un objet</button>
                            </div>

                            <div>
                                <label>Remboursement général (€)</label>
                                <input type="number" step="0.01" v-model.number="selectedUser.refundBalance" />
                            </div>

                            <button type="submit">Sauvegarder</button>
                            <button type="button" @click="cancelEdit">Annuler</button>
                        </form>
                    </div>

                    <!-- Vue simple -->
                    <div v-else>
                        <div>
                            <label><strong>Bénévole :</strong></label>
                            <span>{{ selectedUser.isVolunteer ? 'Oui' : 'Non' }}</span>
                        </div>

                        <div>
                            <label><strong>Jours de présence :</strong></label>
                            <span>{{ selectedUser.presenceDays.join(', ') }}</span>
                        </div>

                        <div>
                            <label><strong>Ce que j'amène :</strong></label>
                            <ul>
                                <li v-for="(item, index) in selectedUser.gear" :key="index">
                                    {{ item.item }} : {{ item.quantity }}
                                </li>
                            </ul>
                        </div>

                        <div>
                            <label><strong>Remboursement général :</strong></label>
                            <span>{{ selectedUser.refundBalance.toFixed(2) }} €</span>
                        </div>

                        <button @click="editUser">Modifier</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            users: [],
            selectedUser: null,
            isEditing: false,
            jours: ['jeudi', 'vendredi', 'samedi', 'dimanche'],
        };
    },
    methods: {
        async fetchUsers() {
            try {
                const response = await axios.get('http://localhost:3000/api/users');
                this.users = response.data;
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs:', error);
            }
        },
        goToUserProfile(userId) {
            this.$router.push({ name: 'Profile', params: { id: userId } });
        },
        async fetchUserInfo(userId) {
            try {
                const response = await axios.get(`http://localhost:3000/api/users/${userId}`);
                this.selectedUser = response.data;
            } catch (error) {
                console.error("Erreur lors de la récupération de l'utilisateur:", error);
            }
        },
        editUser() {
            this.isEditing = true;
        },
        cancelEdit() {
            this.isEditing = false;
            this.fetchUserInfo(this.selectedUser.id);
        },
        addGearItem() {
            this.selectedUser.gear.push({ item: '', quantity: 1 });
        },
        async updateUser() {
            try {
                const updatedUser = {
                    surname: this.selectedUser.surname,
                    isVolunteer: !!this.selectedUser.isVolunteer,
                    presenceDays: this.selectedUser.presenceDays,
                    gear: this.selectedUser.gear,
                    refundBalance: parseFloat(this.selectedUser.refundBalance),
                };

                const response = await axios.put(
                    `http://localhost:3000/api/users/${this.selectedUser.id}`,
                    updatedUser
                );

                if (response.status === 200) {
                    alert('Utilisateur mis à jour !');
                    this.isEditing = false;
                    this.fetchUserInfo(this.selectedUser.id);
                }
            } catch (error) {
                console.error('Erreur lors de la mise à jour :', error);
                alert("Erreur lors de la mise à jour.");
            }
        },
    },
    mounted() {
        this.fetchUsers();
        const userId = this.$route.params.id;
        if (userId) this.fetchUserInfo(userId);
    },
    watch: {
        '$route.params.id'(newId) {
            if (newId) this.fetchUserInfo(newId);
        },
    },
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

.user-card {
    margin-bottom: 10px;
}

.user-details {
    margin-top: 20px;
}

label {
    font-weight: bold;
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

.checkbox-group {
    display: flex;
    gap: 10px;
    margin: 10px 0;
}

input[type='text'],
input[type='number'] {
    width: 100%;
    padding: 5px;
    margin: 5px 0;
}
.user-buttons {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.user-card button {
  padding: 8px 12px;
  background-color: #17a2b8;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.user-card button:hover {
  background-color: #138496;
}

</style>