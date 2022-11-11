<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn round icon="home" @click="checkSignIn" />
        <q-toolbar-title style="text-align: center">
          <div>Dunseni</div>
          <div class="text-body1">Ghana Police Virtual Medical Center</div>
        </q-toolbar-title>
        <q-btn flat @click="showProfile" round dense icon="account_circle" />
      </q-toolbar>
    </q-header>
    <q-drawer
      overlay
      behavior="mobile"
      side="right"
      v-model="drawerRight"
      :breakpoint="500"
      class="bg-grey-3"
    >
      <q-scroll-area class="fit">
        <div>
          <profile />
        </div>
      </q-scroll-area>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script>
import { defineComponent, ref } from "vue";
import Profile from "src/pages/profile/DoctorProfile.vue";
var signInStatus = sessionStorage.getItem("isSignedIn");

export default defineComponent({
  name: "MainLayout",

  components: {
    Profile,
  },

  setup() {},

  mounted() {
    if (signInStatus === "false" || signInStatus == null) {
      this.$router.push({ name: "SignInPage" });
    }
  },

  data() {
    return {
      drawerRight: false,
      isSignedIn: false,
    };
  },

  methods: {
    checkSignIn() {
      var signInStatus = sessionStorage.getItem("isSignedIn");

      if (signInStatus === "false" || signInStatus == null) {
        this.$router.push({ name: "SignInPage" });
      } else {
        this.$router.push({ name: "Bookings" });
      }
    },

    showProfile() {
      var signInStatus = sessionStorage.getItem("isSignedIn");

      this.isSignedIn = signInStatus === "true";

      if (this.isSignedIn == true) {
        this.drawerRight = !this.drawerRight;
      }
    },
  },
});
</script>
