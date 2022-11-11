<template>
  <q-page padding>
    <div class="row justify-center" style="height: 300px">
      <div class="col-xs-12 col-sm-6 col-md-4">
        <q-form @submit="changePassword">
          <div class="text-h4 q-py-md">Change Password</div>
          <q-input
            filled
            type="password"
            v-model="password.currentPassword"
            label="Current Password"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Required']"
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
          <div class="q-ma-md full-width">
            <q-spinner-pie color="green" size="md" v-if="isLoading" />
            <q-btn
              type="submit"
              class="full-width"
              glossy
              v-else
              color="primary"
            >
              Change Password
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
  name: "ChangePassword",
  setup() {
    // create useQuasar var
    const $q = useQuasar();
    return {
      // function for show notification
      // showNotif takes a message and color
      // if color is not provided, the backgroud color will be black
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
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      },

      isLoading: false,
    };
  },

  methods: {
    // get user details from vuex
    ...mapActions("user", ["updateUser"]),

    // function to change password
    changePassword() {
      // show loader
      this.isLoading = true;

      // header configration
      let config = {
        headers: {
          Authorization: sessionStorage.getItem("userToken"),
        },
      };

      // ensure password fields are the same before progressing
      if (this.password.newPassword !== this.password.confirmPassword) {
        // hide loader if password fields are not the same
        this.isLoading = false;

        // show notification to alert the user
        this.showNotif(
          "Please Check Password Fields and try Again",
          "red",
          "center"
        );
        return;
      }

      // request body object
      // take user id, current password and new password
      var info = {
        uid: sessionStorage.getItem("userUID"),
        currentPassword: this.password.currentPassword,
        newPassword: this.password.newPassword,
      };

      // make a patch request to to change password
      axios
        .patch(apiStrings.changePssword, info, config)
        .then((data) => {
          // get request response
          var response = data.data;

          // hide loader
          this.isLoading = false;
          if (response.success == true) {
            // go the home page if request was succuessful
            this.$router.go("-1");
          } else {

            // show response notification to the user if something go wrong
            this.showNotif(response.message, "red");
          }
        })
        .catch((e) => {
          // hide notification if an error occurs
          this.isLoading = false;

          // notify the user
          this.showNotif("Error occured. Please try again later", "red");
        });
    },
  },
};
</script>

<style scoped></style>
