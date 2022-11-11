<template>
  <q-page padding>
    <div class="row justify-content-center">
      <div class="col-12">
        <p class="text-subtitle1 text-weight-light" style="font-size: 25px">
          Bookings
        </p>

        <q-table
          bordered
          :columns="columns"
          :rows="rows"
          :rows-per-page-options="[10, 0]"
          :loading="isLoading"
          :filter="filter"
        >
          <template v-slot:top-right>
            <q-input
              borderless
              dense
              debounce="300"
              v-model="filter"
              placeholder="Search"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="serviceNo" :props="props">
                {{ props.row.serviceNo }}
              </q-td>
              <q-td key="isSelf" :props="props">
                {{ props.row.isSelf === true ? "Personnel" : "Dependent" }}
              </q-td>
              <q-td key="name" :props="props">
                {{ props.row.name }}
              </q-td>
              <!-- <q-td key="dob" :props="props">
                {{ dateOfBirth(props.row.dob) }}
              </q-td> -->
              <q-td key="height" :props="props">
                {{ calHeightFeet(props.row.height) }} / {{ props.row.height }}
              </q-td>
              <q-td key="weight" :props="props">
                {{ props.row.weight }} / {{ calWeightPound(props.row.weight) }}
              </q-td>
              <q-td key="date" :props="props">
                {{ momentData(props.row.fromTime ?? props.from) }}
              </q-td>
              <q-td key="createdAt" :props="props">
                {{ momenttime(props.row.createdAt) }}
              </q-td>
              <q-td key="emergency" :props="props">
                <q-badge :color="caseType(props.row.emergency)">
                  <div class="q-pa-sm">
                    {{ props.row.emergency === true ? "Emergency" : "Regular" }}
                  </div>
                </q-badge>
              </q-td>

              <q-td>
                <q-btn
                  @click="showBookingDetails(props.row)"
                  size="md"
                  glossy
                  color="blue"
                  >Details</q-btn
                >
              </q-td>
              <q-td>
                <q-btn
                  @click="showBookingHistory(props.row)"
                  size="md"
                  glossy
                  color="teal"
                  >Previous History</q-btn
                >
              </q-td>
              <q-td>
                <q-btn
                  @click="showCancellingDialog(props.row)"
                  size="md"
                  glossy
                  color="red"
                  >Cancel</q-btn
                >
              </q-td>
            </q-tr>
          </template>
          <template v-slot:no-data="{ icon, filter }">
            <div class="full-width row flex-center text-accent q-gutter-sm">
              <q-icon size="2em" name="loading" />
              <span class="text-subtitle2"> No Booking Available </span>
              <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
            </div>
          </template>
        </q-table>
      </div>
      <!-- <div class="col-3 q-pl-md">
        <p class="text-subtitle1 text-weight-light" style="font-size: 25px">
          Profile
        </p>
        <profile></profile>
      </div> -->
    </div>
    <q-dialog
      v-model="bar2"
      transition-show="flip-down"
      transition-hide="flip-up"
    >
      <q-card class="bg-primary text-white" style="width: 30vw">
        <q-bar>
          <div>Other Details</div>

          <q-space />

          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <div class="text-caption">Symptoms:</div>
          <div class="text-body1">
            <pre>{{ booking.medicalCondition }}</pre>
          </div>
          <br />
          <!-- <div class="text-caption"> Booking Id: </div>
          <div class="text-body1"> {{booking.bookingId}} </div> -->

          <q-spinner-gears
            size="50px"
            v-if="startingConsultation"
          ></q-spinner-gears>

          <q-btn v-else glossy @click="startConsultation()"
            >Start Consultation</q-btn
          >
        </q-card-section>

        <q-card-section class="q-pt-none"> </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="historyDialog" position="right">
      <q-card style="width: 50rem">
        <q-card-section>
          <div class="text-subtitle1">Patient History</div>
          <hr />
          <booking-history></booking-history>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapActions } from "vuex";
import axios from "axios";
import { useQuasar } from "quasar";
import moment from "moment";
import { apiStrings } from "../../api_strings";
import BookingHistory from "../../components/consultation/BookingHistory.vue";
import ConsultationHistory from "./ConsultationHistory.vue";
import Profile from "../profile/DoctorProfile.vue";
import { openedBooking } from "../../opened_booking";
import { setOpenedBooking } from "../../opened_booking";

