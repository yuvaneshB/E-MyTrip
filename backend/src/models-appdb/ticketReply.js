// TODO: not supported in AppDB, needs manual JS join (ticketController.js populate sender)
import { createAdapter } from './baseAdapter.js';

const TicketReply = createAdapter('ticketReplies');

export default TicketReply;
