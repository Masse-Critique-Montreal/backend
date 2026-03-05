export default () => ({
  type: "admin",
  routes: [
    {
      method: 'GET',
      path: '/sessions',
      handler: 'analyticsController.getSessionsChart',
      config: {
        //auth:false,
        policies: ['admin::isAuthenticatedAdmin'],
      },
    },
    {
      method: 'GET',
      path: '/page-views',
      handler: 'analyticsController.getPageViewChart',
      config: {
        policies: ['admin::isAuthenticatedAdmin'],
      },
    },
    {
      method: 'GET',
      path: '/page-views-realtime',
      handler: 'analyticsController.getRealtimeChart',
      config: {
        policies: ['admin::isAuthenticatedAdmin'],
      },
    },
    {
      method: 'GET',
      path: '/page-views-meta',
      handler: 'analyticsController.getPageViews',
      config: {
        policies: ['admin::isAuthenticatedAdmin'],
      },
    },
    {
      method: 'GET',
      path: '/page-views-url',
      handler: 'analyticsController.getPageViewsBarChart',
      config: {
        policies: ['admin::isAuthenticatedAdmin'],
      },
    },

    {
      method: 'GET',
      path: '/page-views-referrer',
      handler: 'analyticsController.getReferrerChart',
      config: {
        policies: ['admin::isAuthenticatedAdmin'],
      },
    },
  ],
});