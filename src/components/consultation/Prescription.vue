<template>
  <div>
    <!-- pres view -->

    <div>
      <div>
        <!-- non pharmacology -->
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
              <div>
                <q-btn
                  color="teal"
                  glossy
                  :label="
                    finalNonPharm === '' || finalNonPharm == null
                      ? 'Add'
                      : 'Edit'
                  "
                  @click="nonPharmDialog = true"
                />
                <pre>{{
                  finalNonPharm === "" || finalNonPharm == null
                    ? "N/A"
                    : finalNonPharm
                }}</pre>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </div>
      <!-- pharmacology -->
      <q-expansion-item
        class="shadow-1 overflow-hidden q-ma-md"
        style="border-radius: 30px"
        icon="medication"
        label="Pharmacology Treatment"
        header-class="bg-primary text-white"
        expand-icon-class="text-white"
      >
        <div>
          <q-btn
            class="q-ma-md"
            label="Add"
            color="teal"
            glossy
            @click="presDialog = true"
          ></q-btn>
          <q-item v-show="finalDrugList.length < 1">
            <q-item-section>
              <q-item-label class="text-h6"> No Drug Added </q-item-label>
            </q-item-section>
          </q-item>
          <q-list>
            <q-item v-for="(drug, i) in finalDrugList" :key="i">
              <q-item-section avatar>
                <q-btn
                  round
                  size="sm"
                  color="red"
                  icon="delete"
                  @click="deletePresNotification(drug)"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-subtitle1">
                  {{ drug.title }}
                </q-item-label>
                <q-item-label caption>
                  {{ drug.details }}
                </q-item-label>
                <q-item-label caption> {{ drug.description }} </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-expansion-item>
    </div>

    <!-- main prescriptions dialog -->

    <q-dialog v-model="dialogOpened" position="right">
      <q-card style="width: 400px">
        <q-card-section>
          <div>Prescriptions</div>
          <hr />
          <q-btn label="Add Lab" glossy color="teal" @click="presDialog = true">
          </q-btn>

          <q-spinner-hourglass
            size="20px"
            color="red"
            v-if="addingDrug"
          ></q-spinner-hourglass>

          <q-btn
            glossy
            color="blue-10"
            label="Save"
            class="q-ml-md"
            @click="sendDrugToDataBase()"
            v-else
          ></q-btn>

          <q-list class="q-mt-md">
            <q-item v-for="(drug, i) in selectedDrugList" :key="i">
              <q-item-section>
                <q-item-label class="text-subtitle1">
                  {{ drug.title }}
                </q-item-label>
                <q-item-label caption>
                  {{ drug.details }}
                </q-item-label>
                <q-item-label caption> {{ drug.description }} </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- non pharm dialog -->

    <q-dialog v-model="nonPharmDialog" persistent>
      <div style="width: 700px; max-width: 80vw">
        <q-card>
          <q-card-section>
            <div
              class="text-h6"
              style="display: flex; justify-content: space-between"
            >
              Non Pharmacology
              <span
                ><q-btn
                  round
                  icon="close"
                  color="red"
                  size="xs"
                  glossy
                  @click="nonPharmDialog = false"
              /></span>
            </div>
            <hr />

            <div id="treatment-container">
              <q-card class="q-ma-sm">
                <q-card-section>
                  <div>
                    <q-form>
                      <q-input
                        v-model="nonPharm"
                        autofocus
                        type="textarea"
                        label="Please Enter Non-Pharmacology Treatment Here"
                      />
                      <q-btn
                        class="full-width"
                        label="Save "
                        color="primary"
                        glossy
                        @click="addNonPharm"
                      />
                    </q-form>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </q-dialog>

    <!-- main prescriptions dialog -->

    <q-dialog v-model="presDialog" persistent>
      <div style="width: 700px; max-width: 80vw">
        <q-card>
          <q-card-section>
            <div
              class="text-h6"
              style="display: flex; justify-content: space-between"
            >
              Pharmacology
              <span
                ><q-btn
                  round
                  icon="close"
                  color="red"
                  size="xs"
                  glossy
                  @click="presDone"
              /></span>
            </div>
            <hr />

            <div id="pres-container">
              <div>
                <div class="row">
                  <div
                    class="col q-pa-sm"
                    style="height: 300px; background-color: #d4ecdd"
                  >
                    <q-input
                      label="Drug Name"
                      dense
                      v-model="searchDrug"
                      @update:model-value="filterDrugs"
                    ></q-input>
                    <div id="drugs-list">
                      <q-list>
                        <q-item
                          v-for="(drug, i) in filteredPresList"
                          :key="i"
                          clickable
                          @click="setSelectedDrug(drug)"
                          :class="
                            selectedPresDrug === drug
                              ? 'bg-primary'
                              : 'bg-disabled'
                          "
                        >
                          <q-item-section>
                            <q-item-label> {{ drug }} </q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                      <div
                        class="q-ma-md"
                        v-show="
                          searchDrug !== '' && filteredPresList.length < 1
                        "
                      >
                        <q-btn
                          label="Add"
                          color="teal-10"
                          glossy
                          @click="addUnlistDrug"
                        />
                      </div>
                    </div>
                  </div>

                  <div
                    class="col q-ml-sm q-pa-sm"
                    style="height: 300px; background-color: #f7f6f2"
                  >
                    <!-- <q-input label="Drug" v-model="selectedPresDrug"> </q-input> -->
                    <div class="text-h6" v-show="selectedPresDrug === ''">
                      No Prescription Selected
                    </div>
                    <div class="text-h6">{{ selectedPresDrug }}</div>
                    <q-input
                      type="textarea"
                      rounded
                      label="Dosage"
                      v-model="presData.details"
                    ></q-input>

                    <q-btn
                      class="q-mt-md full-width"
                      label="Add"
                      glossy
                      color="blue-10"
                      @click="addPresDetails(selectedPresDrug)"
                    >
                    </q-btn>
                  </div>
                </div>
                <br />
                <div
                  class="text-body1"
                  style="display: flex; justify-content: space-between"
                >
                  Selected Drugs
                  <q-spinner-hourglass
                    size="20px"
                    color="red"
                    v-if="addingDrug"
                  ></q-spinner-hourglass>
                </div>
              </div>
              <hr />
              <div class="q-ma-md text-h6" v-show="selectedDrugList.length < 1">
                No Drug Selected
              </div>
              <div class="q-mb-sm">
                <span
                  v-for="(drug, i) in selectedDrugList"
                  :key="i"
                  style="display: inline-block"
                >
                  <q-item class="q-ma-xs" style="background-color: #d4ecdd">
                    <q-item-section>
                      <q-item-label>
                        {{ drug.title }}
                      </q-item-label>
                      <q-item-label caption>
                        {{ drug.details }}
                      </q-item-label>
                    </q-item-section>
                    <q-item-section avatar>
                      <q-btn
                        round
                        color="red"
                        text-color="white"
                        icon="close"
                        @click="removeItemDrugList(i)"
                      />
                    </q-item-section>
                  </q-item>
                </span>
              </div>
            </div>
            <q-btn
              glossy
              color="teal"
              label="Save"
              class="full-width"
              :disable="selectedDrugList.length < 1"
              @click="showDrugToDataBaseNotify()"
            ></q-btn>
          </q-card-section>
        </q-card>
      </div>
    </q-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { useQuasar,  } from "quasar";
