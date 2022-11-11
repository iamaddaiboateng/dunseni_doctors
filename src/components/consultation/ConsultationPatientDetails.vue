<template>
  <div>
    <p style="margin: 10px; font-size: 1.3rem">Patient's Details</p>

    <q-list>
      <q-item>
        <q-item-section>
          <q-item-label caption> Name: </q-item-label>
          <q-item-label style="font-size: 1.3rem">
            {{ booking.name }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label caption> Symptoms: </q-item-label>
          <q-item-label style="font-size: 1.3rem"> 
            <pre style="margin: 0">{{ booking.medicalCondition }}</pre>
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label caption> Status: </q-item-label>
          <q-item-label style="font-size: 1.3rem">
            {{ booking.status }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import { openedBooking } from "../../opened_booking";
export default {
  name: "BookingPatientDetails",
  computed: {
    // booking() {
    //   return this.$store.getters["booking/getCurrentBooking"];
    // },
  },
  created() {
    this.booking = openedBooking();
  },
  data() {
    return {
      patientName: "",
      booking: {
        status: '',
        name: '',
        medicalCondition: ''
      },
      condition: "",
      age: "",
      bookingStatus: "",
    };
  },
};
</script>

<style scoped>
</style>