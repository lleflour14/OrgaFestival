<template>
    <div>
        <h1>Page Admin</h1>
        <div v-if="!isAdmin">
            <input v-model="password" type="password" placeholder="Entrez le mot de passe" />
            <button @click="checkPassword">Se connecter</button>
        </div>
        <div v-else>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nom d'utilisateur</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" :key="user.id">
                        <td>{{ user.id }}</td>
                        <td>{{ user.surname }}</td>
                        <td>
                            <button @click="deleteUser(user.id)">Supprimer</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div>
                <input v-model="newUser" placeholder="Ajouter un utilisateur" />
                <button @click="addUser">Ajouter</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            password: '',
            isAdmin: false, // Variable de contrôle pour l'accès à la page admin
            users: [],
            newUser: '',
        };
    },
    methods: {
        checkPassword() {
            if (this.password === 'VC2025') {
                this.isAdmin = true; // Accès à la page admin
                this.fetchUsers(); // Charger les utilisateurs
            } else {
                alert('Mot de passe incorrect');
            }
        },
        // Récupérer les utilisateurs depuis l'API
        async fetchUsers() {
            try {
                const response = await axios.get('http://localhost:3000/api/users');
                this.users = response.data;
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs', error);
            }
        },
        // Ajouter un nouvel utilisateur
        async addUser() {
            if (this.newUser.trim() === '') return;

            try {
                const response = await axios.post('http://localhost:3000/api/users', {
                    surname: this.newUser,
                });
                this.users.push(response.data); // Ajouter l'utilisateur à la liste affichée
                this.newUser = ''; // Réinitialiser le champ d'ajout
            } catch (error) {
                console.error('Erreur lors de l\'ajout de l\'utilisateur', error);
            }
        },
        // Supprimer un utilisateur
        async deleteUser(userId) {
            try {
                await axios.delete(`http://localhost:3000/api/users/${userId}`);
                this.users = this.users.filter(user => user.id !== userId); // Retirer l'utilisateur de la liste
            } catch (error) {
                console.error('Erreur lors de la suppression de l\'utilisateur', error);
            }
        },
    },
    mounted() {
        this.fetchUsers();
    },

};
</script>

<style scoped>
/* Style basique pour la page Admin */
h1 {
    text-align: center;
}

table {
    width: 100%;
    margin-top: 20px;
    border-collapse: collapse;
}

th,
td {
    padding: 10px;
    text-align: left;
    border: 1px solid #ddd;
}

button {
    background-color: #f44336;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
}

button:hover {
    background-color: #d32f2f;
}
</style>