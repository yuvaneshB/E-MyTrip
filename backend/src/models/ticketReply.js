import mongoose from 'mongoose';

const ticketReplySchema = new mongoose.Schema({
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderRole: {
    type: String,
    required: true,
    enum: ['Customer', 'Agent', 'Manager', 'Finance']
  },
  message: {
    type: String,
    required: [true, 'Message text is required'],
    trim: true
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

const TicketReply = mongoose.model('TicketReply', ticketReplySchema);
export default TicketReply;
