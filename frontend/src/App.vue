<template>
  <div id="app">
    <div class="header">
      <h1>🎪 La Team aux Vieilles</h1>
      <div class="settings-icon" @click="goToHome">🏠</div>
      <div class="settings-icon" @click="goToProfile">👤</div>
      <div class="settings-icon" @click="goToAdmin">⚙️</div>
    </div>
    <hr />
    <router-view />
  </div>
</template>


<script>
export default {
  name: 'App',
  methods: {  
    goToAdmin() {
      this.$router.push({ name: 'Admin' });
    },
    goToHome() {
      this.$router.push({ name: 'Home' });
    },
    goToProfile() {
      this.$router.push({ name: 'ProfilePage' });
    }
  }
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.settings-icon {
  font-size: 1.8em;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.settings-icon:hover {
  transform: rotate(90deg);
}

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