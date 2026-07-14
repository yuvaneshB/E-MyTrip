import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { 
  MessageSquare, PlusCircle, ArrowLeft, Send, CheckCircle, Clock, AlertTriangle, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const SupportTicketsCustomer = () => {
  const { user } = useAuth();
  
  // Navigation states: 'list', 'create', 'details'
  const [view, setView] = useState('list');
  const [tickets, setTickets] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Selection states
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyMessage, setReplyMessage] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // New ticket form states
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Booking');
  const [bookingId, setBookingId] = useState('');
  const [description, setDescription] = useState('');
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);

  // Load tickets and bookings
  const loadTicketsAndBookings = async () => {
    setLoading(true);
    try {
      const [ticketsRes, bookingsRes] = await Promise.all([
        api.get('/tickets/my'),
        api.get('/bookings/my-bookings')
      ]);
      
      if (ticketsRes.data.success) {
        setTickets(ticketsRes.data.tickets);
      }
      if (bookingsRes.data.success) {
        setBookings(bookingsRes.data.bookings);
      }
    } catch (err) {
      console.error('Failed to load tickets/bookings:', err);
      toast.error('Could not fetch support ticket details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTicketsAndBookings();
  }, []);

  // Fetch individual ticket details for conversation
  const loadTicketDetails = async (id) => {
    try {
      const res = await api.get(`/tickets/${id}`);
      if (res.data.success) {
        setSelectedTicket(res.data.ticket);
        setReplies(res.data.replies);
        setView('details');
      }
    } catch (err) {
      console.error('Failed to load ticket details:', err);
      toast.error('Could not fetch ticket conversation');
    }
  };

  // Submit a reply
  const handlePostReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    setIsSubmittingReply(true);
    try {
      const res = await api.post(`/tickets/${selectedTicket._id}/reply`, {
        message: replyMessage
      });
      if (res.data.success) {
        setReplyMessage('');
        // Refresh ticket details to show new reply
        await loadTicketDetails(selectedTicket._id);
        toast.success('Reply submitted successfully');
      }
    } catch (err) {
      console.error('Reply submission failed:', err);
      toast.error(err.response?.data?.message || 'Failed to submit reply');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // Raise new ticket
  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      toast.error('Subject and description are required');
      return;
    }

    setIsCreatingTicket(true);
    try {
      const res = await api.post('/tickets', {
        subject,
        category,
        bookingId: bookingId || undefined,
        description
      });
      if (res.data.success) {
        toast.success('Support ticket raised successfully');
        setSubject('');
        setCategory('Booking');
        setBookingId('');
        setDescription('');
        setView('list');
        await loadTicketsAndBookings();
      }
    } catch (err) {
      console.error('Failed to create ticket:', err);
      toast.error(err.response?.data?.message || 'Failed to raise ticket');
    } finally {
      setIsCreatingTicket(false);
    }
  };

  // Format Date Helper
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Status Badge Component
  const StatusBadge = ({ status }) => {
    let classes = '';
    switch (status) {
      case 'Open':
        classes = 'bg-amber-50 border border-amber-200 text-amber-700';
        break;
      case 'In Progress':
        classes = 'bg-blue-50 border border-blue-200 text-blue-700';
        break;
      case 'Resolved':
        classes = 'bg-emerald-50 border border-emerald-200 text-emerald-700';
        break;
      case 'Closed':
        classes = 'bg-slate-100 border border-slate-300 text-slate-650';
        break;
      default:
        classes = 'bg-slate-50 border border-slate-200 text-slate-500';
    }
    return (
      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide inline-block ${classes}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-gold-500" /> Customer Support Center
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Need help with bookings or refunds? Raise and track your support tickets here.</p>
        </div>
        {view === 'list' && (
          <button
            onClick={() => setView('create')}
            className="flex items-center gap-1.5 bg-gold-500 hover:bg-gold-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-gold-500/10 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Raise Support Ticket
          </button>
        )}
        {view !== 'list' && (
          <button
            onClick={() => {
              setView('list');
              setSelectedTicket(null);
              loadTicketsAndBookings();
            }}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-slate-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to My Tickets
          </button>
        )}
      </div>

      {/* RENDER LIST OF TICKETS */}
      {view === 'list' && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 shadow-sm bg-white">
          <h3 className="font-extrabold text-slate-800 text-sm mb-4">My Tickets</h3>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-2">
              <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-slate-505 italic">Retrieving tickets...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs italic">
              You haven't raised any support tickets yet. Click "Raise Support Ticket" to start.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Ticket ID</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Booking Ref</th>
                    <th className="py-3 px-4">Created Date</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tickets.map(t => (
                    <tr key={t._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-700">
                        {t.ticketId}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {t.subject}
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {t.category}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">
                        {t.booking ? `TX-${t.booking._id.toString().substring(0, 8).toUpperCase()}` : 'None'}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {formatDate(t.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <StatusBadge status={t.status} />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => loadTicketDetails(t._id)}
                          className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-lg text-[10px] font-bold transition-all shadow-sm cursor-pointer"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* RENDER NEW TICKET FORM */}
      {view === 'create' && (
        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm bg-white max-w-2xl mx-auto">
          <h3 className="font-extrabold text-slate-800 text-sm border-b border-slate-200 pb-3 mb-6">Raise a New Support Ticket</h3>
          <form onSubmit={handleCreateTicket} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-gold-500 focus:outline-none text-xs text-slate-800 cursor-pointer"
                >
                  <option value="Booking">Booking Issues</option>
                  <option value="Payment">Payment Processing</option>
                  <option value="Refund">Refund Request</option>
                  <option value="Cancellation">Cancellation Policy</option>
                  <option value="Tour Information">Tour Queries</option>
                  <option value="Technical Issues">Technical Support</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-2">Linked Booking ID (Optional)</label>
                <select
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-gold-500 focus:outline-none text-xs text-slate-800 cursor-pointer"
                >
                  <option value="">Select Booking</option>
                  {bookings.map(b => (
                    <option key={b._id} value={b._id}>
                      {b.tour?.title || 'Tour'} (${b.totalAmount} | {new Date(b.departureDate).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-2">Subject / Summary</label>
              <input
                type="text"
                placeholder="E.g., Payment charged twice but got hold status"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-gold-500 focus:outline-none text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-2">Detailed Description</label>
              <textarea
                rows="5"
                placeholder="Describe your issue in detail. If applicable, list transaction references, error messages, or date schedules."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-gold-500 focus:outline-none text-xs text-slate-800"
              />
            </div>

            <button
              type="submit"
              disabled={isCreatingTicket}
              className="w-full bg-gold-500 hover:bg-gold-600 disabled:bg-slate-250 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-gold-500/10 cursor-pointer disabled:cursor-not-allowed text-xs uppercase tracking-wider"
            >
              {isCreatingTicket ? 'Submitting ticket...' : 'Submit Support Ticket'}
            </button>
          </form>
        </div>
      )}

      {/* RENDER TICKET DETAILS & THREADED CONVERSATION */}
      {view === 'details' && selectedTicket && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Metadata Card */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 shadow-sm bg-white self-start space-y-4">
            <h3 className="font-extrabold text-slate-800 text-sm border-b border-slate-200 pb-3">Ticket Information</h3>
            <div className="space-y-3.5 text-xs text-left">
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ticket ID</span>
                <span className="font-mono font-bold text-slate-800">{selectedTicket.ticketId}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subject</span>
                <span className="font-bold text-slate-800 leading-snug">{selectedTicket.subject}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</span>
                <span className="font-semibold text-slate-700">{selectedTicket.category}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</span>
                <StatusBadge status={selectedTicket.status} />
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Created On</span>
                <span className="font-medium text-slate-600">{formatDate(selectedTicket.createdAt)}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Activity</span>
                <span className="font-medium text-slate-600">{formatDate(selectedTicket.updatedAt)}</span>
              </div>
              {selectedTicket.booking && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Linked Booking</span>
                  <span className="font-semibold text-gold-600">{selectedTicket.booking.tour?.title || 'Tour'}</span>
                  <span className="block font-mono text-[10px] text-slate-400 mt-0.5">ID: {selectedTicket.booking._id}</span>
                </div>
              )}
              {selectedTicket.assignedAgent && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assigned Agent</span>
                  <span className="font-bold text-slate-800">{selectedTicket.assignedAgent.name}</span>
                  <span className="block text-[10px] text-slate-400">{selectedTicket.assignedAgent.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Threaded Conversation Card */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-200 shadow-sm bg-white flex flex-col min-h-[500px]">
            <h3 className="font-extrabold text-slate-800 text-sm border-b border-slate-200 pb-3 mb-4">Conversation History</h3>
            
            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto max-h-[400px] mb-4 space-y-4 pr-1 text-left">
              {/* Original Ticket Description */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-extrabold text-slate-800 text-xs">{selectedTicket.customer.name} (Customer)</span>
                  <span className="text-[10px] text-slate-400">{formatDate(selectedTicket.createdAt)}</span>
                </div>
                <p className="text-xs text-slate-700 whitespace-pre-line">{selectedTicket.description}</p>
              </div>

              {/* Thread replies */}
              {replies.map(r => {
                const isMe = r.sender?._id === user?.id || r.sender === user?.id;
                return (
                  <div 
                    key={r._id} 
                    className={`p-4 rounded-2xl border ${
                      isMe 
                        ? 'bg-gold-50/50 border-gold-200 ml-8' 
                        : 'bg-white border-slate-200 mr-8'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-extrabold text-slate-800 text-xs">
                        {r.sender?.name} ({r.senderRole})
                      </span>
                      <span className="text-[10px] text-slate-400">{formatDate(r.createdAt)}</span>
                    </div>
                    <p className="text-xs text-slate-700 whitespace-pre-line">{r.message}</p>
                  </div>
                );
              })}
            </div>

            {/* Reply Input Form */}
            {selectedTicket.status !== 'Closed' ? (
              <form onSubmit={handlePostReply} className="border-t border-slate-200 pt-4 flex gap-2">
                <textarea
                  rows="2"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your response to the support agent..."
                  required
                  className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-gold-500 focus:outline-none text-xs text-slate-800 resize-none"
                />
                <button
                  type="submit"
                  disabled={isSubmittingReply}
                  className="bg-gold-500 hover:bg-gold-600 disabled:bg-slate-200 text-white rounded-xl px-4 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="border-t border-slate-200 pt-4 flex items-center gap-2 text-slate-400 justify-center text-xs italic">
                <AlertCircle className="w-4 h-4 text-slate-400" /> This ticket is closed. You can reply to reopen it.
                <button
                  onClick={async () => {
                    // Quick reopen by posting a message
                    setReplyMessage('Reopening this support ticket.');
                  }}
                  className="text-gold-500 hover:underline font-bold ml-1 cursor-pointer"
                >
                  Reopen Ticket
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportTicketsCustomer;
