import Vue from "vue";
import Router from "vue-router";
import Home from "../views/Home.vue";
import store from "@/store";
Vue.use(Router);

const router = new Router({
  mode: "history", //to make the URL look normal, without the #
  linkExactActiveClass: "vue-school-active-class",
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      const position = {};
      if (to.hash) {
        position.selector = to.hash;
        if (to.hash === "#experience") {
          position.offset = { y: 140 };
        }
        if (document.querySelector(to.hash)) {
          return position;
        }
        return false;
      }
    }
  },
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      props: true,
    },
    {
      path: "/destination/:slug",
      name: "DestinationDetails",
      props: true,
      component: () =>
        import(
          /* webpackChunkName: "DestinationDetails"*/ "../views/DestinationDetails"
        ),
      children: [
        {
          path: ":experienceSlug",
          name: "experienceDetails",
          props: true,
          component: () =>
            import(
              /* webpackChunkName: "ExperienceDetails"*/ "../views/ExperienceDetails"
            ),
        },
      ],
      beforeEnter: (to, from, next) => {
        const exists = store.destinations.find(
          (destination) => destination.slug === to.params.slug
        );
        if (exists) {
          next();
        } else {
          next({ name: "notFound" });
        }
      },
    },
    {
      path: "/user",
      name: "user",
      component: () =>
        import(/* webpackChunkName: "User" */ "../views/User.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "login",
      component: () =>
        import(/* webpackChunckName: "Login" */ "../views/Login.vue"),
    },
    {
      path: "/invoices",
      name: "invoices",
      component: () =>
        import(/* webpackChunkName: "Invoices" */ "../views/Invoices"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      //if we want to match anything, we can use the asterisk as out path
      //but make sure to put it at the end after all othe routes,
      //as the asterisk will match any route
      path: "/404",
      alias: "*",
      name: "notFound",
      component: () =>
        import(/* webpackChunckName: "NotFound" */ "../views/NotFound"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!store.user) {
      next({
        name: "login",
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  } else {
    next();
  }
});
export default router;
