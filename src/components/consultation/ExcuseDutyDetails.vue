<template>
  <div>
    <q-card>
      <q-card-section>
        <div class="text-h6">Excuse Duty</div>
        <hr />
        <div class="row bg-grey-5">
          <div class="col">
            <q-item>
              <q-item-section>
                <q-item-label caption> From: </q-item-label>
                <q-item-label>
                  {{ getDate(ecuseDuty.startDate) }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col">
            <q-item>
              <q-item-section>
                <q-item-label caption> To: </q-item-label>
                <q-item-label>
                  {{ getDate(ecuseDuty.endDate) }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </div>
        <q-list separator>
          <q-item>
            <q-item-section>
              <q-item-label caption> Total Duration </q-item-label>
              <q-item-label>
                {{ ecuseDuty.totalDuration }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-for="(excuse, e) in ecuseDuty.Excuses" :key="e">
            <q-item-section>
              <q-item-label caption>
                {{ excuse.label }}
              </q-item-label>
              <q-item-label>
                {{ excuse.comment }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-section> </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { date } from "quasar";

export default {
  name: "ExcuseDutyDetails",
  setup() {
    function getDate(dateValue) {
      return date.formatDate(dateValue, "DD-MM-YYYY");
    }

    // get booking

    return {
      getDate,
    };
  },
  props: ["ecuseDuty"],
};
</script>

<style scoped></style>
