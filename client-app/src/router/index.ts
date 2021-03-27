import { PageRoutes } from '@/models/common';
import gameStore from '@/store/gameStore';
import userStore from '@/store/userStore';
import { Game } from '@doer/entities';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: PageRoutes.Home,
    name: 'Home',
    component: Home,
  },
  {
    path: PageRoutes.About,
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: PageRoutes.Registration,
    name: 'Registration',
    component: () => import(/* webpackChunkName: "signup" */ '../views/Auth/SignUp.vue'),
  },
  {
    path: PageRoutes.Account,
    name: 'Account',
    component: () => import(/* webpackChunkName: "account" */ '../views/Account/Account.vue'),
    beforeEnter: (to, from, next) => {
      userStore.requireAuthorization()
        .then(() => {
          next();
        })
        .catch(() => {
          next(PageRoutes.Home);
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
    path: PageRoutes.Games,
    name: 'Games',
    component: () => import(/* webpackChunkName: "games" */ '../views/Games/Games.vue'),
    children: [
      {
        path: '',
        name: 'GamesList',
        component: () => import(/* webpackChunkName: "gameslist" */ '../views/Games/GamesList.vue'),
      },
      {
        path: 'tiktactoe3x3',
        name: 'TikTacToe3x3',
        meta: { isGame: true },
        component: () => import(/* webpackChunkName: "tiktactoe3x3" */ '../views/Games/TikTacToe/TikTacToe.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
