import userStore from '@/store/userStore';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '/registration',
    name: 'Registration',
    component: () => import(/* webpackChunkName: "signup" */ '../views/Auth/SignUp.vue'),
  },
  {
    path: '/account',
    name: 'Account',
    component: () => import(/* webpackChunkName: "account" */ '../views/Account/Account.vue'),
    beforeEnter: (to, from, next) => {
      userStore.requireAuthorization()
        .then(() => {
          next();
        })
        .catch(() => {
          next(false);
        });
    },
    children: [
      {
        path: '',
        name: 'AboutSettings',
        component: () => import(/* webpackChunkName: "account-settings" */ '../views/Account/AccountSettings.vue'),
      },
    ],
  },
  {
    path: '/games',
    name: 'Account',
    component: () => import(/* webpackChunkName: "games" */ '../views/Games/Games.vue'),
    children: [
      {
        path: 'tiktoktoe3x3',
        name: 'TikTokToe3x3',
        component: () => import(/* webpackChunkName: "tiktoktoe3x3" */ '../views/Games/TikTokToe/TikTokToe.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
