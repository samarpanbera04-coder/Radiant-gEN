
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  MessageSquare, 
  Clock, 
  ChevronRight, 
  AlertCircle, 
  Send,
  User,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';
import { UserProfile, SupportTicket, TicketCategory, TicketStatus } from '../types';

interface SupportTicketsProps {
  user: UserProfile;
  tickets: SupportTicket[];
  onAddTicket: (ticket: SupportTicket) => void;
}

const SupportTickets: React.FC<SupportTicketsProps> = ({ user, tickets, onAddTicket }) => {
  const [view, setView] = useState<'list' | 'create' | 'detail'>('list');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [newTicket, setNewTicket] = useState({ subject: '', category: 'Technical Issue' as TicketCategory, message: '' });

  // IMPORTANT: Moderators see ALL tickets, regular users only see their own.
  const filteredTickets = user.isModerator ? tickets : tickets.filter(t => t.userId === user.email);

  const handleCreateTicket = () => {
    if (!newTicket.subject || !newTicket.message) return;
    const ticket: SupportTicket = {
      id: `TKT-${Math.floor(Math.random() * 9000) + 1000}`,
      userId: user.email,
      userName: user.name,
      subject: newTicket.subject,
      category: newTicket.category,
      status: 'Open',
      priority: newTicket.category === 'Billing & Refunds' ? 'High' : 'Normal',
      createdAt: Date.now(),
      lastUpdated: Date.now(),
      messages: [{ id: '1', sender: 'user', content: newTicket.message, timestamp: Date.now() }]
    };
    onAddTicket(ticket);
    setView('list');
    setNewTicket({ subject: '', category: 'Technical Issue', message: '' });
  };

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case 'Open': return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
      case 'In Progress': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Resolved': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20';
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">
            SUPPORT <span className="text-sky-400 not-italic">PORTAL</span>
          </h3>
          <p className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.5em] italic">Human Intervention Protocol</p>
        </div>
        {view === 'list' && (
          <button 
            onClick={() => setView('create')}
            className="bg-white text-black px-12 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-sky-400 hover:text-white transition-all shadow-xl active:scale-95 flex items-center gap-3"
          >
            <Plus className="w-5 h-5" /> Open New Ticket
          </button>
        )}
        {view !== 'list' && (
          <button 
            onClick={() => { setView('list'); setSelectedTicket(null); }}
            className="text-zinc-500 hover:text-white flex items-center gap-3 font-black text-[10px] uppercase tracking-widest transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Overview
          </button>
        )}
      </div>

      {view === 'list' && (
        <div className="space-y-8">
          <div className="glass-panel p-10 rounded-[2.5rem] border-white/5 space-y-6">
             <div className="flex items-center gap-4 bg-[#08080c] border border-white/10 px-8 py-5 rounded-2xl focus-within:border-sky-500/50 transition-all">
                <Search className="w-6 h-6 text-zinc-600" />
                <input 
                  placeholder="SEARCH TICKETS BY ID OR SUBJECT..." 
                  className="bg-transparent border-none outline-none w-full text-sm font-black uppercase tracking-widest text-zinc-300 placeholder:text-zinc-700"
                />
             </div>
             
             <div className="space-y-4">
               {filteredTickets.length > 0 ? filteredTickets.map((ticket) => (
                 <div 
                   key={ticket.id}
                   onClick={() => { setSelectedTicket(ticket); setView('detail'); }}
                   className="glass-panel group p-10 rounded-[2.5rem] border-white/5 hover:neon-border-blue transition-all duration-500 flex flex-col md:flex-row items-center gap-10 cursor-pointer relative overflow-hidden"
                 >
                    <div className="absolute inset-y-0 left-0 w-2 bg-sky-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <MessageSquare className="w-8 h-8 text-sky-400" />
                    </div>
                    <div className="flex-1 min-w-0 text-center md:text-left">
                       <div className="flex items-center justify-center md:justify-start gap-4 mb-3">
                          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5 italic">{ticket.category}</span>
                          <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border ${getStatusColor(ticket.status)} italic`}>{ticket.status}</span>
                       </div>
                       <h4 className="text-2xl font-black text-zinc-100 truncate group-hover:text-sky-400 transition-colors uppercase italic">{ticket.subject}</h4>
                       <p className="text-[9px] text-zinc-600 font-bold uppercase italic mt-1">Creator: {ticket.userName}</p>
                    </div>
                    <div className="flex flex-col items-center md:items-end gap-3">
                       <span className="text-[12px] font-black text-sky-400 uppercase tracking-widest italic">{ticket.id}</span>
                       <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                          <Clock className="w-4 h-4" /> Updated {new Date(ticket.lastUpdated).toLocaleDateString()}
                       </span>
                    </div>
                    <ChevronRight className="w-8 h-8 text-zinc-700 group-hover:text-sky-400 transform transition-all group-hover:translate-x-3" />
                 </div>
               )) : (
                 <div className="py-20 text-center space-y-4">
                    <AlertCircle className="w-12 h-12 text-zinc-700 mx-auto" />
                    <p className="text-zinc-600 font-black uppercase text-sm tracking-widest">No active tickets found</p>
                 </div>
               )}
             </div>
          </div>
        </div>
      )}

      {view === 'create' && (
        <div className="glass-panel p-16 rounded-[4rem] border-white/5 max-w-4xl mx-auto space-y-12">
           <div className="space-y-6 text-center">
              <h4 className="text-3xl font-black text-white italic uppercase tracking-tighter">Initialize Support Node</h4>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Billing & Refunds', 'Technical Issue', 'Crash/Plugin Problem', 'Account & Login'].map((cat) => (
                 <button 
                   key={cat}
                   onClick={() => setNewTicket({ ...newTicket, category: cat as TicketCategory })}
                   className={`px-8 py-6 rounded-2xl border transition-all text-[11px] font-black uppercase tracking-widest italic ${newTicket.category === cat ? 'bg-sky-500/20 border-sky-500/50 text-sky-400' : 'bg-white/5 border-white/10 text-zinc-600 hover:text-white'}`}
                 >
                    {cat}
                 </button>
              ))}
           </div>

           <div className="space-y-4">
              <input 
                 value={newTicket.subject}
                 onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                 placeholder="TICKET SUBJECT..."
                 className="w-full bg-[#08080c] border border-white/10 rounded-2xl px-8 py-6 text-zinc-200 focus:ring-2 focus:ring-sky-500/30 outline-none transition-all text-sm font-black uppercase tracking-widest"
              />
              <textarea 
                 value={newTicket.message}
                 onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                 placeholder="DETAILED PROBLEM CONTEXT..."
                 className="w-full h-48 bg-[#08080c] border border-white/10 rounded-[2.5rem] p-8 text-zinc-200 focus:ring-2 focus:ring-sky-500/30 outline-none transition-all resize-none text-sm font-bold italic"
              />
           </div>

           <button 
             onClick={handleCreateTicket}
             className="w-full bg-sky-500 hover:bg-sky-400 text-black font-black py-8 rounded-[2rem] transition-all shadow-2xl uppercase tracking-[0.4em] text-sm flex items-center justify-center gap-5"
           >
              DEPLOY TICKET <Send className="w-6 h-6" />
           </button>
        </div>
      )}

      {view === 'detail' && selectedTicket && (
        <div className="space-y-10 animate-in slide-in-from-right-8">
           <div className="flex flex-col gap-6">
              {selectedTicket.messages.map((msg) => (
                 <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-10 rounded-[3rem] border ${msg.sender === 'user' ? 'bg-sky-500/5 border-sky-500/20 rounded-tr-none' : 'bg-[#08080c] border-white/5 rounded-tl-none'}`}>
                       <div className="flex items-center gap-4 mb-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${msg.sender === 'user' ? 'bg-sky-500/10 text-sky-400' : 'bg-purple-500/10 text-purple-400'}`}>
                             {msg.sender === 'user' ? <User className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
                          </div>
                          <span className="text-[11px] font-black uppercase tracking-widest text-zinc-500 italic">
                             {msg.sender === 'user' ? selectedTicket.userName : 'Moderator Command'}
                          </span>
                       </div>
                       <p className="text-base font-bold text-zinc-300 leading-relaxed italic">{msg.content}</p>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default SupportTickets;
