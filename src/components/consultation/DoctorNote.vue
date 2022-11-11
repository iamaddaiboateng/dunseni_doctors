<template>
  <div>
    <div class="q-pa-md q-gutter-sm" v-if="!note">
      <q-btn
        color="primary"
        glossy
        @click="diagnosisAutoDialog = true"
        label="Add Diagnosis"
      ></q-btn>

      <div class="q-pa-md">No Diagnosis added</div>
    </div>

    <div v-else class="q-pa-md">
      <q-btn
        color="primary"
        glossy
        label="Edit"
        @click="diagnosisAutoDialog = true"
      />
      <body>
        <pre
          >{{ note }}
        </pre>
      </body>
    </div>
    <q-dialog v-model="dialog" position="right">
      <div style="width: 400px">
        <q-card>
          <q-card-section>
            <div class="text-subtitle1">Diagnosis</div>
            <br />
            <q-input
              type="textarea"
              label="Enter Diagnosis"
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

    <!-- diagnosis with auto suggestions -->
    <q-dialog v-model="diagnosisAutoDialog" persistent>
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section>
          <div
            class="text-subtitle1"
            style="display: flex; justify-content: space-between"
          >
            Add Diagnosis
            <q-btn
              round
              icon="close"
              glossy
              size="sm"
              color="red"
              @click="diagnosisAutoDialog = false"
            />
          </div>
          <hr />
          <div class="text-subtitle1">
            <div class="row">
              <div
                class="col-6 q-pa-sm"
                style="max-height: 300px; background-color: #d4ecdd"
              >
                <q-input
                  label="Enter Diagnosis"
                  dense
                  v-model="filterDiagosisString"
                  @update:model-value="filterSelectedDiagonis"
                ></q-input>
                <div class="lab-list-container" style="max-height: 85%">
                  <q-list>
                    <q-item
                      v-for="(diagnosis, i) in filteredDiagnosisResult"
                      :key="i"
                      clickable
                      @click="addSelectedDiagnosisToFinalDiagnosis(diagnosis)"
                    >
                      <q-item-section>
                        <q-item-label>
                          {{ diagnosis }}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>

                <div
                  class="q-ma-md"
                  v-show="
                    filterDiagosisString !== '' &&
                    filteredDiagnosisResult.length < 1
                  "
                >
                  <div class="text-h6"></div>
                  <q-btn
                    label="Add"
                    glossy
                    color="teal"
                    @click="
                      addSelectedDiagnosisToFinalDiagnosis(filterDiagosisString)
                    "
                  >
                  </q-btn>
                </div>
              </div>
              <!-- <div class="col q-ml-sm" style="margin-top: 110px">
                <q-btn
                  class="q-mb-md"
                  round
                  icon="arrow_right"
                  :color="addSelectedLabItem === '' ? 'grey' : 'teal'"
                  glossy
                  :disable="addSelectedLabItem === ''"
                  @click="labDescrrptionDialog = true"
                ></q-btn>
                <q-btn
                  round
                  icon="arrow_left"
                  :color="removeSelctedLabItem === '' ? 'grey' : 'red'"
                  @click="removeItemFromLab"
                  :disable="removeSelctedLabItem === ''"
                  glossy
                ></q-btn>
              </div> -->
              <div
                class="col-6 lab-list-container q-pa-sm"
                style="height: 300px; background-color: #f7f6f2"
              >
                <div>Diagnosis</div>
                <hr />
                <q-input
                  id="note-field"
                  type="textarea"
                  v-model="finalDiagnosisString"
                >
                </q-input>
              </div>
            </div>

            <q-checkbox
              class="text-h5 q-my-sm"
              label="Provisional"
              v-model="provisionalDiagnosisCheckBox"
            />
            <hr />

            <q-btn
              glossy
              color="blue-10"
              label="Save"
              @click="addFinalDiagnosis"
              class="q-ml-md full-width"
            ></q-btn>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { useQuasar } from "quasar";
