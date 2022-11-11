<template>
  <div>
    <div class="row q-mb-md">
      <div class="col">
        <q-item>
          <q-item-section>
            <q-item-label > Name: </q-item-label>
            <q-item-label>
              {{ booking.name }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>
       <div class="col">
        <q-item>
          <q-item-section>
            <q-item-label > Condition: </q-item-label>
            <q-item-label>
              {{ booking.medicalCondition }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>
       <div class="col">
        <q-item>
          <q-item-section>
            <q-item-label > Age: </q-item-label>
            <q-item-label>
              {{ booking.dob }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>
       <div class="col">
        <q-item>
          <q-item-section >
            <q-item-label > Data: </q-item-label>
            <q-item-label class="">
              {{ booking.from }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </div>

    <!-- <q-item>
      <q-item-section>
        <q-item-label caption> Condition: </q-item-label>
        <q-item-label>
          {{ booking.medicalCondition }}
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-item-label caption> Age: </q-item-label>
        <q-item-label>
          {{ booking.dob }}
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-item-label caption> Height: </q-item-label>
        <q-item-label>
          {{ booking.height }}
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-item-label caption> Weight: </q-item-label>
        <q-item-label>
          {{ booking.weight }}
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-item-label caption> Status: </q-item-label>
        <q-item-label>
          {{ booking.status }}
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-item-label caption> Diagnosis: </q-item-label>
        <q-item-label style="font-size: 1.3rem">
          {{ booking.note }}
        </q-item-label>
      </q-item-section>
    </q-item> -->
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "DocHistoryProfile",
 
  computed: {
    booking() {
      return this.$store.getters["booking/getCurrentBooking"];
    },
  },
  mounted() {
   
  },
  methods: {
    ...mapActions("booking", ["updateBooking"]),
  },
};
</script>

<style scoped>
</style>