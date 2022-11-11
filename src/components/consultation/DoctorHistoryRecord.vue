<template>
  <div>
    <div class="q-pa-md q-gutter-sm" v-if="!note">
      <q-btn
        color="primary"
        glossy
        @click="openDialog"
        label="Add History"
      ></q-btn>

      <div class="q-pa-md">No History added</div>
    </div>

    <div v-else class="q-pa-md">
      <q-btn color="primary" glossy label="Edit" @click="openDialog" />
      <body>
        <pre
          >{{ note }}
        </pre>
      </body>
    </div>
    <q-dialog v-model="dialog" position="right">
      <div style="height: 280px; width: 400px">
        <q-card>
          <q-card-section>
            <div class="text-subtitle1">History</div>
            <br />
            <q-input
              type="textarea"
              label="Enter History"
              v-model="finalDiagnosis"
            ></q-input>
          </q-card-section>
          <q-card-actions>
            <q-spinner-hourglass
              size="30px"
              color="red"
              v-if="addingNote"
            ></q-spinner-hourglass>
            <q-btn
              class="full-width"
              label="Save"
              color="primary"
              glossy
              @click="addFinalDiagnosis"
              v-else
            >
            </q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </q-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { useQuasar } from "quasar";
import { apiStrings } from "../../api_strings";
import { openedBooking } from "src/opened_booking";

export default {
  name: "DoctorHistoryRecord",

  setup() {
    const $q = useQuasar();
    return {
      showNotif(mgs, color) {
        $q.notify({
          message: mgs,
          color: color,
        });
      },

      addFinalDiagnosisNofify() {
        $q.notify({
          message: "Are you sure you want to save this History?",
          color: "white",
          position: "center",
          textColor: "black",
          actions: [
            {
              label: "Dismiss",
              color: "black",
              handler: () => {},
            },
            {
              label: "Save",
              color: "black",
              handler: () => {
                this.addDiagnosis();
              },
            },
          ],
        });
      },
    };
  },
  computed: {
    // booking() {
    //   return this.$store.getters["booking/getCurrentBooking"];
    // },
    user() {
      return this.$store.getters["user/user"];
    },
  },
  created() {
    this.booking = openedBooking();
    this.getBookingById();
  },
  mounted() {
    this.note = this.booking.history;
    this.finalDiagnosis = this.booking.history;
  },
  data() {
    return {
      booking: {},
      notedAdded: true,
      dialog: false,
      addingNote: false,
      note: "",
      finalDiagnosis: "",
    };
  },
  methods: {
    openDialog() {
      this.dialog = true;
    },

    addFinalDiagnosis() {
      if (this.finalDiagnosis !== "") {
        this.addFinalDiagnosisNofify();
      }
    },
    addDiagnosis() {
      this.addingNote = true;

      let config = {
        headers: {
          Authorization: sessionStorage.getItem("userToken"),
        },
      };

      var noteData = {
        bookingId: this.booking.bookingId,
        history: this.finalDiagnosis,
      };

      axios
        .patch(apiStrings.addHistory, noteData, config)
        .then((data) => {
          var response = data.data;

          this.addingNote = false;

          if (response.success == true) {
            this.showNotif(response.message, "green");
            this.dialog = false;
            this.note = this.finalDiagnosis;
          } else {
            this.showNotif(response.message, "red");
          }
        })
        .catch((e) => {
          this.showNotif(`${e}`, "red");
          this.addingNote = false;
        });
    },
    getBookingById() {
      let config = {
        headers: {
          Authorization: sessionStorage.getItem("userToken"),
        },
      };

      var bookingDetials = {
        bookingId: this.booking.bookingId,
      };

      axios
        .post(apiStrings.getBookingById, bookingDetials, config)
        .then((data) => {
          var response = data.data;
          if (response.success == true) {
            this.booking = response.data;
            this.note = this.booking.history;
            this.finalDiagnosis = this.note;
           
          }
        })
        .catch((e) => {
          this.isLoading = false;
        });
    },
  },
};
</script>

<style scoped>
.note-container {
  display: flex;
  justify-content: center;
}
</style>
