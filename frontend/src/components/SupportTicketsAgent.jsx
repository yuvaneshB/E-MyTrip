import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import { 
  MessageSquare, ArrowLeft, Send, CheckCircle, Clock, XCircle, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const SupportTicketsAgent = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Selection states
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyMessage, setReplyMessage] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Load agent assigned tickets
  const loadAgentTickets = async () => {
    setLoading(true);
    try {
      const res = await api.get('/tickets/agent');
      if (res.data.success) {
        setTickets(res.data.tickets);
      }
    } catch (err) {
      console.error('Failed to load agent tickets:', err);
      toast.error('Could not fetch assigned support tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAgentTickets();
  }, []);

  // Fetch individual ticket details for conversation
  const loadTicketDetails = async (id) => {
    try {
      const res = await api.get(`/tickets/${id}`);
      if (res.data.success) {
        setSelectedTicket(res.data.ticket);
        setReplies(res.data.replies);
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

  // Update status (e.g. In Progress, Resolved, Closed)
  const handleUpdateStatus = async (newStatus) => {
    setIsUpdatingStatus(true);
    try {
      const res = await api.patch(`/tickets/${selectedTicket._id}/status`, {
        status: newStatus
      });
      if (res.data.success) {
        toast.success(`Ticket status updated to ${newStatus}`);
        // Refresh details to show new status
        await loadTicketDetails(selectedTicket._id);
      }
    } catch (err) {
      console.error('Status update failed:', err);
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setIsUpdatingStatus(false);
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4 text-left">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-gold-500" /> Support Ticket Workspace
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage user enquiries, coordinate booking adjustments, and resolve problems.</p>
        </div>
        {selectedTicket && (
          <button
            onClick={() => {
              setSelectedTicket(null);
              loadAgentTickets();
            }}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-slate-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Assigned Tickets
          </button>
        )}
      </div>

      {/* TICKET LIST VIEW */}
      {!selectedTicket ? (
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 shadow-sm bg-white text-left">
          <h3 className="font-extrabold text-slate-800 text-sm mb-4">Assigned Support Enquiries</h3>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-2">
              <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-slate-500 italic">Loading tickets...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs italic">
              No support tickets are currently assigned to you.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Ticket ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Linked Booking</th>
                    <th className="py-3 px-4">Updated At</th>
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
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-850 block">{t.customer?.name}</span>
                        <span className="text-[10px] text-slate-400 block">{t.customer?.email}</span>
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
                        {formatDate(t.updatedAt)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <StatusBadge status={t.status} />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => loadTicketDetails(t._id)}
                          className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-lg text-[10px] font-bold transition-all shadow-sm cursor-pointer"
                        >
                          Manage Ticket
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* DETAILED MANAGEMENT WORKSPACE */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Metadata & Actions Column */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 shadow-sm bg-white self-start space-y-5 text-left">
            <h3 className="font-extrabold text-slate-800 text-sm border-b border-slate-200 pb-3">Ticket Information</h3>
            <div className="space-y-3.5 text-xs">
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ticket ID</span>
                <span className="font-mono font-bold text-slate-850">{selectedTicket.ticketId}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subject</span>
                <span className="font-bold text-slate-850 leading-snug">{selectedTicket.subject}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Customer Contact</span>
                <span className="font-bold text-slate-800 block">{selectedTicket.customer.name}</span>
                <span className="text-[10px] text-slate-450 block">{selectedTicket.customer.email}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</span>
                <span className="font-semibold text-slate-705">{selectedTicket.category}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Status</span>
                <StatusBadge status={selectedTicket.status} />
              </div>
              {selectedTicket.booking && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Linked Booking</span>
                  <span className="font-semibold text-gold-600 block leading-snug">{selectedTicket.booking.tour?.title || 'Tour'}</span>
                  <span className="block font-mono text-[9px] text-slate-400">ID: {selectedTicket.booking._id}</span>
                </div>
              )}
            </div>

            {/* Quick Status Control Actions */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Change Status / Action</span>
              
              {selectedTicket.status === 'Open' && (
                <button
                  onClick={() => handleUpdateStatus('In Progress')}
                  disabled={isUpdatingStatus}
                  className="w-full flex items-center justify-center gap-1.5 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-200 text-white py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <Clock className="w-4 h-4" /> Move to In Progress
                </button>
              )}

              {selectedTicket.status !== 'Resolved' && selectedTicket.status !== 'Closed' && (
                <button
                  onClick={() => handleUpdateStatus('Resolved')}
                  disabled={isUpdatingStatus}
                  className="w-full flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 text-white py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" /> Mark as Resolved
                </button>
              )}

              {selectedTicket.status !== 'Closed' && (
                <button
                  onClick={() => handleUpdateStatus('Closed')}
                  disabled={isUpdatingStatus}
                  className="w-full flex items-center justify-center gap-1.5 bg-slate-700 hover:bg-slate-800 disabled:bg-slate-200 text-white py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <XCircle className="w-4 h-4" /> Close Ticket
                </button>
              )}
              
              {(selectedTicket.status === 'Resolved' || selectedTicket.status === 'Closed') && (
                <button
                  onClick={() => handleUpdateStatus('Open')}
                  disabled={isUpdatingStatus}
                  className="w-full flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 text-white py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <AlertCircle className="w-4 h-4" /> Reopen Ticket (Set Open)
                </button>
              )}
            </div>
          </div>

          {/* Threaded Conversation Column */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-200 shadow-sm bg-white flex flex-col min-h-[500px]">
            <h3 className="font-extrabold text-slate-800 text-sm border-b border-slate-200 pb-3 mb-4 text-left">Conversation History</h3>
            
            {/* Messages box */}
            <div className="flex-1 overflow-y-auto max-h-[400px] mb-4 space-y-4 pr-1 text-left">
              {/* Original ticket issue */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-extrabold text-slate-850 text-xs">{selectedTicket.customer.name} (Customer)</span>
                  <span className="text-[10px] text-slate-400">{formatDate(selectedTicket.createdAt)}</span>
                </div>
                <p className="text-xs text-slate-700 whitespace-pre-line">{selectedTicket.description}</p>
              </div>

              {/* Replies */}
              {replies.map(r => {
                const isAgentReply = r.senderRole !== 'Customer';
                return (
                  <div 
                    key={r._id} 
                    className={`p-4 rounded-2xl border ${
                      isAgentReply 
                        ? 'bg-gold-50/50 border-gold-200 ml-8' 
                        : 'bg-white border-slate-200 mr-8'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-extrabold text-slate-850 text-xs">
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
                  placeholder="Write a message to the customer..."
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
              <div className="border-t border-slate-200 pt-4 text-center text-slate-450 text-xs italic">
                This support ticket has been closed. Reopen it from the sidebar options to send replies.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportTicketsAgent;
