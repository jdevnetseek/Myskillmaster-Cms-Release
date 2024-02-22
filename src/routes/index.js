import Vue from 'vue'
import Router from 'vue-router'
import auth from './auth'
import settings from './settings'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    auth,
    {
      path: '/',
      name: 'home',
      redirect: { name: 'users' },
      component: () => import(/* webpackChunkName: "home" */ '@/views/Home'),
      children: [
        {
          path: 'inbox',
          name: 'inbox',
          component: () =>
            import(/* webpackChunkName: "inbox" */ '@/views/Home/Inbox'),
        },
        {
          path: 'users',
          name: 'users',
          component: () =>
            import(/* webpackChunkName: "users" */ '@/views/Home/Users'),
        },
        {
          path: 'users/:id',
          name: 'user.details',
          component: () =>
            import(
              /* webpackChunkName: "users" */ '@/views/Home/Users/UserDetails'
            ),
        },
        {
          path: 'content',
          name: 'content',
          component: () =>
            import(/* webpackChunkName: "content" */ '@/views/Home/Content'),
        },
        {
          path: 'notification',
          name: 'notification',
          component: () =>
            import(
              /* webpackChunkName: "push-notification" */ '@/views/Home/Notification'
            ),
        },
        {
          path: 'categories',
          name: 'categories',
          component: () =>
            import(
              /* webpackChunkName: "categories" */ '@/views/Home/Categories'
            ),
        },
        {
          path: 'categories/create',
          name: 'category.add',
          component: () =>
            import(
              /* webpackChunkName: "categories" */ '@/views/Home/Categories/Create'
            ),
        },
        {
          path: 'categories/:id',
          name: 'category.details',
          component: () =>
            import(
              /* webpackChunkName: "categories" */ '@/views/Home/Categories/Details'
            ),
        },
        settings,
        {
          path: 'reports/lessons',
          name: 'reported_lessons',
          component: () =>
            import(
              /* webpackChunkName: "reported_lessons" */ '@/views/Home/Reports/Lesson'
            ),
        },
        {
          path: 'reports/lessons/:id',
          name: 'reported_lessons.details',
          component: () =>
            import(
              /* webpackChunkName: "reported_lessons_details" */ '@/views/Home/Reports/Lesson/Details'
            ),
        },
      ],
    },
  ],
})
