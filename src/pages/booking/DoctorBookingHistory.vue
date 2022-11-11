<template>
  <q-page padding>
    <q-table
      bordered
      title="Previous Bookings"
      title-class="text-h5 text-weight-light"
      :rows-per-page-options="[10, 0]"
      :columns="columns"
      :rows="rows"
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
            {{ momentData(props.row.fromTime) }}
          </q-td>

          <q-td key="status" :props="props">
            <div
              class="q-pa-sm"
              :id="
                props.row.status === 'Completed' ? 'completed' : 'in-session'
              "
            >
              {{ props.row.status }}
            </div>
          </q-td>

          <q-td key="emergency" :props="props">
            <div
              class="q-pa-sm"
              :id="props.row.emergency === true ? 'emergency' : 'regular'"
            >
              {{ props.row.emergency === true ? "Emergency" : "Regular" }}
            </div>
          </q-td>

          <!-- <q-td  key="status" :props="props">
                            <q-badge class="q-pa-sm" :color=" props.row.status == 'Cancelled'? 'red' : 'green'">
                                {{ props.row.status }}
                            </q-badge>
                             </q-td> -->
          <q-td>
            <q-btn
              @click="showBookingDetailsDialog(props.row)"
              size="md"
              glossy
              color="blue"
              >Details</q-btn
            >
          </q-td>

          <q-td>
            <q-btn flat size="md" icon="more_vert">
              <q-menu>
                <q-list>
                  <q-item
                    clickable
                    v-close-popup
                    @click="showBookingDetails(props.row)"
                  >
                    <q-item-section>
                      <q-item-label>Diagnosis</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item
                    clickable
                    v-close-popup
                    @click="sessionHisDialog = true"
                  >
                    <q-item-section>
                      <q-item-label>History</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item
                    clickable
                    v-close-popup
                    @click="showBookingPres(props.row)"
                  >
                    <q-item-section>
                      <q-item-label>Treatment Plan</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    v-close-popup
                    @click="showBookingLab(props.row)"
                  >
                    <q-item-section>
                      <q-item-label>Labs</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    v-close-popup
                    @click="showBookingHistory(props.row)"
                  >
                    <q-item-section>
                      <q-item-label>Previous History</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item
                    v-if="props.row.ExcuseDuty.length > 0"
                    clickable
                    v-close-popup
                    @click="openExcuseDuty(props.row.ExcuseDuty[0])"
                  >
                    <q-item-section>
                      <q-item-label>Ecuse Duty</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
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

    <q-dialog
      v-model="detailsDialog"
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
            <pre> {{ booking.medicalCondition }}</pre>
          </div>

          <br />
          <q-spinner-gears
            size="50px"
            v-if="startingConsultation"
          ></q-spinner-gears>

          <div v-else>
            <q-btn
              v-show="booking.status == 'In session'"
              glossy
              @click="startConsultation()"
              >Start Consultation</q-btn
            >
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none"> </q-card-section>
      </q-card>
    </q-dialog>
    <!-- diagnosis -->
    <q-dialog
      v-model="diagnosisDialog"
      transition-show="flip-down"
      transition-hide="flip-up"
    >
      <q-card class="bg-primary text-white" style="width: 30vw">
        <q-bar>
          <div>Diagnosis</div>
        </q-bar>

        <q-card-section>
          <div class="text-body1" v-if="booking.note == null">
            No Diagnosis Found
          </div>
          <div class="text-body1" v-else>
            <pre>{{ booking.note }}</pre>
          </div>
          <br />
        </q-card-section>
        <q-card-section class="q-pt-none"> </q-card-section>
      </q-card>
    </q-dialog>

    <!-- session history dialog -->
    <q-dialog
      v-model="sessionHisDialog"
      transition-show="flip-down"
      transition-hide="flip-up"
    >
      <q-card class="bg-primary text-white" style="width: 30vw">
        <q-bar>
          <div>History</div>
        </q-bar>

        <q-card-section>
          <div class="text-body1" v-if="booking.history == null">
            No History Found
          </div>
          <div class="text-body1" v-else>
            <pre> {{ booking.history }}</pre>
          </div>
          <br />
        </q-card-section>
        <q-card-section class="q-pt-none"> </q-card-section>
      </q-card>
    </q-dialog>

    <!-- patient history -->
    <q-dialog v-model="historyDialog" position="right">
      <q-card style="width: 50rem">
        <q-card-section>
          <div class="text-subtitle1">Patient History</div>
          <hr />
          <booking-history></booking-history>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- pres dialog -->
    <q-dialog v-model="presDialog">
      <q-card style="width: 400px">
        <q-bar>
          <div>Treatment Plan</div>
        </q-bar>
        <q-card-section>
          <q-expansion-item
            class="shadow-1 overflow-hidden q-ma-md"
            style="border-radius: 30px"
            icon="explore"
            label="Non-Pharmacology Treatment"
            header-class="bg-primary text-white"
            expand-icon-class="text-white"
          >
            <q-card class="q-ma-sm">
              <q-card-section>
                <div
                  class="text-h6 q-ma-md"
                  v-if="
                    booking.pharmacology === null || booking.pharmacology === ''
                  "
                >
                  No Treatment Found
                </div>
                <div v-else>
                  <pre>{{ booking.pharmacology }}</pre>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-expansion-item
            class="shadow-1 overflow-hidden q-ma-md"
            style="border-radius: 30px"
            icon="medication"
            label="Pharmacology Treatment"
            header-class="bg-primary text-white"
            expand-icon-class="text-white"
          >
            <div class="text-h6 q-ma-md" v-if="booking.Prescriptions < 1">
              No Prescription Found
            </div>
            <q-list>
              <q-item v-for="(pres, i) in booking.Prescriptions" :key="i">
                <q-item-section>
                  <q-item-label> {{ pres.title }} </q-item-label>
                  <q-item-label caption> {{ pres.description }} </q-item-label>
                  <q-item-label caption>
                    {{ momentData(pres.updatedAt) }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- labs dialog -->
    <q-dialog v-model="labDialog">
      <q-card style="width: 400px">
        <q-bar>
          <div>Lab</div>
        </q-bar>
        <q-card-section>
          <div>
            <q-btn
              label="Result"
              color="blue-10"
              glossy
              @click="getLabResult(booking.LabFiles)"
              v-show="booking.LabFiles.length > 0"
            >
            </q-btn>
          </div>

          <hr />
          <div class="text-h6" v-if="booking.Lab < 1">No Labs Found</div>
          <q-list>
            <q-item v-for="(pres, i) in booking.Lab" :key="i">
              <q-item-section>
                <q-item-label> {{ pres.label }} </q-item-label>
                <q-item-label caption> {{ pres.description }} </q-item-label>
                <q-item-label caption>
                  {{ momentData(pres.updatedAt) }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- labs dialog -->

    <q-dialog v-model="presDetailDialog">
      <q-card style="width: 400px">
        <q-bar>
          <div>Prescriptions</div>
        </q-bar>
        <q-card-section>
          <prescription :openPres="true" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- lab dialog -->
    <q-dialog v-model="labMainDialog">
      <q-card style="width: 400px">
        <q-bar>
          <div>Lab</div>
        </q-bar>
        <q-card-section>
          <lab :openLabs="true" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- lab result -->
    <q-dialog v-model="resultDialog" full-height>
      <q-card class="column full-height" style="width: 80vw; max-width: 80vw">
        <q-card-section>
          <!-- <q-btn label="Download" color="teal" glossy @click="requestPdf" /> -->
          <q-carousel
            v-model="slide"
            transition-prev="slide-right"
            transition-next="slide-left"
            swipeable
            animated
            control-color="primary"
            navigation
            padding
            arrows
            height="85vh"
            class="bg-grey-1 shadow-2 rounded-borders"
          >
            <q-carousel-slide
              v-for="(result, i) in labResultList"
              :key="i"
              :name="i"
            >
              <q-img :src="result">
                <template v-slot:error>
                  <div class="absolute-full flex flex-center">
                    Cannot load image
                  </div>
                </template>
              </q-img>
            </q-carousel-slide>
          </q-carousel>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- excuse doctor -->
    <q-dialog
      v-model="excuseDutyDialog"
      transition-show="flip-down"
      transition-hide="flip-up"
    >
      <excuse-duty-details
        style="width: 400px"
        :ecuseDuty="selectedExcuseDuty"
      />
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
import Lab from "../../components/consultation/LabComponent.vue";
import Prescription from "../../components/consultation/Prescription.vue";

import { setOpenedBooking } from "../../opened_booking";
import ExcuseDutyDetails from "../../components/consultation/ExcuseDutyDetails.vue";

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
    label: "Weight (kg / lb)",
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
    name: "status",
    align: "left",
    label: "Status",
    field: "status",
    sortable: true,
  },
  {
    name: "emergency",
    align: "left",
    label: "Case Type",
    field: "emergency",
    sortable: true,
  },
];

