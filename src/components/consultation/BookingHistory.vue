<template>
  <div>
    <div class="q-pa-md" v-if="getingBookings">
      <q-spinner-pie color="green-10" size="50px" />
    </div>
    <q-list class="rounded-borders" v-else>
      <div class="text-h6" v-show="pastBookings.length < 1">
        No Record found
      </div>
      <div v-for="(pres, i) in pastBookings" :key="i">
        <q-expansion-item
          group="booking-history"
          style="width: 100%"
          :label="momentDate(pres.fromTime ?? pres.from)"
        >
          <!-- <template v-slot:header>

        </template> -->
          <q-card class="text-body1">
            <q-card-section>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Symptoms</q-item-label>
                  <q-item-label>
                    <pre style="margin: 0">{{
                      pres.medicalCondition ?? "N/A"
                    }}</pre>
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label caption> Diagnosis </q-item-label>
                  <q-item-label>
                    <div>{{ pres.note ?? "N/A" }}</div>
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label caption> History </q-item-label>
                  <q-item-label>
                    <div>{{ pres.history ?? "N/A" }}</div>
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label caption> Final Comment </q-item-label>
                  <q-item-label>
                    <div>{{ pres.finalComment ?? "N/A" }}</div>
                  </q-item-label>
                </q-item-section>
              </q-item>
              <div class="q-pa-md q-gutter-sm">
                <q-btn
                  color="teal"
                  glossy
                  @click="displayLabs(pres.Lab, pres.LabFiles)"
                  >Lab Result
                </q-btn>
                <q-btn
                  color="blue-10"
                  glossy
                  @click="displayPres(pres.Prescriptions)"
                  >Treatment Plan
                </q-btn>
                <q-btn
                  v-show="pres.ExcuseDuty.length > 0"
                  color="yellow-10"
                  glossy
                  @click="openExcuseDuty(pres.ExcuseDuty[0])"
                  >Excuse Duty
                </q-btn>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </div>
    </q-list>
    <!-- prescription dialog -->
    <q-dialog v-model="presDialog" position="right">
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
                    {{ momentDate(pres.updatedAt) }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="labsDialog" position="right">
      <q-card style="width: 400px">
        <q-card-section>
          <div
            class="text-subtitle1"
            style="display: flex; justify-content: space-between"
          >
            <span class="q-ma-sm"> Labs </span>
            <q-btn
              label="Result"
              glossy
              color="teal"
              @click="getLabResult"
              v-show="allLabFiles.length > 0"
            ></q-btn>
          </div>
          <hr />
          <div v-show="labDetails.length < 1">No Lab found</div>
          <div v-for="(lab, i) in labDetails" :key="i">
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label>
                    {{ lab.label }}
                  </q-item-label>
                  <q-item-label caption>
                    {{ lab.description }}
                  </q-item-label>
                </q-item-section>
                <!-- <q-item-section side>
                  <q-btn label="Result" color="teal" glossy @click="viewLabResult(lab.url)" />
                </q-item-section> -->
              </q-item>
            </q-list>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- show result dialog
    <q-dialog v-model="labResult" full-height>
      <q-card class="column full-height" style="width: 80vw; max-width: 80vw">
        <q-card-section>
          <iframe
            :src="selectedLabResult"
            frameborder="0"
            style="height: 85vh; width: 77vw; max-width: 80vw"
          ></iframe>
        </q-card-section>
      </q-card>
    </q-dialog> -->
    <!-- lab result -->
    <q-dialog v-model="labResult" full-height>
      <q-card class="column full-height" style="width: 80vw; max-width: 80vw">
        <q-card-section>
          <!-- <q-btn label="Download" color="teal" glossy /> -->
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
    <q-dialog v-model="excuseDutyDialog" position="right">
      <excuse-duty-details
        style="width: 400px"
        :ecuseDuty="selectedExcuseDuty"
      />
    </q-dialog>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import { useQuasar } from "quasar";
import { apiStrings } from "../../api_strings";
import { openedBooking } from "../../opened_booking";
import ExcuseDutyDetails from "../../components/consultation/ExcuseDutyDetails.vue";

export default {
  name: "BookingHistory",
  components: {
    ExcuseDutyDetails,
  },

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
  computed: {
    user() {
      return this.$store.getters["user/user"];
    },
  },

  data() {
    return {
      pastBookings: [],
      getingBookings: false,
      slide: 0,
      presDialog: false,
      labsDialog: false,
      labResult: false,
      excuseDutyDialog: false,
      labResultList: [],
      allLabFiles: [],
      booking: {},
      selectedExcuseDuty: {},
      labDetails: [],
      presDetails: [],
      selectedLabResult: "",
      currentBookingUri: null,
    };
  },
  mounted() {
    this.getClientHistory();
    this.booking = openedBooking();
  },
  created() {
    this.booking = openedBooking();
  },
  methods: {
    getClientHistory() {
      this.getingBookings = true;
      let config = {
        headers: {
          Authorization: sessionStorage.getItem("userToken"),
        },
      };

      axios
        .post(
          apiStrings.clientHistory,
          { clientId: this.booking.clientId },
          config
        )
        .then((data) => {
          var response = data.data;

          this.getingBookings = false;

          if (response.success == true) {
            this.pastBookings = response.data;
            this.dialog = false;
          } else {
            this.showNotif(response.message, "red");
          }
        })
        .catch((e) => {
          this.addingNote = false;
        });
    },
    displayPres(pres) {
      this.presDialog = true;
      this.presDetails = pres;
    },
    // displayHistory(pres) {
    //   this.historyDialog = true;
    //   this.presDetails = pres;
    // },

    displayLabs(labs, labResult) {
      this.labsDialog = true;
      this.labDetails = labs;
      this.allLabFiles = [];
      this.allLabFiles = labResult;
    },
    getLabResult() {
      this.labResultList = [];
      this.slide = 0;
      this.allLabFiles.forEach((element) => {
        var labResultUrl = `${apiStrings.files}${element.fileName}`;
        this.labResultList.push(labResultUrl);
      });

      this.labResult = true;
    },
    viewLabResult() {
      if (this.currentBookingUri == null || this.currentBookingUri === "") {
        this.showNotif("No result found", "red");
      } else {
        var pdfBase = apiStrings.files + `${this.currentBookingUri}`;

        this.showNotif("loading result", "teal");
        this.selectedLabResult = pdfBase;
        this.labResult = true;
      }
    },
    momentDate(date) {
      return moment(date).format("ddd, Do MMM, YYYY");
    },
    openExcuseDuty(excuseDuty) {
      this.excuseDutyDialog = true;
      this.selectedExcuseDuty = excuseDuty;
    },
  },
};
</script>

<style scoped></style>
