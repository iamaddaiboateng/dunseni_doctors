<template>
  <div>
    <div v-if="!bookingExcuseDuty" class="q-ma-md">
      <q-btn
        label="Add Excuse Duty"
        color="primary"
        glossy
        @click="excuseDialog = true"
      />
      <div class="text-h6">No Excuse Duty Found</div>
    </div>
    <div v-else>
      <div class="q-ma-sm">
        <q-btn label="Edit" color="primary" glossy @click="openEdit()" />
      </div>
      <q-item>
        <q-item-section>
          <q-item-label caption> Total Duration </q-item-label>
          <q-item-label class="text-body1">
            {{ bookingExcuseDuty?.totalDuration }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label caption> Excused Duty </q-item-label>
          <q-item-label class="text-body1">
            From: {{ momentDate(bookingExcuseDuty?.startDate) }}
          </q-item-label>
          <q-item-label class="text-body1">
            To:
            {{ momentDate(bookingExcuseDuty?.endDate) }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-for="(excuse, e) in bookingExcusesList" :key="e">
        <q-item-section>
          <q-item-label caption> {{ excuse.label }} </q-item-label>
          <q-item-label class="text-body1">
            {{ excuse.comment }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </div>
    <q-dialog v-model="excuseDialog" persistent>
      <q-card style="width: 400px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Excuse Duty</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section id="excuse-form">
          <q-form @submit="excuseDialog = false">
            <!-- <div class="row bg-grey-2 q-mt-sm">
              <div class="col">
                <q-item>
                  <q-item-section>
                    <q-item-label caption> From: </q-item-label>
                    <q-item-label>
                      <q-input
                        filled
                        dense
                        v-model="date.from"
                        mask="date"
                        :rules="['date']"
                      >
                        <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qDateProxy"
                              cover
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date
                                v-model="date"
                                :options="startDateOptions"
                                @@update:model-value="calDateDiff"
                                range
                              >
                                <div class="row items-center justify-end">
                                  <q-btn
                                    v-close-popup
                                    label="Close"
                                    color="primary"
                                    flat
                                  />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </div>
              <div class="col">
                <q-item>
                  <q-item-section>
                    <q-item-label caption> To:</q-item-label>
                    <q-item-label>
                      <q-input
                        filled
                        dense
                        v-model="date.to"
                        mask="date"
                        :rules="['date']"
                      >
                        <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qDateProxy"
                              cover
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date
                                v-model="date.to"
                                :options="endDateOptions"
                              >
                                <div class="row items-center justify-end">
                                  <q-btn
                                    v-close-popup
                                    label="Close"
                                    color="primary"
                                    flat
                                  />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </div>
            </div> -->
            <div>
              <q-date
                v-model="date"
                :options="startDateOptions"
                range
                minimal
                @range-end="calDateDiff"
                class="full-width q-mb-md"
              />
            </div>

            <q-input label="Total Duration" dense outlined v-model="duration" />
            <q-input
              class="q-mt-sm"
              outlined
              dense
              label="Light Duties only"
              v-model="lightDuty"
            />

            <q-input
              class="q-mt-sm"
              outlined
              dense
              label="P-T Marching / Sports / Rifle Drill"
              v-model="marching"
            />
            <q-input
              class="q-mt-sm"
              outlined
              dense
              label="Boots / Puttees / Fatigue"
              v-model="boots"
            />
            <q-input
              class="q-mt-sm"
              outlined
              dense
              label="Shaving"
              v-model="shaving"
            />

            <q-input
              class="q-mt-sm"
              outlined
              dense
              label="(R) or (L) Hands"
              v-model="hands"
            />
          </q-form>
        </q-card-section>
        <q-card-actions>
          <q-btn
            class="full-width q-mt-sm"
            color="primary"
            glossy
            label="Save"
            @click="createExcuseDuty()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, reactive, toRefs, onMounted } from "vue";
import { useQuasar, date } from "quasar";
import apiCalls from "../../scripts/remote_services";
import { apiStrings } from "../../api_strings";
import { excuseDutyString } from "../../scripts/excue_duty_utils";
import { openedBooking } from "../../opened_booking";
import moment from "moment";

export default {
  name: "ExcuseDuty",
  setup() {
    const excuseDialog = ref(false);
    const excueLabels = ref([]);
    const booking = ref({});
    const bookingExcuseDuty = ref([]);
    const bookingExcusesList = ref([]);

    // get date for initial date calculation
    const initialDate = Date.now();
    const formatedDateString = date.formatDate(initialDate, "YYYY/MM/DD");

    // option function for limiting date start date to intial date
    function startDateOptions(date) {
      return date >= formatedDateString;
    }

    // get booking from session storage
    booking.value = openedBooking();

    // get excuse duty details from booking
    bookingExcuseDuty.value = booking.value.ExcuseDuty[0];
    if (bookingExcuseDuty.value) {
      bookingExcusesList.value = bookingExcuseDuty.value.Excuses;
    }

    const q = useQuasar();

    const excuseDutyState = reactive({
      duration: "",
      date: { from: "", to: "" },
      lightDuty: "",
      marching: "",
      boots: "",
      shaving: "",
      hands: "",
    });

    // option function for limiting date for end date
    function endDateOptions(date) {
      return date >= excuseDutyState.date.from;
    }

    // calculate the difference in start date and end date
    function calDateDiff(value) {
      if (excuseDutyState.date.from !== "" && excuseDutyState.date.to !== "") {
        excuseDutyState.duration =
          date.getDateDiff(excuseDutyState.date.to, excuseDutyState.date.from) +
          " days";
      }
    }

    function openEdit() {
      excuseDialog.value = true;
      excuseDutyState.duration = bookingExcuseDuty.value.totalDuration;
      excuseDutyState.date.from = bookingExcuseDuty.value.startDate;
      excuseDutyState.date.to = bookingExcuseDuty.value.endDate;

      // filter excuse for light duty
      const lightFilter = bookingExcusesList.value.filter((element) => {
        return element.label === excuseDutyString.lightDuty;
      });
      // assign light duty
      excuseDutyState.lightDuty = lightFilter[0].comment;

      // filter excuse for marching
      const marchingFilter = bookingExcusesList.value.filter((element) => {
        return element.label === excuseDutyString.marching;
      });
      // assign light duty
      excuseDutyState.marching = marchingFilter[0].comment;

      // filter excuse for shaving
      const shavingFilter = bookingExcusesList.value.filter((element) => {
        return element.label === excuseDutyString.shaving;
      });
      // assign light duty
      excuseDutyState.shaving = shavingFilter[0].comment;

      // filter excuse for boot
      const bootFilter = bookingExcusesList.value.filter((element) => {
        return element.label === excuseDutyString.boots;
      });
      // assign light duty
      excuseDutyState.boots = bootFilter[0].comment;

      // filter excuse for shaving
      const handFilter = bookingExcusesList.value.filter((element) => {
        return element.label === excuseDutyString.hands;
      });
      // assign light duty
      excuseDutyState.hands = handFilter[0].comment;
    }

    function momentDate(date) {
      return moment(date).format("ddd, Do MMM, YYYY");
    }

    // get execute duty fields from database
    function createExcuseDuty() {
      q.loading.show();

      const excuseDutyObj = {
        bookingId: booking.value.bookingId,
        totalDuration: excuseDutyState.duration,
        startDate: excuseDutyState.date.from,
        endDate: excuseDutyState.date.to,
        excuses: [
          {
            label: excuseDutyString.lightDuty,
            comment: excuseDutyState.lightDuty,
          },
          {
            label: excuseDutyString.marching,
            comment: excuseDutyState.marching,
          },
          {
            label: excuseDutyString.boots,
            comment: excuseDutyState.boots,
          },
          {
            label: excuseDutyString.shaving,
            comment: excuseDutyState.shaving,
          },
          {
            label: excuseDutyString.hands,
            comment: excuseDutyState.hands,
          },
        ],
      };


      apiCalls
        .post(apiStrings.createExcuseDuty, excuseDutyObj)
        .then((data) => {
          q.loading.hide();
          const response = data.data;
          bookingExcuseDuty.value = response.data;

          excuseDialog.value = false;
          bookingExcusesList.value = bookingExcuseDuty.value.Excuses;

          getBookingById();
        })
        .catch((e) => {
          q.loading.hide();
          q.notify({ message: `${e}`, color: "red" });
        });
    }

    // get all excuse labels
    function getExcusesLabels() {
      apiCalls
        .get(apiStrings.getAllExcuseLabels)
        .then((data) => {
          const response = data.data;

          if (response.success === true) {
            excueLabels.value = response.data;
          }
        })
        .catch((e) => {});
    }

    // get booking
    function getBookingById() {
      q.loading.show();

      var bookingDetials = {
        bookingId: booking.value.bookingId,
      };

      apiCalls
        .post(apiStrings.getBookingById, bookingDetials)
        .then((data) => {
          var response = data.data;
          if (response.success == true) {
            q.loading.hide();
            booking.value = response.data;

            bookingExcuseDuty.value = booking.value.ExcuseDuty[0];

            excuseDialog.value = false;
            bookingExcusesList.value = bookingExcuseDuty.value.Excuses;
          }
        })
        .catch((e) => {
          q.loading.hide();
        });
    }

    onMounted(() => {
      getExcusesLabels();
      getBookingById();
    });

    return {
      excuseDialog,
      excueLabels,
      booking,
      bookingExcuseDuty,
      bookingExcusesList,
      calDateDiff,
      endDateOptions,
      startDateOptions,
      momentDate,
      openEdit,
      createExcuseDuty,
      ...toRefs(excuseDutyState),
    };
  },
};
</script>

<style scoped>
#excuse-form {
  max-height: 70vh;
  overflow-y: scroll;
}
</style>
