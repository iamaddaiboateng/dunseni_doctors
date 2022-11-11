<template>
  <div>
    <q-card-section>
      <q-input
        class="q-pb-md"
        color="grey-3"
        label-color="teal"
        filled
        label="Patient Id / Name"
      >
        <template v-slot:append>
          <q-icon name="search" color="teal" />
        </template>
      </q-input>
      <q-list separator>
        <q-item
          v-for="(row, i) in rows"
          :key="i"
          clickable
          v-ripple
          @click="showBookingDetails(row)"
        >
          <q-item-section>
            <q-item-label class="text-subtile1"> {{ row.name }} </q-item-label>
            <!-- <q-item-label caption> {{ row.medicalCondition }} </q-item-label> -->
            <q-item-label caption> {{ momentData(row.from) }} </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-chip
              :label="row.status"
              :color="statusColor(row.status)"
              text-color="white"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </div>
</template>

<script>
import axios from "axios";
import { apiStrings } from "../../api_strings";
import moment from "moment";
import { mapActions } from "vuex";

export default {
  name: "ConsultationHistory",
  props: ["bookings"],
  data() {
    return {
      rows: [],
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
  mounted() {
    this.getAllBookings();
  },
  methods: {
    ...mapActions("booking", ["updateBooking"]),
    momentData(date) {
      return moment(date).format("ddd, Do MMM, YYYY");
    },

    showBookingDetails(row) {
      this.updateBooking({ bookingData: row });
    
      this.$router.push({ name: "DoctorBookingHistory" });
    },

    statusColor(status) {
      if (status === "Completed") {
        return "teal";
      } else if (status === "Cancelled") {
        return "red";
      } else if (status === "Booked") {
        return "blue";
      } else {
        return "amber";
      }
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
  },
};
</script>

<style scoped>
#history {
  /* background-color: red; */
  height: 33rem;
}
</style>