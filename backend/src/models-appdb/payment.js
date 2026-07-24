// TODO: not supported in AppDB, needs manual JS join (reportController.js populate user, aggregate totalSales, todaySalesAgg, monthlySalesAgg, paymentMethods)
import { createAdapter } from './baseAdapter.js';

const Payment = createAdapter('payments');

export default Payment;
