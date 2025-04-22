import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import ProfilePage from '../views/ProfilePage.vue';
import AdminPage from '../views/AdminPage.vue';


const routes = [
    { path: '/', component: HomePage },
    { path: '/profile', component: ProfilePage },
    { path: '/admin', component: AdminPage, meta: { requiresAuth: true } },
    {
      path: '/profile/:id',  
      name: 'Profile',
      component: ProfilePage
    }
    
  ];
  

const router = createRouter({
  history: createWebHistory(), 
  routes,
});

export default router;

