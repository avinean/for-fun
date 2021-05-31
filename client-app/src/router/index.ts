import { routerHelper, Params } from '@doer/entities';
import gameStore from '@/store/gameStore';
import userStore from '@/store/userStore';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import TikTacToe from '../views/Games/TikTacToe/TikTacToe.vue';

const routes: Array<RouteRecordRaw> = [
  {
    ...routerHelper.home().get(),
    component: Home,
  },
  {
    ...routerHelper.about().get(),
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    ...routerHelper.auth().registration().get(),
    component: () => import(/* webpackChunkName: "signup" */ '../views/Auth/SignUp.vue'),
  },
  {
    ...routerHelper.auth().registration().param(Params.Hash).get(),
    component: () => import(/* webpackChunkName: "confirm-email" */ '../views/Auth/ConfirmEmail.vue'),
  },
  {
    ...routerHelper.auth().restorePassword().get(),
    component: () => import(/* webpackChunkName: "restore-password" */ '../views/Auth/RestorePassord.vue'),
  },
  {
    ...routerHelper.auth().resetPassword().param(Params.Hash).get(),
    component: () => import(/* webpackChunkName: "reset-password" */ '../views/Auth/ResetPassword.vue'),
  },
  {
    ...routerHelper.account().get(),
    component: () => import(/* webpackChunkName: "account" */ '../views/Account/Account.vue'),
    beforeEnter: (to, from, next) => {
      userStore.requireAuthorization()
        .then(() => {
          next();
        })
        .catch(() => {
          next(routerHelper.home().path());
        });
    },
    children: [
      {
        ...routerHelper.account().get(),
        component: () => import(/* webpackChunkName: "account-settings" */ '../views/Account/AccountSettings.vue'),
      },
      {
        ...routerHelper.account().statistics().get(),
        component: () => import(/* webpackChunkName: "account-statistics" */ '../views/Account/AccountStatistics.vue'),
      },
    ],
  },
  {
    ...routerHelper.games().get(),
    component: () => import(/* webpackChunkName: "games" */ '../views/Games/Games.vue'),
    children: [
      {
        ...routerHelper.games().home().get(),
        component: () => import(/* webpackChunkName: "gameslist" */ '../views/Games/GamesList.vue'),
      },
      {
        ...routerHelper.games().dynamicPath('tiktactoe3x3').get(),
        props: {
          cellsCount: 3,
          winCombo: 3,
        },
        meta: { isGame: true },
        component: TikTacToe,
      },
      {
        ...routerHelper.games().dynamicPath('tiktactoe19x19').get(),
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