const rows = [];
export default {
  name: "Bookings",
  created() {
    this.getAllBookings();
  },
  components: {
    BookingHistory,
    Lab,
    Prescription,
    ExcuseDutyDetails,
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
      detailsDialog: false,
      sessionHisDialog: false,
      startingConsultation: false,
      historyDialog: false,
      presDialog: false,
      presDetailDialog: false,
      labDialog: false,
      labMainDialog: false,
      resultDialog: false,
      diagnosisDialog: false,
      excuseDutyDialog: false,
      selectedExcuseDuty: {},
      slide: 0,
      labResultList: [],
      bookingId: "",
      medicalCondition: "",
      clientid: "",
      filter: "",
      selectedLabResult: "",
    };
  },
  computed: {
    // set user details from vues
    user() {
      return this.$store.getters["user/user"];
    },

    // get booking details
    booking() {
      return this.$store.getters["booking/getCurrentBooking"];
    },
  },
  methods: {
    // get update user action
    ...mapActions("user", ["updateUser"]),

    // get booking update actions
    ...mapActions("booking", ["updateBooking"]),

    // function to check case type (emergency of regular)
    // function takes the caseType (boolean) arguement
    // if the case is any emergency the caseType will be true
    // if the case is regular the caseType will be false
    // the function returns red if the caseType is true
    // but returns teal if the caseType is false
    // the function is used to display the background color of case type
    caseType(caseType) {
      if (caseType === true) {
        return "red";
      } else {
        return "teal";
      }
    },
    // downloadURI(dataurl, filename) {
    //   const link = document.createElement("a");
    //   link.href = dataurl;
    //   link.download = filename;
    //   link.click();
    //   document.body.removeChild(link);
    // },

    // downloadLabResults() {
    //   this.labResultList.forEach((element) => {
    //     this.downloadURI(element, element);
    //     // window.open(element).focus();
    //   });
    // },

    showBookingDetailsDialog(bookingData) {
      this.updateBooking({ bookingData: bookingData });
      setOpenedBooking(bookingData);
      if (bookingData.status == "Cancelled") {
        this.showNotif("This booking is cancelled", "red", "center");
      } else {
        this.detailsDialog = true;
      }
    },
    showBookingDetails(bookingData) {
      this.updateBooking({ bookingData: bookingData });
      setOpenedBooking(bookingData);
      if (bookingData.status == "Cancelled") {
        this.showNotif("This booking is cancelled", "red", "center");
      } else {
        this.diagnosisDialog = true;
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

    showBookingPres(bookingData) {
      this.updateBooking({ bookingData: bookingData });
      setOpenedBooking(bookingData);
      if (bookingData.status == "Cancelled") {
        this.showNotif("This booking is cancelled", "red", "center");
      } else {
        this.presDialog = true;
      }
    },

    showBookingLab(bookingData) {
      this.updateBooking({ bookingData: bookingData });
      setOpenedBooking(bookingData);

      if (bookingData.status == "Cancelled") {
        this.showNotif("This booking is cancelled", "red", "center");
      } else {
        this.labDialog = true;
      }
    },

    openPresDetailsDialog() {
      this.presDetailDialog = true;
      this.presDialog = false;
    },
    openLabsDetailsDialog() {
      this.labMainDialog = true;
      this.labDialog = false;
    },

    showCancellingDialog(row) {
      this.showDialog(row);
    },

    getLabResult(labFiles) {
      this.slide = 0;
      this.labResultList = [];
      labFiles.forEach((element) => {
        var labResultUrl = `${apiStrings.files}${element.fileName}`;
        this.labResultList.push(labResultUrl);
      });

      this.resultDialog = true;
    },

    getAllBookings() {
      let config = {
        headers: {
          Authorization: sessionStorage.getItem("userToken"),
        },
      };

      axios
        .post(
          apiStrings.getBookingsCompleted,
          { doctorId: sessionStorage.getItem("userUID") },
          config
        )
        .then((data) => {
          var response = data.data;

          this.isLoading = false;

          if (response.success == true) {
            // this.showNotif(response.message, 'green')
            this.rows = response.data;
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
    // cancelSession(row) {
    //   let config = {
    //     headers: {
    //       Authorization: sessionStorage.getItem("userToken"),
    //     },
    //   };

    //   var bookingDetials = {
    //     bookingId: row.bookingId,
    //     uid: sessionStorage.getItem("userUID"),
    //     comment: "Client didn't show up",
    //   };

    //   axios
    //     .patch(apiStrings.cancelBooking, bookingDetials, config)
    //     .then((data) => {
    //       var response = data.data;
    //       if (response.success == true) {
    //         this.showNotif("Booking is Cancel", "red");
    //         const index = rows.indexOf(row);
    //         if (index > -1) {
    //           rows.splice(index, 1);
    //         }
    //       }
    //     })
    //     .catch((e) => {
    //       this.isLoading = false;
    //     });
    // },
    momenttime(time) {
      return moment(time).format("hh:mm");
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
    requestPdf() {
      let config = {
        headers: {
          Authorization: sessionStorage.getItem("userToken"),
        },
      };

      var bookingDetials = {
        bookingId: this.booking.bookingId,
      };

      axios
        .patch(apiStrings.pdfFiles, bookingDetials, config)
        .then((data) => {
          var response = data.data;
        })
        .catch((e) => {
          this.isLoading = false;
        });
    },
    statusColor(status) {
      if (status == "In session") {
        return "yellow-10";
      } else {
        return "teal-10";
      }
    },
    openExcuseDuty(excuseDuty) {
      this.excuseDutyDialog = true;
      this.selectedExcuseDuty = excuseDuty;
    },
  },
};
</script>

<style scoped>
#lab-header {
  display: flex;
  justify-content: space-between;
}

#emergency {
  color: red;
  font-weight: bold;
}

#regular {
  color: teal;
  font-weight: bold;
}

#completed {
  color: blue;
  font-weight: bold;
}

#in-session {
  color: rgb(124, 124, 20);
  font-weight: bold;
}
</style>
