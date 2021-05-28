import { PageRoutes, Game } from '@doer/entities';
import gameStore from '@/store/gameStore';
import userStore from '@/store/userStore';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import TikTacToe from '../views/Games/TikTacToe/TikTacToe.vue';

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
    path: `${PageRoutes.Auth}${PageRoutes.Registration}`,
    name: 'AuthRegistration',
    component: () => import(/* webpackChunkName: "signup" */ '../views/Auth/SignUp.vue'),
  },
  {
    path: `${PageRoutes.Auth}${PageRoutes.ConfirmEmail}/:hash`,
    name: 'AuthConfirmEmail',
    component: () => import(/* webpackChunkName: "confirm-email" */ '../views/Auth/ConfirmEmail.vue'),
  },
  {
    path: `${PageRoutes.Auth}${PageRoutes.RestorePassword}`,
    name: 'AuthRestorePassword',
    component: () => import(/* webpackChunkName: "restore-password" */ '../views/Auth/RestorePassord.vue'),
  },
  {
    path: `${PageRoutes.Auth}${PageRoutes.ResetPassword}/:hash`,
    name: 'AuthResetPassword',
    component: () => import(/* webpackChunkName: "reset-password" */ '../views/Auth/ResetPassword.vue'),
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
      {
        path: 'statistics',
        name: 'AboutSettings',
        component: () => import(/* webpackChunkName: "account-settings" */ '../views/Account/AccountStatistics.vue'),
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
        props: {
          cellsCount: 3,
          winCombo: 3,
        },
        meta: { isGame: true },
        component: TikTacToe,
      },
      {
        path: 'tiktactoe19x19',
        name: 'TikTacToe19x19',
        props: {
          cellsCount: 19,
          winCombo: 5,
        },
        meta: { isGame: true },
        component: TikTacToe,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  next();
});

export default router;
