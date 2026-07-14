import express from 'express';
import {
  getStaff,
  createStaff,
  updateStaff,
  updateStaffStatus,
  resetStaffPassword
} from '../controllers/staffController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';

const router = express.Router();

// Require authorization for all staff endpoints - Travel Agent ('Agent') only
router.use(protect);
router.use(authorize('Agent'));

router.get('/', getStaff);
router.post('/', createStaff);
router.patch('/:id', updateStaff);
router.patch('/:id/status', updateStaffStatus);
router.patch('/:id/reset-password', resetStaffPassword);

export default router;