const columns = [
  {
    name: "serviceNo",
    required: true,
    label: "Service Number",
    align: "left",
    field: "serviceNo",
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "isSelf",
    required: true,
    label: "Category",
    align: "left",
    field: "isSelf",
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "name",
    required: true,
    label: "Name",
    align: "left",
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  // { name: "dob", align: "left", label: "Age", field: "dob", sortable: true },
  {
    name: "height",
    align: "left",
    label: "Height (ft / m)",
    field: "height",
    sortable: true,
  },
  {
    name: "weight",
    align: "left",
    label: "Weight (kg / lb )",
    field: "weight",
    sortable: true,
  },
  {
    name: "date",
    align: "left",
    label: "Date",
    field: "fromTime",
    sortable: true,
  },
  {
    name: "createdAt",
    align: "left",
    label: "Time",
    field: "createdAt",
    sortable: true,
  },
  {
    name: "emergency",
    align: "left",
    label: "Case Type",
    field: "emergency",
    sortable: true,
  },

  //   { name: 'time',  align: 'left', label: 'Time', field: 'from', format: val => moment(val).format('hh:mm:ss') },
  //   { name: 'status',  align: 'left', label: 'Status', field: 'status' },
];

const rows = [];
export default {
  name: "Bookings",
  created() {
    setInterval(() => {
      this.getAllBookings();
    }, 10000);
    // this.getAllBookings();
  },
  mounted() {
    setInterval(this.getAllBookings(), 500);
  },
  components: {
    BookingHistory,
  },
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
      showDialog(row) {
        $q.dialog({
          title: "Cancel Booking",
          message: "Will you want to cancel this booking",
        })
          .onOk(() => {
            this.cancelSession(row);
          })
          .onCancel(() => {});
      },
    };
  },
  data() {
    return {
      columns,
      rows,
      isLoading: true,
      startingConsultation: false,
      historyDialog: false,
      bar2: false,
      bookingId: "",
      medicalCondition: "",
      clientid: "",
      filter: "",
    };
  },
  computed: {
    user() {
      return this.$store.getters["user/user"];
    },
    booking() {
      return this.$store.getters["booking/getCurrentBooking"];
    },
  },

  methods: {
    ...mapActions("user", ["updateUser"]),
    ...mapActions("booking", ["updateBooking"]),
    caseType(caseType) {
      if (caseType === true) {
        return "red";
      } else {
        return "teal";
      }
    },
    showQueueWindowsNotification() {
      // function to show actaul notification
      function showQueueNotification() {
        const notification = new Notification("Queue Alert", {
          body: "There is a new patient in the queue",
          icon: "icons/dunseni_logo.png",
        });

        // open booking page when user click on the notification
        notification.onclick = () => {
          window.location.href = "/#/bookings";
        };
      }

      // check permission

      if (Notification.permission === "granted") {
        // show notification if client has already granted the request
        showQueueNotification();
      } else if (Notification.permission !== "denied") {
        // request permission to show notification
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            showQueueNotification();
          }
        });
      }
    },
    showBookingDetails(bookingData) {
      this.updateBooking({ bookingData: bookingData });
      setOpenedBooking(bookingData);
      openedBooking(bookingData);
      if (bookingData.status == "Cancelled") {
        this.showNotif("This booking is cancelled", "red", "center");
      } else {
        this.bar2 = true;
      }
    },
    showBookingHistory(bookingData) {
      this.updateBooking({ bookingData: bookingData });
      setOpenedBooking(bookingData);
      if (bookingData.status == "Cancelled") {
        this.showNotif("This booking is cancelled", "red", "center");
      } else {
        this.historyDialog = true;
      }
    },

    showCancellingDialog(row) {
      this.showDialog(row);
    },

    getAllBookings() {
      const currentRowLength = this.rows.length;

      if (rows.length < 1) {
        this.isLoading = true;
      }

      let config = {
        headers: {
          Authorization: sessionStorage.getItem("userToken"),
        },
      };

      axios
        .post(apiStrings.getBookings, { doctorId: this.user.uid }, config)
        .then((data) => {
          var response = data.data;

          this.isLoading = false;

          if (response.success == true) {
            // this.showNotif(response.message, 'green')
            this.rows = response.data;

            if (this.rows.length > currentRowLength) {
              this.showQueueWindowsNotification();
            }
          } else {
            this.showNotif(response.message, "red");
          }
        })
        .catch((e) => {
          this.isLoading = false;
        });
    },

    startConsultation() {
      this.startingConsultation = true;

      let config = {
        headers: {
          Authorization: sessionStorage.getItem("userToken"),
        },
      };

      var consultationData = {
        userId: this.user.uid,
        bookingId: this.booking.bookingId,
      };

      axios
        .post(apiStrings.getAgoraToken, consultationData, config)
        .then((data) => {
          var response = data.data;

          this.isLoading = false;

          if (response.success === true) {
            sessionStorage.setItem("agoraAppID", response.data.appId);
            sessionStorage.setItem("agoraToken", response.data.token);
            sessionStorage.setItem("agoraChannel", response.data.appChannel);
            sessionStorage.setItem("agoraUID", response.data.uid);

            this.showNotif("This call is end to end encrypted", "green");
            this.$router.push({ name: "Consultation" });

            this.sendNotification();
            this.startSession();
          } else {
            this.showNotif(response.message, "red");
          }
        })
        .catch((e) => {
          this.isLoading = false;
        });
    },
    cancelSession(row) {
      let config = {
        headers: {
          Authorization: sessionStorage.getItem("userToken"),
        },
      };

      var bookingDetials = {
        bookingId: row.bookingId,
        uid: sessionStorage.getItem("userUID"),
        comment: "Client didn't show up",
      };

      axios
        .patch(apiStrings.cancelBooking, bookingDetials, config)
        .then((data) => {
          var response = data.data;
          if (response.success == true) {
            this.showNotif("Booking is Cancel", "red");
            const index = rows.indexOf(row);
            if (index > -1) {
              rows.splice(index, 1);
            }
          }
        })
        .catch((e) => {
          this.isLoading = false;
        });
    },
    momenttime(time) {
      return moment(time).format("hh:mm A");
    },
    momentData(date) {
      return moment(date).format("ddd, Do MMM, YYYY");
    },
    dateOfBirth(date) {
      var year = moment(date).format("YYYY");
      var thisYear = new Date().getFullYear();
      var age = parseInt(thisYear) - parseInt(year);
      return `${age}`;
    },
    sendNotification() {
      let config = {
        headers: {
          Authorization: sessionStorage.getItem("userToken"),
        },
      };

      var videoData = {
        type: "video call",
        source: "web",
        channel: sessionStorage.getItem("agoraChannel"),
        sentFrom: sessionStorage.getItem("uid"),
        to: this.booking.clientId,
        uid: sessionStorage.getItem("agoraUID"),
        token: sessionStorage.getItem("agoraToken"),
      };

      var notificationData = {
        data: videoData,
        notification: {
          title: "Consultation",
          body: "Doctor is ready",
        },
        to: `/topics/${this.booking.clientId}`,
      };

      axios
        .post(apiStrings.notification, notificationData, config)
        .then((data) => {
          var response = data.data;

          this.isLoading = false;

          if (response.success == true) {
            this.showNotif("Client has been notified", "blue");
          } else {
            this.showNotif(response.message, "red");
          }
        })
        .catch((e) => {
          this.isLoading = false;
        });
    },
    startSession() {
      let config = {
        headers: {
          Authorization: sessionStorage.getItem("userToken"),
        },
      };

      var bookingDetials = {
        bookingId: this.booking.bookingId,
        doctorId: sessionStorage.getItem("userUID"),
      };

      axios
        .patch(apiStrings.startSession, bookingDetials, config)
        .then((data) => {
          var response = data.data;
        })
        .catch((e) => {
          this.isLoading = false;
        });
    },
    calHeightFeet(height) {
      var result = height * 3.28084;
      return result.toFixed(2);
    },
    calWeightPound(weight) {
      var retult = weight * 2.20462;
      return retult.toFixed(2);
    },
  },
};
</script>

<style scoped></style>
