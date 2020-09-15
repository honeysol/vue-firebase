import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import authentication from "@/stores/authentication";

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: "/",
    name: "Top",
    redirect: _to => {
      return "/about";
    }
  },
  {
    path: "/main",
    name: "Main",
    component: () =>
      import(/* webpackChunkName: "main" */ "@/views/layout/Main.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "/sharedFruit/item/:id?",
        name: "SharedFruitItem",
        component: () =>
          import(
            /* webpackChunkName: "main" */ "@/views/sharedFruit/SharedFruitItem.vue"
          )
      },
      {
        path: "/sharedFruit",
        name: "SharedFruitList",
        component: () =>
          import(
            /* webpackChunkName: "main" */ "@/views/sharedFruit/SharedFruitList.vue"
          )
      },
      {
        path: "/userFruit/item/:id?",
        name: "UserFruitItem",
        component: () =>
          import(
            /* webpackChunkName: "main" */ "@/views/userFruit/UserFruitItem.vue"
          )
      },
      {
        path: "/userFruit",
        name: "UserFruitList",
        component: () =>
          import(
            /* webpackChunkName: "main" */ "@/views/userFruit/UserFruitList.vue"
          )
      },
      {
        path: "/about",
        name: "About",
        component: () =>
          import(/* webpackChunkName: "main" */ "@/views/About.vue")
      }
    ]
  },

  {
    path: "/initializing",
    name: "Initializing",
    component: () =>
      import(/* webpackChunkName: "auth" */ "@/views/auth/Initializing.vue")
  },
  {
    path: "/signOut",
    name: "SignOut",
    component: () =>
      import(/* webpackChunkName: "auth" */ "@/views/auth/SignOut.vue")
  },
  {
    path: "/signIn",
    name: "SignIn",
    component: () =>
      import(/* webpackChunkName: "auth" */ "@/views/auth/SignIn.vue")
  },
  {
    path: "/signUp",
    name: "SignUp",
    component: () =>
      import(/* webpackChunkName: "auth" */ "@/views/auth/SignUp.vue")
  },
  {
    path: "/mailAuth",
    name: "MailAuth",
    component: () =>
      import(/* webpackChunkName: "auth" */ "@/views/auth/MailAuth.vue")
  },
  {
    path: "/passwordReset",
    name: "PasswordReset",
    component: () =>
      import(/* webpackChunkName: "auth" */ "@/views/auth/PasswordReset.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (
    to.matched.some(record => record.meta.requiresAuth) &&
    authentication.status !== "member"
  ) {
    next({ path: "/initializing", query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router;
