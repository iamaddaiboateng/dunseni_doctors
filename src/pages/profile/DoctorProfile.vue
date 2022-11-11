<template>
  <div>
    <q-card>
      <q-img
        v-if="this.profilePicture == null"
        src="https://media.istockphoto.com/photos/portrait-of-mature-male-doctor-wearing-white-coat-standing-in-picture-id1203995945?k=20&m=1203995945&s=612x612&w=0&h=g0_ioNezBqP0NXrR_36-A5NDHIR0nLabFFrAQVk4PhA="
        style="height: 40vh"
      >
        <div class="absolute-bottom-right">
          <q-btn
            flat
            label="Upload Profile"
            @click="profilePicDialog = true"
          ></q-btn>
        </div>
      </q-img>
      <q-img v-else :src="userDetails.profilePicture" style="height: 40vh">
        <div class="absolute-bottom-right">
          <q-btn flat label="Edit" @click="profilePicDialog = true"></q-btn>
        </div>
      </q-img>
      <!-- <div class="q-pa-sm">
        <q-btn
          glossy
          color="blue"
          label="Add Picture"
          @click="profilePicDialog = true"
        >
        </q-btn>
       
      </div> -->
      <q-card-section>
        <div class="text-h6">
          Dr. {{ userDetails?.firstName }} {{ userDetails?.lastName }}
        </div>
        <div class="text-subtitle1">{{ userDetails?.contactNumber }}</div>
        <div class="text-subtitle1">{{ userDetails?.email }}</div>
        <div>
          <q-btn
            class="q-mt-md"
            label="Change Password"
            glossy
            color="red"
            @click="$router.push({ name: 'ChangePassword' })"
          ></q-btn>
        </div>
        <div>
          <q-btn
            class="q-my-md"
            label="View History"
            glossy
            color="teal"
            @click="$router.push({ name: 'DoctorBookingHistory' })"
          ></q-btn>
        </div>
        <hr />
        <div>
          <q-btn
            label="Sign Out"
            outline
            color="red"
            @click="signOutAction"
          ></q-btn>
        </div>
      </q-card-section>
    </q-card>

    <q-dialog v-model="profilePicDialog">
      <q-card>
        <q-uploader
          :url="profileUri"
          :headers="[{ name: 'Authorization', value: token }]"
          field-name="file"
          style="max-width: 300px"
          label="Upload Profile Picture"
          @uploaded="uploadCompleted"
          @failed="uploadCompleted"
        />
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import { apiStrings } from "../../api_strings";

export default {
  name: "Profile",
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
      signOUtNotif() {
        $q.notify({
          message: "Are you sure you want to sign out",
          position: "center",
          color: "blue-10",
          actions: [
            { label: "DISMISS", color: "white", handler: () => {} },
            {
              label: "Sign Out",
              color: "white",
              handler: () => {
                this.signOut();
              },
            },
          ],
        });
      },
      showSignOutDialog() {
        $q.dialog({
          title: "Sign Out",
          message: "Are you sure you want to sign out",
          cancel: true,
        })
          .onOk(() => {
            this.signOut();
          })
          .onCancel(() => {});
      },
    };
  },
  data() {
    return {
      userDetails: {},
      profileUri: "",
      profilePicDialog: false,
      token: "",
      imageProfie: "",
      profilePicture: "",
    };
  },
  created() {
    setInterval(() => {
      this.getUserDetails();
    }, 1000);
  },

  methods: {
    signOutAction() {
      this.signOUtNotif();
    },

    signOut() {
      sessionStorage.removeItem("userDetails");
      sessionStorage.removeItem("userToken");
      sessionStorage.removeItem("userUID");
      sessionStorage.removeItem("isSignedIn");
      this.$router.push({ name: "SignInPage" });
    },
    uploadCompleted(info) {
      var xhr = info.xhr.response;
      var jsonBody = JSON.parse(xhr);

      if (jsonBody.success == true) {
        this.profilePicture = sessionStorage.getItem("userUID");
        this.imageProfie = `${this.userDetails.profilePicture}`;
      
        this.profilePicDialog = false;
      }
   
    },
    getUserDetails() {
      var rawData = sessionStorage.getItem("userDetails");
      this.token = sessionStorage.getItem("userToken");

      
      if (rawData === null) {
        return;
      }
      this.userDetails = JSON.parse(rawData);

      this.profileUri = `${apiStrings.profileImageUpload}${this.userDetails.uid}`;
      this.profilePicture = this.userDetails.profilePicture;
      this.imageProfie = `${apiStrings.doctorProfileImage}${this.userDetails.profilePicture}`;
    },
  },
};
</script>

<style lang="less" scoped>
</style>