import { apiStrings } from "../../api_strings";
import { openedBooking } from "src/opened_booking";
import { convertDiagnosis } from "../../scripts/diagnosis";
import { ref, onMounted } from "vue";

export default {
  name: "DoctorNote",

  setup() {
    // value for provisional diagnosis checkbox
    const provisionalDiagnosisCheckBox = ref(false);

    // model for opening diagonsis dialog
    const diagnosisAutoDialog = ref(false);

    // string for filtering diagnosis
    const filterDiagosisString = ref("");

    // select diagnosis var
    const selectedDiagnosis = ref("");

    // list of diagnosis
    const diagnosisList = ref();

    // final diagnosis to be sent to the database
    const finalDiagnosisString = ref("");

    // list of diagnosis after filtering
    const filteredDiagnosisResult = ref([]);

    // filter diagnosis list and assign result to filteredDiagnosisResult
    function filterSelectedDiagonis() {
      filteredDiagnosisResult.value = diagnosisList.value.filter((item) => {
        // convert diagnosis list items to lowercase
        // convert filterDiagosisString to lowercase
        // return diagnosis list items that include filterDiagnosisStrings
        return item
          .toString()
          .toLowerCase()
          .includes(filterDiagosisString.value.toLowerCase());
      });
    }

    // add selected diagnosis to final diagnosis
    function addSelectedDiagnosisToFinalDiagnosis(selectedDiagnosis) {
      finalDiagnosisString.value =
        finalDiagnosisString.value += `${selectedDiagnosis}\n`;
      selectedDiagnosis = "";
      filterDiagosisString.value = "";
    }

    async function getDiagnosis() {
      // assign diagnosis list to
      diagnosisList.value = convertDiagnosis();

      // assign  diagnosis list to filtered diagosis result
      filteredDiagnosisResult.value = diagnosisList.value;
    }

    onMounted(() => {
      getDiagnosis();
    });

    const $q = useQuasar();
    return {
      diagnosisAutoDialog,
      filterDiagosisString,
      filteredDiagnosisResult,
      finalDiagnosisString,
      provisionalDiagnosisCheckBox,
      addSelectedDiagnosisToFinalDiagnosis,
      filterSelectedDiagonis,
      showNotif(mgs, color) {
        $q.notify({
          message: mgs,
          color: color,
        });
      },
      showLoader() {
        $q.loading.show();
      },

      hideLoader() {
        $q.loading.hide();
      },

      addFinalDiagnosisNofify() {
        $q.notify({
          message: "Are you sure you want to save this diagnosis?",
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
    user() {
      return this.$store.getters["user/user"];
    },
  },
  created() {
    this.booking = openedBooking();
    this.getBookingById();
  },
  mounted() {
    this.note = this.booking.note;
    this.finalDiagnosis = this.booking.note;
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
      this.showLoader();

      let config = {
        headers: {
          Authorization: sessionStorage.getItem("userToken"),
        },
      };

      var formatFinalDiagnosisString = "";
      if (this.provisionalDiagnosisCheckBox === true) {
        formatFinalDiagnosisString = `(Provisional)\n${this.finalDiagnosisString}`;
      } else {
        formatFinalDiagnosisString = this.finalDiagnosisString;
      }

      var noteData = {
        bookingId: this.booking.bookingId,
        note: formatFinalDiagnosisString,
      };

      axios
        .patch(apiStrings.bookingUpdateNote, noteData, config)
        .then((data) => {
          var response = data.data;

          this.addingNote = false;
          this.hideLoader();

          if (response.success == true) {
            this.showNotif(response.message, "green");
            this.diagnosisAutoDialog = false;
            this.note = formatFinalDiagnosisString;
          } else {
            this.showNotif(response.message, "red");
          }
        })
        .catch((e) => {
          this.hideLoader();
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
            this.note = this.booking.note;
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
#note-field {
  height: 100%;
}

.lab-list-container {
  overflow-y: scroll;
}

.note-container {
  display: flex;
  justify-content: center;
}
</style>
