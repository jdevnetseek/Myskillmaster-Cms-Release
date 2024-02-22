export default {
  path: '/auth',
  name: 'auth',
  redirect: { name: 'auth.login' },
  component: () => import(/* webpackChunkName: "auth" */ '@/views/Auth'),
  children: [
    {
      path: 'login',
      name: 'auth.login',
      component: () =>
        import(/* webpackChunkName: "auth" */ '@/views/Auth/LoginPage'),
    },
    {
      path: 'forgot-password',
      name: 'auth.forgot-password',
      component: () =>
        import(/* webpackChunkName: "auth" */ '@/views/Auth/ForgotPassword'),
    },
  ],
}
