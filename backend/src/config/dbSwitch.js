import activityLogReal from '../models/activityLog.js';
import agentTourReal from '../models/agentTour.js';
import bookingReal from '../models/booking.js';
import categoryReal from '../models/category.js';
import cityReal from '../models/city.js';
import countryReal from '../models/country.js';
import couponReal from '../models/coupon.js';
import destinationReal from '../models/destination.js';
import invoiceReal from '../models/invoice.js';
import newsletterSubscriptionReal from '../models/newsletterSubscription.js';
import notificationReal from '../models/notification.js';
import paymentReal from '../models/payment.js';
import refundReal from '../models/refund.js';
import reviewReal from '../models/review.js';
import ticketReal from '../models/ticket.js';
import ticketReplyReal from '../models/ticketReply.js';
import tourReal from '../models/tour.js';
import userReal from '../models/user.js';
import wishlistReal from '../models/wishlist.js';

import activityLogAppDB from '../models-appdb/activityLog.js';
import agentTourAppDB from '../models-appdb/agentTour.js';
import bookingAppDB from '../models-appdb/booking.js';
import categoryAppDB from '../models-appdb/category.js';
import cityAppDB from '../models-appdb/city.js';
import countryAppDB from '../models-appdb/country.js';
import couponAppDB from '../models-appdb/coupon.js';
import destinationAppDB from '../models-appdb/destination.js';
import invoiceAppDB from '../models-appdb/invoice.js';
import newsletterSubscriptionAppDB from '../models-appdb/newsletterSubscription.js';
import notificationAppDB from '../models-appdb/notification.js';
import paymentAppDB from '../models-appdb/payment.js';
import refundAppDB from '../models-appdb/refund.js';
import reviewAppDB from '../models-appdb/review.js';
import ticketAppDB from '../models-appdb/ticket.js';
import ticketReplyAppDB from '../models-appdb/ticketReply.js';
import tourAppDB from '../models-appdb/tour.js';
import userAppDB from '../models-appdb/user.js';
import wishlistAppDB from '../models-appdb/wishlist.js';

const isAppDB = process.env.DB_MODE === 'appdb';

export const ActivityLog = isAppDB ? activityLogAppDB : activityLogReal;
export const AgentTour = isAppDB ? agentTourAppDB : agentTourReal;
export const Booking = isAppDB ? bookingAppDB : bookingReal;
export const Category = isAppDB ? categoryAppDB : categoryReal;
export const City = isAppDB ? cityAppDB : cityReal;
export const Country = isAppDB ? countryAppDB : countryReal;
export const Coupon = isAppDB ? couponAppDB : couponReal;
export const Destination = isAppDB ? destinationAppDB : destinationReal;
export const Invoice = isAppDB ? invoiceAppDB : invoiceReal;
export const NewsletterSubscription = isAppDB ? newsletterSubscriptionAppDB : newsletterSubscriptionReal;
export const Notification = isAppDB ? notificationAppDB : notificationReal;
export const Payment = isAppDB ? paymentAppDB : paymentReal;
export const Refund = isAppDB ? refundAppDB : refundReal;
export const Review = isAppDB ? reviewAppDB : reviewReal;
export const Ticket = isAppDB ? ticketAppDB : ticketReal;
export const TicketReply = isAppDB ? ticketReplyAppDB : ticketReplyReal;
export const Tour = isAppDB ? tourAppDB : tourReal;
export const User = isAppDB ? userAppDB : userReal;
export const Wishlist = isAppDB ? wishlistAppDB : wishlistReal;

export default {
  ActivityLog,
  AgentTour,
  Booking,
  Category,
  City,
  Country,
  Coupon,
  Destination,
  Invoice,
  NewsletterSubscription,
  Notification,
  Payment,
  Refund,
  Review,
  Ticket,
  TicketReply,
  Tour,
  User,
  Wishlist
};
