const baseUri = "https://api.dunseni.com/api/v1/";
const baseUriFiles = "https://api.dunseni.com/files/";

export const apiStrings = {
  signInUrl: `${baseUri}auth/login`,
  getBookings: `${baseUri}booking/doctor-bookings`,
  getBookingsCompleted: `${baseUri}booking/doctor-bookings-completed`,
  getAgoraToken: `${baseUri}booking/agora-token`,
  cancelBooking: `${baseUri}booking/cancel-booking`,
  notification: `${baseUri}notification/notify`,
  startSession: `${baseUri}booking/start-booking-session`,
  endBooking: `${baseUri}booking/end-booking`,
  clientHistory: `${baseUri}booking/client-bookings-completed`,
  files: `${baseUriFiles}lab_results/`,
  doctorProfileImage: `${baseUriFiles}doctor_profiles/`,
  bookingUpdateNote: `${baseUri}booking/update-note`,
  createLab: `${baseUri}doctor/create-lab`,
  deleteLab: `${baseUri}doctor/delete-lab`,
  createPres: `${baseUri}doctor/create-pres`,
  getLabs: `${baseUri}doctor/lab-categories`,
  getDrugs: `${baseUri}doctor/get-meds`,
  changePssword: `${baseUri}auth/reset-password`,
  forgettenPassword: `${baseUri}auth/reset-forgot-password`,
  otpVerify: `${baseUri}auth/otp-verify`,
  optRequest: `${baseUri}auth/otp-request`,
  profileImageUpload: `${baseUri}doctor/upload-profile-picture/`,
  pdfFiles: `${baseUri}lab-pdf`,
  addHistory: `${baseUri}booking/doctor-add-history`,
  addFinalComment: `${baseUri}booking/doctor-add-comment`,
  getBookingById: `${baseUri}booking/get-booking-by-Id`,
  // excuse duty
  createExcuseDuty: `${baseUri}booking/create-excuse-duty`,
  getAllExcuseLabels: `${baseUri}booking/get-excuse-labels`,
  // booking update
  updateBooking: `${baseUri}booking/update`,
  deletePres: `${baseUri}doctor/delete-pres`,
};
