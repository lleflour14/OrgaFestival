<template>
    <div class="admin-wrapper">
      <div class="admin-deco">
        <img src="https://cdn-icons-png.flaticon.com/512/869/869869.png" alt="Soleil" class="deco soleil" />
        <img src="https://cdn-icons-png.flaticon.com/512/2331/2331958.png" alt="Guitare" class="deco guitare" />
      </div>
  
      <h1>Page Admin</h1>
  
      <div v-if="!isAdmin" class="login-box">
        <input v-model="password" type="password" placeholder="Entrez le mot de passe" />
        <button class="connect-btn" @click="checkPassword">Se connecter</button>
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
                <button class="delete-btn" @click="deleteUser(user.id)">🗑 Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
  
        <div class="add-user">
          <input v-model="newUser" placeholder="Ajouter un utilisateur" />
          <button class="add-btn" @click="addUser">+ Ajouter</button>
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
        isAdmin: false,
        users: [],
        newUser: '',
      };
    },
    methods: {
      checkPassword() {
        if (this.password === 'VC2025') {
          this.isAdmin = true;
          this.fetchUsers();
        } else {
          alert('Mot de passe incorrect');
        }
      },
      async fetchUsers() {
        try {
          const response = await axios.get('http://localhost:3000/api/users');
          this.users = response.data;
        } catch (error) {
          console.error('Erreur lors de la récupération des utilisateurs', error);
        }
      },
      async addUser() {
        if (this.newUser.trim() === '') return;
  
        try {
          const response = await axios.post('http://localhost:3000/api/users', {
            surname: this.newUser,
          });
          this.users.push(response.data);
          this.newUser = '';
        } catch (error) {
          console.error('Erreur lors de l\'ajout de l\'utilisateur', error);
        }
      },
      async deleteUser(userId) {
        try {
          await axios.delete(`http://localhost:3000/api/users/${userId}`);
          this.users = this.users.filter(user => user.id !== userId);
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
  .admin-wrapper {
    padding: 30px;
    background: #fff9f0;
    border-radius: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  h1 {
    text-align: center;
    color: #f57c00;
    font-family: 'Righteous', cursive;
  }
  
  .login-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  
  input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 6px;
  }
  
  table {
    width: 100%;
    margin-top: 20px;
    border-collapse: collapse;
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;
  }
  
  th, td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  
  .add-user {
    margin-top: 20px;
    display: flex;
    gap: 10px;
    align-items: center;
  }
  
  button {
    cursor: pointer;
    border-radius: 5px;
    transition: 0.3s ease;
  }
  
  .connect-btn {
    background-color: #ff9800;
    color: white;
    padding: 8px 15px;
    border: none;
  }
  
  .connect-btn:hover {
    background-color: #fb8c00;
  }
  
  .add-btn {
    background-color: #ecd90a;
    color: white;
    padding: 5px 12px;
    border: none;
  }
  
  .add-btn:hover {
    background-color: #ffea00;
  }
  
  .delete-btn {
    background-color: #ff5252;
    color: white;
    padding: 5px 10px;
    border: none;
  }
  
  .delete-btn:hover {
    background-color: #e53935;
  }
  
  /* Décorations */
  .admin-deco {
    position: relative;
    height: 80px;
    margin-bottom: 20px;
  }
  
  .deco {
    position: absolute;
    width: 50px;
    height: 50px;
    opacity: 0.9;
  }
  
  .palmier {
    left: 10px;
    top: 0;
  }
  
  .soleil {
    right: 10px;
    top: 0;
  }
  
  .guitare {
    left: 50%;
    transform: translateX(-50%);
    bottom: 0;
  }
  </style>
  