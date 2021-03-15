import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import store from '../store/store';
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
      store.requireAuthorization()
        .then(() => {
          next();
        })
        .catch((err) => {
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
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  console.log('to', to);
  console.log('from', from);
  console.log('======');
  next();
});

export default router;
