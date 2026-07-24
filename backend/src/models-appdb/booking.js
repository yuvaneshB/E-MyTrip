// TODO: not supported in AppDB, needs manual JS join (bookingController.js, ticketController.js, reportController.js populate tour, user, couponApplied)
import { createAdapter } from './baseAdapter.js';

const Booking = createAdapter('bookings');

export default Booking;
