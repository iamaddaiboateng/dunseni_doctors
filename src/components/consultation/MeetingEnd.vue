<template>
  <div id="no-video-container" class="full-height full-width">
    <q-btn id="no-video" round color="red" icon="videocam_off" size="50px" />
  </div>
</template>

<script>
export default {
  name: "MeetingEnded",
  data() {
    return {
      msg: "You have ended this meeting",
    };
  },
};
</script>

<style scoped>
#no-video {
  margin-left: 40%;
  margin-top: 30%;
}
</style>