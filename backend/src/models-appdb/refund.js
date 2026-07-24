// TODO: not supported in AppDB, needs manual JS join (reportController.js aggregate totalRefunds)
import { createAdapter } from './baseAdapter.js';

const Refund = createAdapter('refunds');

export default Refund;
