// TODO: not supported in AppDB, needs manual JS join (ticketController.js populate assignedAgent, booking, customer)
import { createAdapter } from './baseAdapter.js';

const Ticket = createAdapter('tickets');

export default Ticket;
