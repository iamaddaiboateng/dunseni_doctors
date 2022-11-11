class BookingModel {}

const bookingStore = "openingBooking";

export function setOpenedBooking(openedBookingObj) {
  sessionStorage.setItem(
    bookingStore,
    JSON.stringify(openedBookingObj)
  );
 
}

export function openedBooking(){
    var booking = sessionStorage.getItem(bookingStore);
    return JSON.parse(booking);
}