<template>
    <div>
      <h1>Liste de courses 🛒</h1>
      <ul>
        <li v-for="item in courses" :key="item">{{ item }}</li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        courses: [],
      };
    },
    mounted() {
      fetch('http://localhost:3000/api/courses')
        .then(response => response.json())
        .then(data => {
          this.courses = data.courses;
        })
        .catch(error => {
          console.error('Erreur fetch:', error);
        });
    },
  };
  </script>
  