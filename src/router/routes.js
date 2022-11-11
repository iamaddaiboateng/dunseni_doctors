const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/Index.vue"),
      },
      {
        path: "/bookings",
        name: "Bookings",
        component: () => import("pages/booking/MainBookingPage.vue"),
      },
      {
        path: "/doctor-history",
        name: "DoctorBookingHistory",
        component: () => import("pages/booking/DoctorBookingHistory.vue"),
      },
      {
        path: "/consultation",
        name: "Consultation",
        component: () => import("pages/consultation/Consultation.vue"),
      },
      {
        path: "/change-password",
        name: "ChangePassword",
        component: () => import("pages/account/ChangePassword.vue"),
      },
      {
        path: "/phone-number-verification",
        name: "PhoneVerification",
        component: () => import("pages/account/PhoneNumberVerification.vue"),
      },
      {
        path: "/reset-password",
        name: "ResetPassword",
        component: () => import("pages/account/ForgottenPassword.vue"),
      },
      {
        path: "/sign-in-page",
        name: "SignInPage",
        component: () => import("pages/account/SignIn.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
