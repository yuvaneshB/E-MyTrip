import Ticket from '../models/ticket.js';
import TicketReply from '../models/ticketReply.js';
import Booking from '../models/booking.js';
import User from '../models/user.js';
import { sendEmail } from '../utilities/mailer.js';

// Helper to generate a unique ticket ID
const generateUniqueTicketId = async () => {
  let isUnique = false;
  let ticketId = '';
  while (!isUnique) {
    ticketId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
    const existing = await Ticket.findOne({ ticketId });
    if (!existing) {
      isUnique = true;
    }
  }
  return ticketId;
};

// @desc    Create a support ticket
// @route   POST /api/v1/tickets
// @access  Protected (Customer)
export const createTicket = async (req, res, next) => {
  try {
    const { subject, category, bookingId, description } = req.body;

    if (!subject || !category || !description) {
      return res.status(400).json({ success: false, message: 'Subject, category, and description are required' });
    }

    let assignedAgentId = null;

    // Resolve assigned agent from booking if provided
    if (bookingId) {
      const booking = await Booking.findById(bookingId).populate({
        path: 'tour',
        select: 'createdBy'
      });
      if (booking && booking.tour && booking.tour.createdBy) {
        assignedAgentId = booking.tour.createdBy;
      }
    }

    // Fallback: Assign to the first active Agent in the system
    if (!assignedAgentId) {
      const defaultAgent = await User.findOne({ role: 'Agent', isActive: true });
      if (defaultAgent) {
        assignedAgentId = defaultAgent._id;
      }
    }

    const ticketId = await generateUniqueTicketId();

    const ticket = await Ticket.create({
      ticketId,
      customer: req.user.id,
      assignedAgent: assignedAgentId,
      subject,
      category,
      booking: bookingId || null,
      description,
      status: 'Open'
    });

    // Send emails
    const customerUser = req.user;
    
    // Customer Creation Notification
    sendEmail({
      to: customerUser.email,
      subject: `[ExploreMyTrip] Support Ticket Created - ${ticket.ticketId}`,
      html: `
        <p>Hello ${customerUser.name},</p>
        <p>Your support ticket has been successfully created. Our support team has been notified and will review your request shortly.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
          <tr><td style="padding: 4px 0; font-weight: bold; width: 120px; color: #475569;">Ticket ID:</td><td style="color: #0f172a; font-weight: bold;">${ticket.ticketId}</td></tr>
          <tr><td style="padding: 4px 0; font-weight: bold; color: #475569;">Subject:</td><td style="color: #0f172a;">${ticket.subject}</td></tr>
          <tr><td style="padding: 4px 0; font-weight: bold; color: #475569;">Category:</td><td style="color: #0f172a;">${ticket.category}</td></tr>
          <tr><td style="padding: 4px 0; font-weight: bold; color: #475569;">Status:</td><td><span style="background-color: #fef3c7; color: #b45309; padding: 2px 8px; border-radius: 4px; font-weight: bold;">${ticket.status}</span></td></tr>
        </table>
        <p><strong>Description:</strong></p>
        <p style="background-color: #f8fafc; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-style: italic; color: #475569;">${ticket.description}</p>
        <p>You can track and reply to your ticket from your Customer Dashboard under "Support Tickets".</p>
      `,
      emailType: 'Support Ticket'
    }).catch(err => console.error('Customer email notification failed:', err.message));

    // Agent Assignment Notification
    if (assignedAgentId) {
      const agentUser = await User.findById(assignedAgentId);
      if (agentUser) {
        sendEmail({
          to: agentUser.email,
          subject: `[ExploreMyTrip] Support Ticket Assigned - ${ticket.ticketId}`,
          html: `
            <p>Hello ${agentUser.name},</p>
            <p>A new customer support ticket has been assigned to you for investigation.</p>
            <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
              <tr><td style="padding: 4px 0; font-weight: bold; width: 120px; color: #475569;">Ticket ID:</td><td style="color: #0f172a; font-weight: bold;">${ticket.ticketId}</td></tr>
              <tr><td style="padding: 4px 0; font-weight: bold; color: #475569;">Customer:</td><td style="color: #0f172a;">${customerUser.name} (${customerUser.email})</td></tr>
              <tr><td style="padding: 4px 0; font-weight: bold; color: #475569;">Subject:</td><td style="color: #0f172a;">${ticket.subject}</td></tr>
              <tr><td style="padding: 4px 0; font-weight: bold; color: #475569;">Category:</td><td style="color: #0f172a;">${ticket.category}</td></tr>
            </table>
            <p><strong>Description:</strong></p>
            <p style="background-color: #f8fafc; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-style: italic; color: #475569;">${ticket.description}</p>
            <p>Please log in to the Travel Agent Dashboard to resolve this customer ticket.</p>
          `,
          emailType: 'Support Ticket'
        }).catch(err => console.error('Agent email notification failed:', err.message));
      }
    }

    res.status(201).json({
      success: true,
      message: 'Support ticket raised successfully',
      ticket
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer's tickets
// @route   GET /api/v1/tickets/my
// @access  Protected (Customer)
export const getMyTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({ customer: req.user.id })
      .populate('assignedAgent', 'name email')
      .populate('booking')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tickets.length,
      tickets
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get agent's assigned tickets
// @route   GET /api/v1/tickets/agent
// @access  Protected (Agent)
export const getAgentTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({ assignedAgent: req.user.id })
      .populate('customer', 'name email')
      .populate('booking')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: tickets.length,
      tickets
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get ticket details and replies
// @route   GET /api/v1/tickets/:id
// @access  Protected (Customer & Agent)
export const getTicketDetails = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('assignedAgent', 'name email')
      .populate('booking');

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Authorize: Only the customer who raised it OR the assigned agent can access it.
    const isCustomer = ticket.customer._id.toString() === req.user.id;
    const isAgent = ticket.assignedAgent && ticket.assignedAgent._id.toString() === req.user.id;
    const isStaff = ['Manager', 'Finance'].includes(req.user.role); // Manager/Finance bypass

    if (!isCustomer && !isAgent && !isStaff) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this ticket' });
    }

    const replies = await TicketReply.find({ ticket: ticket._id })
      .populate('sender', 'name email profilePicture')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      ticket,
      replies
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reply to a ticket
// @route   POST /api/v1/tickets/:id/reply
// @access  Protected (Customer & Agent)
export const replyToTicket = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ success: false, message: 'Message text is required' });
    }

    const ticket = await Ticket.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('assignedAgent', 'name email');

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Check authorization
    const isCustomer = ticket.customer._id.toString() === req.user.id;
    const isAgent = ticket.assignedAgent && ticket.assignedAgent._id.toString() === req.user.id;
    const isStaff = ['Manager', 'Finance'].includes(req.user.role);

    if (!isCustomer && !isAgent && !isStaff) {
      return res.status(403).json({ success: false, message: 'Not authorized to reply to this ticket' });
    }

    // Auto update status if closed and customer replies -> reopen it. Or if agent replies, change status to In Progress.
    if (req.user.role === 'Customer' && ticket.status === 'Closed') {
      ticket.status = 'Open';
    } else if (req.user.role === 'Agent' && ticket.status === 'Open') {
      ticket.status = 'In Progress';
    }

    await ticket.save();

    const reply = await TicketReply.create({
      ticket: ticket._id,
      sender: req.user.id,
      senderRole: req.user.role,
      message
    });

    // Notify customer if agent replies
    if (req.user.role === 'Agent' || isStaff) {
      sendEmail({
        to: ticket.customer.email,
        subject: `[ExploreMyTrip] Support Ticket Update - ${ticket.ticketId}`,
        html: `
          <p>Hello ${ticket.customer.name},</p>
          <p>Our support team has updated your ticket <strong>${ticket.ticketId}</strong> with a reply.</p>
          <div style="background-color: #f8fafc; padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px; margin: 16px 0; font-size: 14px;">
            <strong style="color: #0f172a; display: block; margin-bottom: 8px;">Reply Message:</strong>
            <p style="margin: 0; line-height: 1.5; color: #334155; font-style: italic;">"${message}"</p>
          </div>
          <p>Please log in to your dashboard to view the full conversation thread and reply if needed.</p>
        `,
        emailType: 'Support Ticket'
      }).catch(err => console.error('Customer email notification failed:', err.message));
    } else if (req.user.role === 'Customer' && ticket.assignedAgent) {
      // Proactive notification to the assigned agent when a customer replies
      sendEmail({
        to: ticket.assignedAgent.email,
        subject: `[ExploreMyTrip] Customer Replied to Ticket - ${ticket.ticketId}`,
        html: `
          <p>Hello ${ticket.assignedAgent.name},</p>
          <p>Customer <strong>${ticket.customer.name}</strong> has added a new reply to support ticket <strong>${ticket.ticketId}</strong>.</p>
          <div style="background-color: #f8fafc; padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px; margin: 16px 0; font-size: 14px;">
            <strong style="color: #0f172a; display: block; margin-bottom: 8px;">Customer Message:</strong>
            <p style="margin: 0; line-height: 1.5; color: #334155; font-style: italic;">"${message}"</p>
          </div>
          <p>Please log in to the agent workspace to view and reply.</p>
        `,
        emailType: 'Support Ticket'
      }).catch(err => console.error('Agent email notification failed:', err.message));
    }

    res.status(201).json({
      success: true,
      message: 'Reply posted successfully',
      reply
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update ticket status (Resolved, Closed, In Progress)
// @route   PATCH /api/v1/tickets/:id/status
// @access  Protected (Agent only)
export const updateTicketStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['Open', 'In Progress', 'Resolved', 'Closed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const ticket = await Ticket.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('assignedAgent', 'name email');

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Check authorization: Must be the assigned agent or a Manager/Finance staff
    const isAgent = ticket.assignedAgent && ticket.assignedAgent._id.toString() === req.user.id;
    const isStaff = ['Manager', 'Finance'].includes(req.user.role);

    if (!isAgent && !isStaff) {
      return res.status(403).json({ success: false, message: 'Not authorized to manage this ticket' });
    }

    const oldStatus = ticket.status;
    ticket.status = status;
    await ticket.save();

    // Trigger emails on status change
    if (status === 'Resolved') {
      sendEmail({
        to: ticket.customer.email,
        subject: `[ExploreMyTrip] Support Ticket Resolved - ${ticket.ticketId}`,
        html: `
          <p>Hello ${ticket.customer.name},</p>
          <p>Your support ticket <strong>${ticket.ticketId}</strong> has been marked as <strong>Resolved</strong> by our support agent.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
            <tr><td style="padding: 4px 0; font-weight: bold; width: 120px; color: #475569;">Ticket ID:</td><td style="color: #0f172a; font-weight: bold;">${ticket.ticketId}</td></tr>
            <tr><td style="padding: 4px 0; font-weight: bold; color: #475569;">Subject:</td><td style="color: #0f172a;">${ticket.subject}</td></tr>
            <tr><td style="padding: 4px 0; font-weight: bold; color: #475569;">Final Status:</td><td><span style="background-color: #d1fae5; color: #065f46; padding: 2px 8px; border-radius: 4px; font-weight: bold;">Resolved</span></td></tr>
          </table>
          <p>If you feel this issue is not fully resolved, you can post a new reply in the dashboard to reopen the ticket.</p>
          <p>Thank you for your patience and for choosing ExploreMyTrip.</p>
        `,
        emailType: 'Support Ticket'
      }).catch(err => console.error('Customer email notification failed:', err.message));
    } else if (status === 'Closed') {
      sendEmail({
        to: ticket.customer.email,
        subject: `[ExploreMyTrip] Support Ticket Closed - ${ticket.ticketId}`,
        html: `
          <p>Hello ${ticket.customer.name},</p>
          <p>Your support ticket <strong>${ticket.ticketId}</strong> has been marked as <strong>Closed</strong>. No further replies can be added unless it is reopened.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
            <tr><td style="padding: 4px 0; font-weight: bold; width: 120px; color: #475569;">Ticket ID:</td><td style="color: #0f172a; font-weight: bold;">${ticket.ticketId}</td></tr>
            <tr><td style="padding: 4px 0; font-weight: bold; color: #475569;">Subject:</td><td style="color: #0f172a;">${ticket.subject}</td></tr>
            <tr><td style="padding: 4px 0; font-weight: bold; color: #475569;">Final Status:</td><td><span style="background-color: #e2e8f0; color: #475569; padding: 2px 8px; border-radius: 4px; font-weight: bold;">Closed</span></td></tr>
          </table>
          <p>If you need help with any other issues, please feel free to create a new ticket in the portal.</p>
        `,
        emailType: 'Support Ticket'
      }).catch(err => console.error('Customer email notification failed:', err.message));
    } else if (oldStatus !== status) {
      sendEmail({
        to: ticket.customer.email,
        subject: `[ExploreMyTrip] Support Ticket Status Updated - ${ticket.ticketId}`,
        html: `
          <p>Hello ${ticket.customer.name},</p>
          <p>The status of your support ticket <strong>${ticket.ticketId}</strong> has been updated to <strong>${status}</strong>.</p>
          <p>Our agent is actively working on your request. You can check updates or reply via the dashboard portal.</p>
        `,
        emailType: 'Support Ticket'
      }).catch(err => console.error('Customer email notification failed:', err.message));
    }

    res.status(200).json({
      success: true,
      message: `Ticket status updated to ${status} successfully`,
      ticket
    });
  } catch (error) {
    next(error);
  }
};
