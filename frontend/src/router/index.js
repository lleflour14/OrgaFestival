  import { createRouter, createWebHistory } from 'vue-router';
  import HomePage from '../views/HomePage.vue';
  import ProfilePage from '../views/ProfilePage.vue';
  import AdminPage from '../views/AdminPage.vue';
  import ConcertPage from '@/views/ConcertPage.vue';


  const routes = [
      { path: '/',name: 'Home', component: HomePage },
      { path: '/profile',name: 'ProfilePage', component: ProfilePage },
      { path: '/concert',name: 'Concert', component: ConcertPage },
      { path: '/admin',name: 'Admin', component: AdminPage, meta: { requiresAuth: true } },
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

