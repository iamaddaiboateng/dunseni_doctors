<template>
  <div>
    <div class="text-h6 q-pa-md" v-if="finalLabsRequested.length < 1">
      No Lab Added
      <br />
      <q-btn
        label="Add Lab Test"
        color="teal"
        glossy
        @click="openDialog = true"
      ></q-btn>
    </div>
    <div class="q-ma-md" v-else>
      <div>
        <q-btn
          label="Add Lab Test"
          color="teal"
          glossy
          @click="openDialog = true"
        ></q-btn>
      </div>
      <div>
        <div class="bg-danger" style="height: 500px; overflow: auto">
          <q-list>
            <q-item v-for="(lab, i) in finalLabsRequested" :key="i">
              <q-item-section avatar>
                <q-btn
                  icon="delete"
                  color="red"
                  size="sm"
                  round
                  @click="deleteLabNotification(lab)"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-subtitle1">
                  {{ lab.label }}
                </q-item-label>
                <q-item-label caption>
                  {{ lab.description }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </div>

    <!-- selected labs dialog -->
    <q-dialog position="right" v-model="openMainLabDialog">
      <q-card style="width: 400px">
        <q-card-section>
          <div class="text-subtitle1">Labs</div>
          <hr />

          <q-btn label="Add Lab" glossy color="teal" @click="openLabDialog">
          </q-btn>

          <q-spinner-hourglass
            size="20px"
            color="red"
            v-if="addingLab"
          ></q-spinner-hourglass>

          <q-btn
            glossy
            color="blue-10"
            label="Save"
            class="q-ml-md"
            @click="sendLabsToDataBase()"
            v-else
          ></q-btn>
          <q-list class="q-mt-md">
            <q-item v-for="(lab, i) in requestedLabList" :key="i">
              <q-item-section class="text-subtitle1">
                {{ lab }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- selected labs dialog end -->

    <q-dialog v-model="openDialog" persistent>
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section>
          <div
            class="text-subtitle1"
            style="display: flex; justify-content: space-between"
          >
            Add Labs Request
            <q-btn
              round
              icon="close"
              glossy
              size="sm"
              color="red"
              @click="openDialog = false"
            />
          </div>
          <hr />
          <div class="text-subtitle1">
            <!-- <dev>
              <div>
                <q-select
                  filled
                  :options="mainLabs"
                  v-model="selectedMainLab"
                  label="Main Categories"
                  @update:model-value="filterMainCategory"
                ></q-select>
              </div>
              <div>
                <q-select
                  filled
                  :options="selectedSubCategoriesData"
                  v-model="selectedSubLab"
                  label="Sub Categories"
                  @update:model-value="filterSubCat"
                ></q-select>
              </div>
            </dev>
            <hr /> -->
            <div class="row">
              <div
                class="col-6 q-pa-sm"
                style="max-height: 300px; background-color: #d4ecdd"
              >
                <q-input
                  label="Enter Lab Test"
                  dense
                  v-model="searchLab"
                  @update:model-value="filterSelectedlabs"
                ></q-input>
                <div class="lab-list-container" style="max-height: 85%">
                  <q-list>
                    <q-item
                      v-for="(lab, i) in filteredLabRequest"
                      :key="i"
                      clickable
                      @click="setSelectedLabItem(lab)"
                      :class="
                        addSelectedLabItem === lab
                          ? 'bg-primary'
                          : 'bg-disabled'
                      "
                    >
                      <q-item-section>
                        <q-item-label>
                          {{ lab }}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>

                <div
                  class="q-ma-md"
                  v-show="searchLab !== '' && filteredLabRequest.length < 1"
                >
                  <div class="text-h6"></div>
                  <q-btn label="Add" glossy color="teal" @click="addUnlistLab">
                  </q-btn>
                </div>
              </div>
              <div class="col q-ml-sm" style="margin-top: 110px">
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
              </div>
              <div
                class="col-5 lab-list-container q-pa-sm"
                style="height: 300px; background-color: #f7f6f2"
              >
                <div>Selected Labs</div>
                <hr />
                <q-list>
                  <q-item
                    v-for="(lab, i) in requestedLabList"
                    :key="i"
                    clickable
                    @click="setRemoveItem(lab)"
                    :class="
                      removeSelctedLabItem === lab
                        ? 'bg-primary'
                        : 'bg-disabled'
                    "
                  >
                    <q-item-section>
                      <q-item-label> {{ lab.name }} </q-item-label>
                      <q-item-label caption> {{ lab.details }} </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
            <hr />
            <q-spinner-hourglass
              size="20px"
              color="red"
              v-if="addingLab"
            ></q-spinner-hourglass>

            <q-btn
              glossy
              color="blue-10"
              label="Save"
              class="q-ml-md full-width"
              @click="showDrugToDataBaseNotify()"
              :disable="requestedLabList.length < 1"
              v-else
            ></q-btn>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- lab descreption -->
    <q-dialog v-model="labDescrrptionDialog">
      <q-card style="width: 400px">
        <q-card-section>
          <div>Lab Description</div>
          <hr />
          <div class="text-h6">{{ addSelectedLabItem }}</div>
          <q-input
            type="textarea"
            label="Description"
            v-model="labDescreption"
          ></q-input>
          <q-btn
            label="Add"
            class="full-width"
            color="teal"
            glossy
            @click="addSelectedLabitemToList"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { useQuasar } from "quasar";
import { apiStrings } from "../../api_strings";
import { openedBooking } from "../../opened_booking";
import apiCall from "../../scripts/remote_services";
import { ref, onMounted } from "vue";

export default {
  name: "Lab",
  components: {
    // MainLab
  },

  setup() {
    const $q = useQuasar();
    const booking = ref({});
    const finalLabsRequested = ref([]);

    booking.value = openedBooking();

    function getBookingById() {
      $q.loading.show();

      var bookingDetials = {
        bookingId: booking.value.bookingId,
      };

      apiCall
        .post(apiStrings.getBookingById, bookingDetials)
        .then((data) => {
          $q.loading.hide();
          var response = data.data;
          if (response.success == true) {
            booking.value = response.data;
            finalLabsRequested.value = booking.value.Lab;
          }
        })
        .catch((e) => {
          $q.loading.hide();
        });
    }

    function deleteSelectedLab(lab) {
      $q.loading.show();

      var labData = {
        id: lab.id,
      };

      apiCall
        .delete(apiStrings.deleteLab, {
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
    function deleteLabNotification(lab) {
      $q.notify({
        message: `Are you sure you will want to delete "${lab.label}" ?`,
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
              deleteSelectedLab(lab);
            },
          },
        ],
      });
    }

    onMounted(() => {
      getBookingById();
    });

    return {
      finalLabsRequested,
      booking,
      deleteLabNotification,
      showLoader() {
        $q.loading.show();
      },
      hideLoader() {
        $q.loading.hide();
      },
      showNotif(mgs, color, position) {
        $q.notify({
          message: mgs,
          color: color,
          position: position,
        });
      },

      showSaveNotification() {
        $q.notify({
          message: "Do you want to save these Labs?",
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
                this.sendLabsToDataBase();
              },
            },
          ],
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

  created() {
    this.getLabs();
    this.openDialog = this.openLabs;
    this.booking = openedBooking();
  },
  mounted() {
    this.labCategories.forEach((item) => {
      var mainValue = { label: item.name, value: item.id };
      this.mainLabs.push(mainValue);
    });
  },
  props: ["openLabs"],
  data() {
    return {
      openDialog: false,
      lab: "",
      addingLab: false,
      openMainLabDialog: false,
      labDescrrptionDialog: false,
      // actual lab labels
      labs: [],
      // selected sub categories
      selectedSubCategories: [],
      selectedSubCategoriesData: [],
      // filtered main categories from the database
      mainLabs: [],
      // all sub cat
      allSubLabs: [],
      selectedMainLab: "",
      selectedSubLab: "",
      // lab coming from the database
      labCategories: [],
      addSelectedLabItem: "",
      requestedLabList: [],
      removeSelctedLabItem: "",

      searchLab: "",
      filteredLabRequest: [],
      labDescreption: "",
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

  methods: {
    openLabDialog() {
      this.openDialog = true;
    },

    showDrugToDataBaseNotify() {
      this.showSaveNotification();
    },

    setSelectedLabItem(lab) {
      this.addSelectedLabItem = lab;
    },

    addUnlistLab() {
      this.addSelectedLabItem = this.searchLab;
      this.labDescrrptionDialog = true;
      this.searchLab = "";
    },

    addSelectedLabitemToList() {
      if (this.addSelectedLabItem === "") {
        return;
      }

      var selectedLab = {
        name: this.addSelectedLabItem,
        details: this.labDescreption,
      };

      if (!this.requestedLabList.includes(this.addSelectedLabItem)) {
        this.requestedLabList.push(selectedLab);
        this.addSelectedLabItem = "";
        this.labDescreption = "";
      } else {
        this.showNotif("Lab has already been added", "red");
      }

      this.labDescrrptionDialog = false;
    },

    setRemoveItem(item) {
      this.removeSelctedLabItem = item;
    },

    removeItemFromLab() {
      var index = this.requestedLabList.indexOf(this.removeSelctedLabItem);
      this.requestedLabList.splice(index, 1);
      this.removeSelctedLabItem = "";
    },

    showLab() {},
    filterMainCategory() {
      this.labs = [];
      this.filteredLabRequest = [];
      this.selectedSubLab = "";
      var selectedLab = this.labCategories.filter((item) => {
        return item.id == this.selectedMainLab.value;
      });

      this.selectedSubCategories = selectedLab[0];

      var subCatData = this.selectedSubCategories.SubCats;
      this.selectedSubCategories = subCatData;

      this.selectedSubCategoriesData = [];

      subCatData.forEach((data) => {
        var newSubLabs = { label: data.name, value: data.id };

        this.selectedSubCategoriesData.push(newSubLabs);
      });
    },

    filterSubCat() {
      this.labs = [];
      this.filteredLabRequest = [];

      var labels = this.selectedSubCategories.filter((data) => {
        return this.selectedSubLab.value == data.id;
      });

      var selectedLabs = labels[0].Labels;

      for (const item of selectedLabs) {
        this.labs.push(item?.name);
      }

      this.filteredLabRequest = this.labs;
    },

    filterSelectedlabs() {
      this.filteredLabRequest = this.labs.filter((item) => {
        return item.toLowerCase().includes(this.searchLab.toLowerCase());
      });
    },

    getLabs() {
      let config = {
        headers: {
          Authorization: sessionStorage.getItem("userToken"),
        },
      };

      apiCall
        .get(apiStrings.getLabs)
        .then((data) => {
          var response = data.data;
          this.labCategories = response.data;

          this.labCategories.forEach((item) => {
            if (!this.labs.includes(item.name)) {
              this.labs.push(item.name);
            }
          });

          this.filteredLabRequest = this.labs;
          // this.labCategories.forEach((item) => {
          //   var mainValue = { label: item.name, value: item.id };
          //   this.mainLabs.push(mainValue);
          // });
        })
        .catch((e) => {});
    },

    sendLabsToDataBase() {
      this.showLoader();
      this.requestedLabList.forEach((lab) => {
        this.addLab(lab);
      });
      this.requestedLabList = [];
      this.searchLab = "";
      this.filteredLabRequest = [];
      this.selectedMainLab = "";
      this.selectedSubLab = "";
      // this.hideLoader();
    },

    addLab(lab) {
      this.showLoader();
      this.addingLab = true;

      let config = {
        headers: {
          Authorization: sessionStorage.getItem("userToken"),
        },
      };

      var labData = {
        bookingId: this.booking.bookingId,
        description: lab.details,
        label: lab.name,
        mainCategory: this.selectedMainLab.label,
        subCategory: this.selectedSubLab.label,
      };

      axios
        .post(apiStrings.createLab, labData, config)
        .then((data) => {
          var response = data.data;
          this.hideLoader();

          if (response.success == true) {
            this.finalLabsRequested.splice(0, 0, response.data);
            this.showNotif(response.message, "green");
            this.rows = response.data;
            this.openDialog = false;
            this.lab = "";

            this.addingLab = false;
          } else {
            this.showNotif(response.message, "red");
          }
        })
        .catch((e) => {
          this.hideLoader();
          this.addingLab = false;
        });
    },
  },
};
</script>

<style scoped>
.lab-list-container {
  overflow-y: scroll;
}
#lab-container {
  display: flex;
  justify-content: center;
  align-items: center;
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