import { apiStrings } from "../../api_strings";
import { openedBooking } from "../../opened_booking";
import apiCalls from "../../scripts/remote_services";
import { ref, onMounted } from "vue";

export default {
  name: "Prescription",

  setup() {
    const $q = useQuasar();
    const finalDrugList = ref([]);
    const finalNonPharm = ref("");
    const nonPharm = ref("");
    const nonPharmDialog = ref(false);

    const booking = ref({});

    booking.value = openedBooking();

    function getBookingById() {
      $q.loading.show();

      var bookingDetials = {
        bookingId: booking.value.bookingId,
      };

      apiCalls
        .post(apiStrings.getBookingById, bookingDetials)
        .then((data) => {
          $q.loading.hide();
          var response = data.data;
          if (response.success == true) {
            booking.value = response.data;
            finalDrugList.value = booking.value.Prescriptions;
            finalNonPharm.value = booking.value.pharmacology;
            nonPharm.value = booking.value.pharmacology;
          }
        })
        .catch((e) => {
          $q.loading.hide();
        });
    }

    function deleteSelectedLab(pres) {
      $q.loading.show();

      var labData = {
        id: pres.id,
      };

      apiCalls
        .delete(apiStrings.deletePres, {
          data: labData,
        })
        .then((data) => {
          var response = data.data;

          $q.loading.hide();

          if (response.success == true) {
            $q.notify({ message: response.message, color: "teal" });
            getBookingById();
          } else {
            $q.notify({ message: response.message, color: "red" });
          }
        })
        .catch((e) => {
          $q.loading.hide();
        });
    }
    function deletePresNotification(pres) {
      $q.notify({
        message: `Are you sure you will want to delete "${pres.title}" ?`,
        position: "center",
        color: "teal-10",
        textColor: "white",
        actions: [
          {
            label: "Dismiss",
            color: "white",
            handler: () => {},
          },
          {
            label: "Delete",
            color: "white",
            handler: () => {
              deleteSelectedLab(pres);
            },
          },
        ],
      });
    }
    return {
      booking,
      finalDrugList,
      finalNonPharm,
      nonPharm,
      nonPharmDialog,
      deletePresNotification,
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

      showSaveNotification() {
        $q.notify({
          message: "Do you want to save these prescriptions?",
          position: "center",
          color: "white",
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
                this.sendDrugToDataBase();
              },
            },
          ],
        });
      },
    };
  },
  props: ["openPres"],
  data() {
    return {
      dialogOpened: false,
      presDialog: false,
      addingDrug: false,

      prescribedDrugs: [],
      selectedPresDrug: "",
      selectedDrugList: [],

      removePresDrugs: "",
      filteredPresList: [],
      searchDrug: "",
      presData: {
        title: "",
        details: "",
      },
      drugs: [],
    };
  },
  computed: {
    user() {
      return this.$store.getters["user/user"];
    },
  },

  created() {
    this.getLabs();
    this.presDialog = this.openPres;
    this.booking = openedBooking();
    this.getBookingById();
  },
  methods: {
    sendDrugToDataBase() {
      this.selectedDrugList.forEach((drug) => {
        this.addDrug(drug);
      });

      // this.presDialog = false;
    },

    showDrugToDataBaseNotify() {
      this.showSaveNotification();
    },
    addUnlistDrug() {
      this.selectedPresDrug = this.searchDrug;
      this.searchDrug = "";
    },
    filterDrugs() {
      this.filteredPresList = this.drugs.filter((item) => {
        return item.toLowerCase().includes(this.searchDrug.toLowerCase());
      });
    },

    presDone() {
      this.presDialog = false;
      this.selectedDrugList = [];
      this.selectedPresDrug = "";
      this.searchDrug = "";
      this.presData.details = "";
    },

    addPresDetails(title) {
      if (this.selectedPresDrug === "") {
        this.showNotif("No Drug Selected", "red", "center");
        return;
      }

      this.presData.title = title;

      var drugObject = {
        title: this.presData.title,
        details: this.presData.details,
      };

      this.selectedDrugList.push(drugObject);

      this.selectedPresDrug = "";
      this.presData.title = "";
      this.presData.details = "";
      this.selectedPresDrug = "";
      this.searchDrug = "";
    },
    getLabs() {
      let config = {
        headers: {
          Authorization: sessionStorage.getItem("userToken"),
        },
      };
      apiCalls.get(apiStrings.getDrugs, config).then((data) => {
        var response = data.data;

        response.data.forEach((item) => {
          if (!this.drugs.includes(item.name)) {
            this.drugs.push(item.name);
          }
        });

        this.filteredPresList = this.drugs;
      });
    },

    removeItemDrugList(index) {
      // var index = this.selectedDrugList.indexOf(this.removePresDrugs);
      this.selectedDrugList.splice(index, 1);
      this.removePresDrugs = "";
    },

    setRemoveItem(item) {
      this.removePresDrugs = item;
    },

    addSelectedDrugToSelectedList() {
      if (this.selectedPresDrug != "") {
        this.selectedDrugList.push(this.selectedPresDrug);
        this.selectedPresDrug = "";
        this.searchDrug = "";
      } else {
        this.showNotif("No Drug selected", "red", "center");
      }
    },

    setSelectedDrug(drug) {
      this.selectedPresDrug = drug;
    },

    addDrug(drug) {
      this.addingDrug = true;

      this.showLoader();
      let config = {
        headers: {
          Authorization: sessionStorage.getItem("userToken"),
        },
      };

      var noteData = {
        bookingId: this.booking.bookingId,
        title: drug.title,
        description: drug.details,
      };

      apiCalls
        .post(apiStrings.createPres, noteData, config)
        .then((data) => {
          var response = data.data;

          if (response.success == true) {
            this.showNotif(response.message, "green");
            this.dialogOpened = false;
            this.finalDrugList.push(response.data);
            var index = this.selectedDrugList.indexOf(drug);
            this.selectedDrugList.splice(index, 1);
            this.addingDrug = false;
            this.presDialog = false;
            this.hideLoader();
          } else {
            this.showNotif(response.message, "red");
          }
        })
        .catch((e) => {
          this.addingDrug = false;
        });
    },
    getBookingById() {
      this.showLoader();

      var bookingDetials = {
        bookingId: this.booking.bookingId,
      };

      apiCalls
        .post(apiStrings.getBookingById, bookingDetials)
        .then((data) => {
          this.hideLoader();
          var response = data.data;
          if (response.success == true) {
            this.booking = response.data;

            this.finalDrugList = this.booking.Prescriptions;
            this.finalNonPharm = this.booking.pharmacology;
            this.nonPharm = this.booking.pharmacology;
          }
        })
        .catch((e) => {
          this.headers();
          // this.isLoading = false;
        });
    },
    addNonPharm() {
      this.showLoader();
      apiCalls
        .patch(apiStrings.updateBooking, {
          bookingId: this.booking.bookingId,
          pharmacology: this.nonPharm,
        })
        .then((data) => {
          this.hideLoader();
          var response = data.data;

          if (response.success == true) {
            this.showNotif(response.message, "teal");
            this.finalNonPharm = this.nonPharm;
            this.nonPharmDialog = false;
          } else {
            this.showNotif(response.message, "red");
          }
        })
        .catch((e) => {
          this.hideLoader();
          this.showNotif(`${e}`, "red");
        });
    },
  },
};
</script>

<style scoped>
#treatment-container {
  max-height: 70vh;
  overflow-y: scroll;
}

.drugs {
  height: 50px;
  max-height: 50px;

  overflow-x: scroll;
  display: flow;
  justify-content: left;
}
/* 
#final-non-pharm {
  text-align: start;
  display: flex;
  justify-content: start;
  margin: 0px;
  padding: 0;
} */

.selected-drugs-div {
  overflow: scroll;
}

#drugs-list {
  overflow-y: scroll;
  height: 80%;
}

#pres-container {
  max-height: 70vh;
  overflow-y: scroll;
}

/* width */
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
  width: 5px;
}
</style>
