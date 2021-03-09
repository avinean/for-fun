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
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  // const sessionDate: any = new Date(localStorage.sessionDate);
  // const currentDate: any = new Date();
  // const { sessionToken } = localStorage;

  // const maxSessionDuration = 24;
  // const sessionDuration = Math.floor((currentDate - sessionDate) / 36e5);
  // if (
  //   !sessionToken
  // ) {

  // }
  next();
});

export default router;
