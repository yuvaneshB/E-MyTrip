// TODO: not supported in AppDB, needs manual JS join (reportController.js populate booking, user, and aggregate)
import { createAdapter } from './baseAdapter.js';

const Invoice = createAdapter('invoices');

export default Invoice;
