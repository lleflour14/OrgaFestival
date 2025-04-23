<template>
    <div class="user-buttons">
      <div v-for="user in users" :key="user.id" class="user-card">
        <button @click="$emit('selectUser', user.id)">
          {{ user.surname }}
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['users'],
  };
  </script>
  
  <style scoped>
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
  