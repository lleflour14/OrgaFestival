<template>
    <div id="app">
      <h1>🎪 La Team aux Vieilles</h1>
      <nav>
        <router-link to="/">🏠 Accueil</router-link> |
        <router-link to="/profile">👤 Mon Profil</router-link>
      </nav>
      <hr />
      <router-view />
    </div>
  </template>
  
  <script>
  export default {
    name: 'App',
  };
  </script>
  
  <style scoped>
  nav {
    margin-bottom: 10px;
  }
  router-link {
    margin: 0 10px;
    text-decoration: none;
    color: #2c3e50;
  }
  router-link.active {
    font-weight: bold;
  }
  </style>
  