import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "@/views/Home.vue";
import SampleList from "@/views/SampleList.vue";
import SampleItem from "@/views/SampleItem.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    // name: "Home",
    redirect: _to => {
      return "/signIn";
    }
  },
  {
    path: "/about",
    name: "About",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: "/signIn",
    name: "SignIn",
    component: () =>
      import(/* webpackChunkName: "signIn" */ "@/views/auth/SignIn.vue")
  },
  {
    path: "/signUp",
    name: "SignUp",
    component: () =>
      import(/* webpackChunkName: "signUp" */ "@/views/auth/SignUp.vue")
  },
  {
    path: "/mailAuth",
    name: "MailAuth",
    component: () =>
      import(/* webpackChunkName: "mailAuth" */ "@/views/auth/MailAuth.vue")
  },
  {
    path: "/passwordReset",
    name: "PasswordReset",
    component: () =>
      import(
        /* webpackChunkName: "passwordReset" */ "@/views/auth/PasswordReset.vue"
      )
  },
  {
    path: "/sample/:id",
    name: "SampleItem",
    component: SampleItem
  },
  {
    path: "/sample",
    name: "SampleList",
    component: SampleList
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
