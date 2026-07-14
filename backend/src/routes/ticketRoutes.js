import express from 'express';
import {
  createTicket,
  getMyTickets,
  getAgentTickets,
  getTicketDetails,
  replyToTicket,
  updateTicketStatus
} from '../controllers/ticketController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';

const router = express.Router();

router.post('/', protect, createTicket);
router.get('/my', protect, getMyTickets);
router.get('/agent', protect, authorize('Agent'), getAgentTickets);
router.get('/:id', protect, getTicketDetails);
router.post('/:id/reply', protect, replyToTicket);
router.patch('/:id/status', protect, authorize('Agent'), updateTicketStatus);

export default router;
