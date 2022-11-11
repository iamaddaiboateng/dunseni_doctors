<template>
  <q-page padding>
    <div class="row justify-center" style="height: 300px">
      <div class="col-xs-12 col-sm-6 col-md-4">
        <q-form>
          <div class="text-h4 q-py-md">Number Verification</div>

          <q-input
            filled
            type="text"
            v-model="signInData.phoneNumber"
            label="Phone Number"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Required']"
          />

          <div v-if="!sendingNumber">
            <br />
            <q-spinner-pie color="green" size="md" v-if="isLoading" />
            <q-btn
              class="full-width"
              label="Send"
              color="blue-10"
              glossy
              @click="otpRequest"
              v-else
            />
          </div>

          <div v-else>
            <q-input
              filled
              type="text"
              v-model="signInData.code"
              label="Verification Code"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Required']"
            />

            <div>
              <q-spinner-pie color="green" size="md" v-if="isLoading" />

              <q-btn
                class="full-width"
                type="submit"
                glossy
                v-else
                color="primary"
                @click="otpVerification"
              >
                Verify Number
              </q-btn>
              <br />
            </div>
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
      signInData: {
        phoneNumber: "",
        code: "",
      },

      isLoading: false,
      verifyingNumber: false,
      sendingNumber: false,
    };
  },

  methods: {
    ...mapActions("user", ["updateUser"]),

    // request otp to verify user
    otpRequest() {

      // ensure user number is not empty

      if(this.signInData.firstname === ''){
        this.showNotif('Phone Number is reqired', 'red')
        return
      }

      // show loader
      this.isLoading = true;

      // request body
      var info = {
        username: this.signInData.firstname,
      };
      // make post request
      axios
        .post(apiStrings.optRequest, info)
        .then((data) => {
          // get response
          var response = data.data;

          // hide loader
          this.isLoading = false;

          if (response.success == true) {
            // notify user
            this.showNotif(response.message, "green");

            // show verification field field by making sending number bool true
            this.sendingNumber = true;
          } else {
            // show error message if there is any
            this.showNotif(response.message, "red");
          }
        })
        .catch((e) => {
          // hide loader if
          this.isLoading = false;
          //  notify user about the error
          this.showNotif("Error occured. Please try again later", "red");
        });
    },

    // function to verify otp and phone number
    otpVerification() {

      // hide loader
      this.isLoading = true;

      // request body
      // request takes username (phone number) and code received from otp request
      var info = {
        username: this.signInData.phoneNumber,
        code: this.signInData.code,
      };

      // make post request to verify otp
      axios
        .post(apiStrings.otpVerify, info)
        .then((data) => {

          // get post response
          var response = data.data;

          // hide loader
          this.isLoading = false;

          if (response.success == true) {

            // notify user if request was successful
            this.showNotif(response.message, "green");

            // save reset phone number
            // to be used on the reset password page
            sessionStorage.setItem("resetNumber", info.username);

            // navigate to the reset password page
            this.$router.push({ name: "ResetPassword" });
          } else {

            // notify user if something goes wrong
            this.showNotif(response.message, "red");
          }
        })
        .catch((e) => {
          // hide notification if there is an error
          this.isLoading = false;

          // notify user about the error
          this.showNotif("Error occured. Please try again later", "red");
        });
    },
  },
};
</script>

<style scoped></style>
