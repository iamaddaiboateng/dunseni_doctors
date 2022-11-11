<template>
  <q-page>
    <div class="q-pa-md">
      <div class="row justify-center">
        <div class="col-6">
          <MeetingEnded v-if="meetingHasEnded" />
          <div v-else>
            <div>
              <div :id="remoteUserId" class="column" style=""></div>

              <div :id="localFrameId"></div>

              <no-video id="me-no-video" v-show="!hasVideo" />
            </div>
            <div class="row" id="action-container">
              <div class="col q-pa-md q-gutter-sm">
                <q-btn
                  round
                  glossy
                  @click="muteAudio"
                  :color="hasAudio ? 'green' : 'red'"
                  icon="mic"
                />
                <q-btn
                  glossy
                  color="red"
                  label="Cancel Session"
                  v-if="!clientJoined"
                  @click="cancelSession"
                />
                <q-btn
                  glossy
                  color="teal"
                  label="End Video"
                  v-else
                  @click="leaveMeeting"
                />
                <!-- <div class="text-h5" id="timer">{{ min }}:{{ sec }}</div> -->
              </div>
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="full-width">
            <doctor-actions />
          </div>
          <div class="q-pa-md end-session">
            <q-btn
              v-show="clientJoined"
              label="End Session"
              color="teal"
              glossy
              @click="commentDialog = true"
            ></q-btn>
          </div>
        </div>
      </div>
    </div>
    <q-dialog v-model="commentDialog">
      <q-card style="width: 400px">
        <q-card-section>
          <div class="text-body1">Final Comment</div>

          <q-input
            type="textarea"
            label="Enter Final Comment"
            autofocus
            v-model="finalComment"
          ></q-input>
        </q-card-section>
        <q-card-actions>
          <q-btn
            label="Save"
            class="full-width"
            color="teal"
            glossy
            @click="endSession"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<style>
#me {
  height: 10rem;
  width: 10rem;
  background-color: blue;
  margin: 5px;
  position: absolute;
  top: 15px;
  display: inline-block;
}

.end-session {
  text-align: center;
}

#me-no-video {
  height: 10rem;
  width: 10rem;
  background-color: white;
  margin: 5px;
  position: absolute;
  top: 15px;
  display: inline-block;
}

#timer {
  text-align: end;
  margin-right: 25px;
  display: inline-block;
  position: absolute;
  right: 10px;
  margin: 5px;
  padding: 0px;
}

#action-container {
  position: relative;
}

#remote-user {
  height: 80vh;
  max-height: 100%;
  display: block;
  background-color: rgb(252, 239, 239);
  margin-right: 15px;
  position: relative;
}
</style>

<script>
import DoctorActions from "../../components/consultation/DoctorActions.vue";

import NoVideo from "../../components/consultation/NoVideo.vue";
import AgoraRTC from "agora-rtc-sdk-ng";
import MeetingEnded from "../../components/consultation/MeetingEnd.vue";
import { useQuasar } from "quasar";
import { mapActions } from "vuex";
import axios from "axios";
// import { useQuasar } from 'quasar'
import { apiStrings } from "../../api_strings";
import { openedBooking } from "../../opened_booking";

const rtc = {
  client: null,
  localAudioTrack: null,
  localVideoTrack: null,
};

