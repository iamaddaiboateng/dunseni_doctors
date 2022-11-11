<template>
  <div class="full-width" id="doc-actions">
    <q-btn-group push id="tabs">
      <q-btn
        @click="selectedAction = 'BookingPatientDetails'"
        :color="selectedAction == 'BookingPatientDetails' ? 'blue-10' : 'grey'"
        glossy
        text-color="white"
        push
        label="Booking"
      />
      <q-btn
        @click="selectedAction = 'DoctorHistoryRecord'"
        :color="selectedAction == 'DoctorHistoryRecord' ? 'blue-10' : 'grey'"
        glossy
        text-color="white"
        push
        label="History"
      />
      <q-btn
        @click="selectedAction = 'DoctorNote'"
        :color="selectedAction == 'DoctorNote' ? 'blue-10' : 'grey'"
        glossy
        text-color="white"
        push
        label="Diagnosis"
      />
      <q-btn
        @click="selectedAction = 'lab'"
        :color="selectedAction == 'lab' ? 'blue-10' : 'grey'"
        glossy
        text-color="white"
        push
        label="Labs"
      />
      <q-btn
        @click="selectedAction = 'Prescription'"
        :color="selectedAction == 'Prescription' ? 'blue-10' : 'grey'"
        glossy
        text-color="white"
        push
        label="Treatment Plan"
      />
      <q-btn
        @click="selectedAction = 'BookingHistory'"
        :color="selectedAction == 'BookingHistory' ? 'blue-10' : 'grey'"
        glossy
        text-color="white"
        push
        label="Previous History"
      />
       <q-btn
        @click="selectedAction = 'ExcuseDuty'"
        :color="selectedAction == 'ExcuseDuty' ? 'blue-10' : 'grey'"
        glossy
        text-color="white"
        push
        label="Excuse Duty"
      />
    </q-btn-group>

    <keep-alive>
      <component :is="selectedAction" class="full-width"></component>
    </keep-alive>
  </div>
</template>

<script>
import BookingPatientDetails from "./ConsultationPatientDetails.vue";
import Lab from "./LabComponent.vue";
import Prescription from "./Prescription.vue";
import DoctorNote from "./DoctorNote.vue";
import BookingHistory from "./BookingHistory.vue";
import DoctorHistoryRecord from "./DoctorHistoryRecord.vue";
import ExcuseDuty from "./ExcuseDuty.vue"

export default {
  name: "DoctorActions",
  components: {
    BookingPatientDetails,
    Lab,
    Prescription,
    DoctorNote,
    BookingHistory,
    DoctorHistoryRecord,
    ExcuseDuty,
  },
  data() {
    return {
      selectedAction: "BookingPatientDetails",
    };
  },
};
</script>

<style scoped>
#tabs{
  position: sticky;
}
#doc-actions{
  height: 80vh;
  max-width: 100%;
  display: block;
  overflow-y: scroll;

}
</style>