<template>
  <q-page padding>
    <div class="row justify-center" style="height: 300px">
      <div class="col-xs-12 col-sm-6 col-md-4">
        <q-form>
          <div class="text-h4 q-py-md">Reset Password</div>
          <q-input
            filled
            type="text"
            v-model="password.phoneNumber"
            label="Phone Number"
            lazy-rules
            disable
          />

          <q-input
            filled
            type="password"
            v-model="password.newPassword"
            label="New Password"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Required']"
          />
          <q-input
            filled
            type="password"
            v-model="password.confirmPassword"
            label="Confirm Password"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Required']"
          />
          <div>
            <q-spinner-pie color="green" size="md" v-if="isLoading" />
            <q-btn
              class="full-width"
              glossy
              v-else
              color="teal-9"
              @click="resetPassword"
            >
              Reset Password
            </q-btn>
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script>
import axios from "axios";
import { useQuasar } from "quasar";
import { mapActions } from "vuex";
import { apiStrings } from "../../api_strings";

export default {
  name: "ForgottenPassword",
  setup() {
    const $q = useQuasar();
    return {
      showNotif(mgs, color) {
        $q.notify({
          message: mgs,
          color: color,
        });
      },
    };
  },
  data() {
    return {
      password: {
        phoneNumber: "",
        newPassword: "",
        confirmPassword: "",
      },

      isLoading: false,
    };
  },

  mounted() {
    // get phone number from session storage and display it to the user
    this.password.phoneNumber = sessionStorage.getItem("resetNumber");
  },

  methods: {
    // get user details from vuex
    ...mapActions("user", ["updateUser"]),

    // function to reset password
    resetPassword() {
      // hide loader
      this.isLoading = true;

      // header configuration
      let config = {
        headers: {
          Authorization: sessionStorage.getItem("userToken"),
        },
      };

      // notify user if password field are not the same
      if (this.password.newPassword !== this.password.confirmPassword) {
        this.isLoading = false;
        this.showNotif(
          "Please Check Password Fields and try Again",
          "red",
          "center"
        );
        return;
      }

      // request body
      // body that username (phone number) and the new password
      var info = {
        username: this.password.phoneNumber,
        password: this.password.newPassword,
      };

      // make a patch request to reset password
      axios
        .patch(apiStrings.forgettenPassword, info, config)
        .then((data) => {
          // get request response
          var response = data.data;

          // hide loader
          this.isLoading = false;
          if (response.success == true) {
            // notify user if request was successful and more to sign in page
            this.showNotif(response.message, "green");
            this.$router.go("-2");
          } else {
            // notify user if there was an error
            this.showNotif(response.message, "red");
          }
        })
        .catch((e) => {
          // hide loader if there was an error
          this.isLoading = false;
          // notify user about the error
          this.showNotif("Error occured. Please try again later", "red");
        });
    },
  },
};
</script>

<style scoped></style>