export default {
  name: "Consultation",
  components: {
    DoctorActions,
    NoVideo,
    MeetingEnded,
  },

  setup() {
    const $q = useQuasar();
    return {
      showLoader() {
        $q.loading.show();
      },
      hideLoader() {
        $q.loading.hide();
      },
      addFinalDiagnosisNofify() {
        $q.notify({
          message: "Are you sure you want to save this diagnosis",
          color: "red",
          position: "center",
          actions: [
            {
              label: "Dismis",
              color: "white",
              handler: () => {},
            },
            {
              label: "Save",
              color: "white",
              handler: () => {
                this.addDiagnosis();
              },
            },
          ],
        });
      },
      showNotif(mgs, color) {
        $q.notify({
          message: mgs,
          color: color,
        });
      },
      showDialog() {
        $q.dialog({
          title: "Create",
          message: "Wonderful",
        })
          .onOk(() => {})
          .onCancel(() => {});
      },
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

  beforeUnmount() {
    this.leaveMeeting();
  },

  data() {
    return {
      hasVideo: true,
      hasAudio: true,
      meetingHasEnded: false,
      clientJoined: false,
      commentDialog: false,
      booking: {},
      localFrameId: "me",
      remoteUserId: "remote-user",
      finalComment: "",
      sec: 0,
      min: 0,
    };
  },

  created() {
    this.joinMeeting();

    this.booking = openedBooking();
  },

  mounted() {
    this.getBookingById();
  },

  methods: {
    async joinMeeting() {
      AgoraRTC.setLogLevel(4);

      const devices = AgoraRTC.getCameras();

      const options = {
        appId: sessionStorage.getItem("agoraAppID"),
        channel: sessionStorage.getItem("agoraChannel"),
        token: sessionStorage.getItem("agoraToken"),
      };

      // create client
      rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

      // join meeting
      const uid = await rtc.client.join(
        options.appId,
        options.channel,
        options.token,
        parseInt(sessionStorage.getItem("agoraUID"))
      );

      // create local audio track
      rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();

      // create video track
      rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();

      rtc.localVideoTrack.play(this.localFrameId);

      // publish stream
      rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);

      // listen to other user published
      rtc.client.on("user-published", async (user, mediaType) => {
        //  subscribe to remote user
        await rtc.client.subscribe(user, mediaType);

        this.clientJoined = true;
        this.consultationTimer();

        if (mediaType === "video") {
          const remoteVideoTrack = user.videoTrack;

          const playerContainer = document.createElement("div");

          playerContainer.id = user.uid.toString();
          playerContainer.style.width = document.getElementById(
            this.remoteUserId
          ).width;
          playerContainer.style.height = "80vh";
          document.getElementById(this.remoteUserId).append(playerContainer);

          remoteVideoTrack.play(playerContainer);
        }

        if (mediaType === "audio") {
          const remoteAudioTrack = user.audioTrack;
          remoteAudioTrack.play();
        }
      });

      rtc.client.on("user-unpublished", (user) => {
        const playerContainer = document.getElementById(user.uid);
        // this.showNotif("Client has disabled video");
        playerContainer.remove();
      });

      rtc.client.on("user-left", (user) => {
        const playerContainer = document.getElementById(user.uid);
        this.showNotif("Client left the meeting");
        playerContainer.remove();
      });

      rtc.client.on("connection-state-change", (reason) => {
        this.showNotif(reason, "black");
      });
    },

    muteVideo() {
      this.hasVideo = !this.hasVideo;
      rtc.localVideoTrack.setEnabled(this.hasVideo);
    },

    muteAudio() {
      this.hasAudio = !this.hasAudio;
      rtc.localAudioTrack.setEnabled(this.hasAudio);
    },

    async leaveMeeting() {
      //  close local tracks
      rtc.localAudioTrack.close();
      rtc.localVideoTrack.close();

      // remove remote user
      try {
        rtc.client.remoteUser.forEach((user) => {
          const playerContainer = document.getElementById(user.id);
          playerContainer && playerContainer.remove();
        });
      } catch (e) {}

      // leave the meeting
      await rtc.client.leave();

      this.meetingHasEnded = true;
    },
    cancelSession() {
      let config = {
        headers: {
          Authorization: sessionStorage.getItem("userToken"),
        },
      };

      var bookingDetials = {
        bookingId: this.booking.bookingId,
        uid: sessionStorage.getItem("userUID"),
        comment: "Client didn't show up",
      };

      axios
        .patch(apiStrings.cancelBooking, bookingDetials, config)
        .then((data) => {
          var response = data.data;
          if (response.success == true) {
            this.$router.go("-1");
          }
        })
        .catch((e) => {
          this.isLoading = false;
        });
    },
    endSession() {
      this.showLoader();
      let config = {
        headers: {
          Authorization: sessionStorage.getItem("userToken"),
        },
      };

      var bookingDetials = {
        bookingId: this.booking.bookingId,
      };

      axios
        .patch(apiStrings.endBooking, bookingDetials, config)
        .then((data) => {
          this.hideLoader();
          var response = data.data;
          if (response.success == true) {
            this.addFinalComment();
            this.$router.go("-1");
            this.leaveMeeting();
          }
        })
        .catch((e) => {
          this.isLoading = false;
          this.hideLoader();
        });
    },

    addFinalComment() {
      this.addingNote = true;

      let config = {
        headers: {
          Authorization: sessionStorage.getItem("userToken"),
        },
      };

      var noteData = {
        bookingId: this.booking.bookingId,
        finalComment: this.finalComment,
      };

      axios
        .patch(apiStrings.addFinalComment, noteData, config)
        .then((data) => {
          var response = data.data;

          if (response.success == true) {
            this.showNotif(response.message, "green");
            this.dialog = false;
            this.note = this.finalComment;
          } else {
            this.showNotif(response.message, "red");
          }
        })
        .catch((e) => {});
    },

    consultationTimer() {
      var time = 0;

      setInterval(() => {
        time++;
        this.min = Math.floor(time / 60);
        this.sec = time % 60;
        // this.sec = this.sec < 10 ? "0" + this.sec : this.sec;
        // this.min = this.min < 10 ? "0" + this.min : this.min;
      }, 1000);
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
          }
        })
        .catch((e) => {
          this.isLoading = false;
        });
    },
  },
};
</script>
