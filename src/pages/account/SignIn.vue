<template>
  <q-page class="background-img" padding>
    <div class="row justify-end" style="height: 300px">
      <div class="col-xs-12 col-sm-6 col-md-4">
        <q-card>
          <q-card-section>
            <q-form @submit="signIn">
              <div class="text-h4 q-py-md">Sign In</div>
              <q-input
                filled
                type="text"
                v-model="signInData.firstname"
                label="Phone Number"
                :rules="[(val) => (val && val.length > 0) || 'Required']"
              />

              <q-input
                filled
                type="password"
                v-model="signInData.password"
                label="Password"
                :rules="[(val) => (val && val.length > 0) || 'Required']"
              />
              <br />

              <div>
                <q-spinner-pie color="green" size="md" v-if="isLoading" />

                <q-btn
                  class="full-width"
                  glossy
                  type="submit"
                  v-else
                  color="primary"
                >
                  Sign In
                </q-btn>
                <br />
              </div>
              <div>
                <q-btn
                  class="full-width"
                  flat
                  label="Forgotten Password"
                  color="teal"
                  no-caps
                  @click="$router.push({ name: 'PhoneVerification' })"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
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
  name: "SignIn",
  setup() {
    const $q = useQuasar();

    return {
      showNotif(mgs, color, position) {
        $q.notify({
          message: mgs,
          color: color,
          position: position,
        });
      },

      showLoader() {
        $q.loading.show();
      },
      hideLoader() {
        $q.loading.hide();
      },
    };
  },

  created() {
    sessionStorage.setItem("isSignedIn", "false");
  },
  data() {
    return {
      signInData: {
        firstname: "",
        password: "",
      },

      isLoading: false,
    };
  },

  methods: {
    ...mapActions("user", ["updateUser"]),

    // sign in function
    signIn() {
      // this.isLoading = true;
      this.showLoader();

      // request body
      // body takes username (phone number) and password
       var info = {
        username: this.signInData.firstname,
        password: this.signInData.password,
      };

      // make post request to sign in user
      axios
        .post(apiStrings.signInUrl, info)
        .then((data) => {
          var response = data.data;

          // this.isLoading = false;
          // hide loader
          this.hideLoader();

          if (response.success == true) {
            // if request is successful
            // ensure the logged in user is a doctor
            // if not notify the user he/she doesn't have permission to use the app
            // if (response.data.role !== 2) {

            //   this.showNotif(
            //     `Hello ${response.data.firstName}, You are not permited to use this app`,
            //     "blue-10",
            //     "center"
            //   );

            //   return;
            // }

            // notify user if sign in was successful and is a doctor
            this.showNotif(response.message, "green");

            // navigate to main booking page
            this.$router.push({ name: "Bookings" });

            // upload user details on vuex
            this.updateUser({ userData: response.data });

            // update user details on session storage
            sessionStorage.setItem(
              "userDetails",
              JSON.stringify(response.data)
            );

            // save user token on session storage
            sessionStorage.setItem("userToken", response.data.token);

            // save user id
            sessionStorage.setItem("userUID", response.data.uid);

            // set sign in check to true
            sessionStorage.setItem("isSignedIn", "true");
          } else {

            // notify user if something went wrong
            this.showNotif(response.message, "red");
          }
        })
        .catch((e) => {
          // this.isLoading = false;
          this.hideLoader();

          // notify user if there is an error
          this.showNotif("Error occured. Please try again later", "red");
        });
    },
  },
};
</script>

<style scoped>
.background-img {
  background-image: url("~assets/dun_doc.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  min-height: 40vh;
  box-shadow: inset 0 0 0 rgba(0, 0, 0, 0.6);
}
</style>
