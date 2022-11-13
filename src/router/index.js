import { createWebHistory, createRouter } from "vue-router";
import routes from './routes';
import appConfig from "../../app.config";
/* eslint-disable */
import store from '@/state/store';

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Use the HTML5 history API (i.e. normal-looking routes)
  // instead of routes with hashes (e.g. example.com/#/about).
  // This may require some server configuration in production:
  // https://router.vuejs.org/en/essentials/history-mode.html#example-server-configurations
  mode: 'history',
  // Simulate native-like scroll behavior when navigating to a new
  // route and using back/forward buttons.
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, left: 0 };
    }
  },
});

// API based Authentication
// Before each route evaluates...

router.beforeEach(async (to, from, next) => {
  const isLoggedIn = store.state.auth.authenticated
  const requiresAuth = to.matched.some((record) => record.meta.authRequired)
  const isSuperAdmin = to.matched.some((record) => record.meta.isSuperAdmin)
  let user=store.state.auth.user;
  const { path, name, params } = to
  if (isLoggedIn && ['login','Register'].includes(name)) {
      if(user.role_id == 1){
        return next('/admin/users')
      }else{
        return next('/')
      }
      }else if (requiresAuth && isLoggedIn && isSuperAdmin && user.role_id!=1) {
        return next('/login')
      }else if (requiresAuth && !isLoggedIn) {
        return next('/login')
      }
return next()
})
/* eslint-enable */
router.beforeResolve(async (routeTo, routeFrom, next) => {
  try {
    for (const route of routeTo.matched) {
      await new Promise((resolve, reject) => {
        if (route.meta && route.meta.beforeResolve) {
          route.meta.beforeResolve(routeTo, routeFrom, (...args) => {
            if (args.length) {
              next(...args);
              reject(new Error('Redirected'));
            } else {
              resolve();
            }
          });
        } else {
          resolve();
        }
      });
    }
  } catch (error) {
    return;
  }
  document.title = routeTo.meta.title + ' | ' + appConfig.title;
  next();
});

export default router;
