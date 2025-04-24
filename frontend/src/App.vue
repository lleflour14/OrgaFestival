<template>
  <div id="app">
    <div class="header">
      <h1 class="title">🎪 La Team aux Vieilles</h1>
      <div class="nav-icons">
        <div class="icon" @click="goToHome">🏠</div>
        <div class="icon" @click="goToConcert">🎵</div>
        <div class="icon" @click="goToProfile">👤</div>
        <div class="icon" @click="goToAdmin">⚙️</div>
      </div>
    </div>
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
    },
    goToConcert() {
      this.$router.push({ name: 'Concert' });
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Righteous&display=swap');

#app {
  background-color: #FFF4E6;
  min-height: 100vh;
  font-family: 'Righteous', cursive;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, #FF6B00, #FF9E3D);
  padding: 15px 25px;
  color: white;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.title {
  font-size: 2rem;
  margin: 0;
}

.nav-icons {
  display: flex;
  gap: 15px;
}

.icon {
  background-color: white;
  color: #FF6B00;
  border-radius: 50%;
  font-size: 1.6em;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

.icon:hover {
  transform: scale(1.1);
}
</style>
