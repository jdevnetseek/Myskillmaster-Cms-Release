export default {
  path: '/settings',
  name: 'settings',
  redirect: { name: 'settings.dashboard' },
  component: () =>
    import(/* webpackChunkName: "auth" */ '@/views/Home/Settings'),
  children: [
    {
      path: 'dashboard',
      name: 'settings.dashboard',
      component: () =>
        import(
          /* webpackChunkName: "auth" */ '@/views/Home/Settings/Dashboard'
        ),
    },
    {
      path: 'pages/privacy',
      name: 'settings.pages.privacy',
      component: () =>
        import(
          /* webpackChunkName: "auth" */ '@/views/Home/Settings/PageManager/index.vue'
        ),
      props: {
        pageType: 'privacy',
        pageTitle: 'Privacy Policy',
      },
    },
    {
      path: 'pages/terms-of-service',
      name: 'settings.pages.terms-of-service',
      component: () =>
        import(
          /* webpackChunkName: "auth" */ '@/views/Home/Settings/PageManager/index.vue'
        ),
      props: {
        pageType: 'terms_of_service',
        pageTitle: 'Terms of Service',
      },
    },
    {
      path: 'version-control',
      name: 'settings.version-control',
      component: () =>
        import(
          /* webpackChunkName: "auth" */ '@/views/Home/Settings/VersionControl/index'
        ),
    },
  ],
}
