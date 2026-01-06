
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Check, 
  X, 
  Users, 
  CreditCard, 
  MessageSquare, 
  Activity,
  Code2,
  Box,
  Palette,
  Bot,
  ScrollText,
  Terminal,
  Search,
  Database,
  Mail,
  Hash,
  Star,
  Crown,
  Globe,
  LifeBuoy,
  ChevronRight,
  Clock,
  Zap
} from 'lucide-react';
import { SupportTicket, PaymentTransaction, ToolType, UserPlan } from '../types';

interface ModeratorPanelProps {
  tickets: SupportTicket[];
  transactions: PaymentTransaction[];
  onApproveTxn: (id: string) => void;
  onRejectTxn: (id: string) => void;
  onResolveTicket: (id: string) => void;
  onNavigateToTool: (tool: ToolType) => void;
  onManualUpgrade: (email: string, plan: UserPlan) => void;
}

const ModeratorPanel: React.FC<ModeratorPanelProps> = ({ 
  tickets, 
  transactions, 
  onApproveTxn, 
  onRejectTxn, 
  onResolveTicket,
  onNavigateToTool,
  onManualUpgrade 
}) => {
  const [activeTab, setActiveTab] = useState<'monitor' | 'finance' | 'support' | 'registry'>('support');
  const [searchEmail, setSearchEmail] = useState('');
  const [manualPlan, setManualPlan] = useState<UserPlan>('pro');

  const stats = [
    { label: 'Neural Activity', value: '42.8ms', icon: Activity, color: 'text-violet-400' },
    { label: 'Registered Nodes', value: '1,042', icon: Users, color: 'text-cyan-400' },
    { label: 'Auth Pipeline', value: transactions.filter(t => t.status === 'Pending').length, icon: CreditCard, color: 'text-amber-400' },
    { label: 'Open Tickets', value: tickets.filter(t => t.status !== 'Resolved').length, icon: LifeBuoy, color: 'text-red-400' }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
        <div className="space-y-2">
          <h3 className="text-6xl font-black text-white italic tracking-tighter uppercase mb-2 leading-none">
            VOID <span className="text-cyan-400">CORE</span>
          </h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic">Global Overlord Authorization / Priority Mode</p>
        </div>
        <div className="flex gap-2 p-2 bg-slate-800/40 border border-white/5 rounded-3xl backdrop-blur-3xl shadow-2xl">
           {[
             {id: 'support', icon: LifeBuoy, label: 'Ticket Hub'}, 
             {id: 'finance', icon: CreditCard, label: 'Ledger'}, 
             {id: 'monitor', icon: Globe, label: 'Node Map'}, 
             {id: 'registry', icon: Database, label: 'Registry'}
           ].map(tab => (
             <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`px-8 py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === tab.id ? 'bg-cyan-400 text-slate-900 shadow-lg shadow-cyan-400/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
             >
               <tab.icon className="w-4 h-4" /> {tab.label}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass-panel p-8 rounded-[2.5rem] border-white/5 flex items-center gap-6 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity"><stat.icon className="w-12 h-12" /></div>
             <div className={`p-4 rounded-xl bg-slate-800/50 ${stat.color} shadow-inner`}>
                <stat.icon className="w-6 h-6" />
             </div>
             <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic mb-1">{stat.label}</p>
                <p className="text-2xl font-black text-white italic">{stat.value}</p>
             </div>
          </div>
        ))}
      </div>

      {activeTab === 'support' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-500">
           <div className="flex items-center justify-between px-10">
              <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] italic">Priority Neural Support Queue</h4>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-xl border border-white/5">
                    <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Awaiting Solution</span>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 gap-6">
             {tickets.length > 0 ? tickets.map(ticket => (
               <div key={ticket.id} className={`glass-panel p-10 rounded-[3rem] border flex flex-col md:flex-row items-center gap-12 hover:border-cyan-400/40 transition-all group shadow-xl bg-slate-800/30 ${ticket.status === 'Resolved' ? 'opacity-60 border-emerald-500/20' : 'border-white/5'}`}>
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner ${ticket.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-violet-500/10 text-cyan-400'}`}>
                     <MessageSquare className="w-8 h-8" />
                  </div>
                  <div className="flex-1 text-center md:text-left min-w-0">
                     <div className="flex flex-wrap gap-3 mb-3 justify-center md:justify-start">
                        <span className="text-[9px] font-black uppercase text-violet-400 tracking-widest bg-violet-500/10 px-4 py-1.5 rounded-full border border-violet-500/10 italic">{ticket.category}</span>
                        <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest py-1.5 font-mono italic">{ticket.id}</span>
                        {ticket.priority === 'High' && <span className="text-[9px] font-black uppercase text-red-400 bg-red-500/10 px-4 py-1.5 rounded-full border border-red-500/10 italic">High Priority</span>}
                     </div>
                     <h5 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none mb-3 truncate">{ticket.subject}</h5>
                     <div className="flex items-center justify-center md:justify-start gap-6">
                        <p className="text-[10px] text-slate-500 italic font-black uppercase tracking-widest">Identity: <span className="text-cyan-400">{ticket.userId}</span></p>
                        <p className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${ticket.status === 'Resolved' ? 'text-emerald-400' : 'text-amber-400'}`}>
                           <Clock className="w-3.5 h-3.5" /> {ticket.status.toUpperCase()}
                        </p>
                     </div>
                  </div>
                  <div className="flex flex-col gap-3 min-w-[180px]">
                    {ticket.status !== 'Resolved' ? (
                      <button 
                        onClick={() => onResolveTicket(ticket.id)} 
                        className="w-full px-10 py-5 bg-cyan-400 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-lg shadow-cyan-400/10 flex items-center justify-center gap-3 italic"
                      >
                         <ShieldCheck className="w-4 h-4" /> SOLVE_TICKET
                      </button>
                    ) : (
                      <div className="w-full px-10 py-5 bg-emerald-500/10 text-emerald-400 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 flex items-center justify-center gap-3 italic">
                         <Check className="w-4 h-4" /> AUTHORIZED_RESOLVED
                      </div>
                    )}
                  </div>
               </div>
             )) : (
               <div className="py-32 text-center space-y-6 glass-panel rounded-[4rem] border-dashed border-white/5">
                  <Globe className="w-16 h-16 text-slate-700 mx-auto" />
                  <p className="text-slate-500 font-black uppercase tracking-[0.5em] italic">Neural support link idle. No tickets in queue.</p>
               </div>
             )}
           </div>
        </div>
      )}

      {activeTab === 'finance' && (
        <div className="glass-panel rounded-[3rem] border-white/5 overflow-hidden shadow-2xl bg-slate-800/20 animate-in slide-in-from-bottom-6 duration-500">
           <div className="p-10 border-b border-white/5 flex justify-between items-center bg-slate-800/40">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic">Fiscal Authority & Ledger Audit</h4>
              <div className="px-5 py-2 bg-cyan-400/10 border border-cyan-400/20 rounded-full text-[9px] font-black text-cyan-400 uppercase tracking-widest italic">Encrypted Registry Link</div>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] bg-slate-900/50 italic">
                    <th className="px-10 py-8">Registered Identity</th>
                    <th className="px-10 py-8">Payload</th>
                    <th className="px-10 py-8">Hash ID</th>
                    <th className="px-10 py-8">Target Rank</th>
                    <th className="px-10 py-8 text-right">Sequence</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-bold divide-y divide-white/5 italic">
                  {transactions.map(txn => (
                    <tr key={txn.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="px-10 py-8">
                         <div className="flex items-center gap-5">
                            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center shadow-inner">
                               <Mail className="w-5 h-5 text-violet-400" />
                            </div>
                            <div>
                               <p className="text-slate-100 uppercase tracking-tighter mb-1 leading-none">{txn.userName}</p>
                               <p className="text-[9px] text-cyan-400 font-mono tracking-widest font-black uppercase">{txn.userId}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-10 py-8 text-white font-black text-xl">₹{txn.amount}</td>
                      <td className="px-10 py-8">
                         <div className="flex items-center gap-2">
                            <Hash className="w-3.5 h-3.5 text-slate-700" />
                            <span className="font-mono text-[10px] text-slate-500 tracking-widest font-black">{txn.txnId}</span>
                         </div>
                      </td>
                      <td className="px-10 py-8">
                         <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border ${txn.planRequested === 'legend' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : 'text-cyan-400 border-cyan-400/20 bg-cyan-400/5'}`}>
                            {txn.planRequested}
                         </span>
                      </td>
                      <td className="px-10 py-8 text-right">
                         {txn.status === 'Pending' ? (
                           <div className="flex justify-end gap-3">
                              <button onClick={() => onApproveTxn(txn.id)} className="w-12 h-12 rounded-2xl bg-cyan-400 text-slate-900 hover:scale-110 transition-transform flex items-center justify-center shadow-lg shadow-cyan-400/20">
                                 <Check className="w-6 h-6" />
                              </button>
                              <button onClick={() => onRejectTxn(txn.id)} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-red-400 hover:bg-red-400 hover:text-white transition-all flex items-center justify-center">
                                 <X className="w-6 h-6" />
                              </button>
                           </div>
                         ) : (
                           <span className={`text-[10px] font-black uppercase tracking-widest ${txn.status === 'Approved' ? 'text-emerald-400' : 'text-red-400'}`}>{txn.status}</span>
                         )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="glass-panel p-20 rounded-[4rem] border-white/5 space-y-12 shadow-2xl relative overflow-hidden bg-slate-800/10 animate-in slide-in-from-bottom-6 duration-500">
           <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-40" />
           <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-violet-500/10 border border-violet-500/30 rounded-[2.5rem] flex items-center justify-center mx-auto mb-4">
                 <Database className="w-10 h-10 text-cyan-400" />
              </div>
              <h4 className="text-4xl font-black text-white italic uppercase tracking-tighter flex items-center justify-center gap-6">
                 NODE_REGISTRY_MODULATION
              </h4>
              <p className="text-slate-500 font-bold uppercase tracking-[0.5em] text-[11px] italic">Global Rank Allocation Override Protocol</p>
           </div>
           
           <div className="max-w-3xl mx-auto space-y-12 bg-slate-900/40 p-12 rounded-[3.5rem] border border-white/5 shadow-inner">
              <div className="space-y-5">
                 <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-6 italic">Target User Identity (Email)</label>
                 <div className="relative">
                    <Mail className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-700" />
                    <input 
                        value={searchEmail}
                        onChange={(e) => setSearchEmail(e.target.value)}
                        placeholder="ENTER_NEURAL_SIGNATURE@DOMAIN.COM..."
                        className="w-full bg-slate-950 border border-white/10 rounded-3xl pl-20 pr-10 py-6 text-slate-100 focus:ring-2 focus:ring-cyan-400/30 outline-none transition-all font-black text-sm uppercase tracking-widest italic"
                    />
                 </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                 <button 
                   onClick={() => setManualPlan('pro')}
                   className={`p-10 rounded-[2.5rem] font-black uppercase text-[11px] tracking-widest transition-all border italic flex flex-col items-center gap-5 shadow-inner ${manualPlan === 'pro' ? 'bg-cyan-400 border-cyan-400 text-slate-900 shadow-xl' : 'bg-slate-800/30 border-white/5 text-slate-600 hover:text-white hover:bg-white/5'}`}
                 >
                   <Star className={`w-10 h-10 ${manualPlan === 'pro' ? 'text-slate-900' : 'text-slate-800'}`} />
                   ALLOCATE PRO_RANK
                 </button>
                 <button 
                   onClick={() => setManualPlan('legend')}
                   className={`p-10 rounded-[2.5rem] font-black uppercase text-[11px] tracking-widest transition-all border italic flex flex-col items-center gap-5 shadow-inner ${manualPlan === 'legend' ? 'bg-violet-600 border-violet-600 text-white shadow-xl' : 'bg-slate-800/30 border-white/5 text-slate-600 hover:text-white hover:bg-white/5'}`}
                 >
                   <Crown className={`w-10 h-10 ${manualPlan === 'legend' ? 'text-cyan-400' : 'text-slate-800'}`} />
                   ALLOCATE LEGEND_CORE
                 </button>
              </div>

              <button 
                onClick={() => onManualUpgrade(searchEmail, manualPlan)}
                disabled={!searchEmail}
                className="w-full bg-white text-slate-900 font-black py-8 rounded-[2.5rem] transition-all shadow-2xl flex items-center justify-center gap-8 uppercase text-sm tracking-[0.6em] hover:bg-cyan-400 hover:text-slate-900 disabled:opacity-20 italic group"
              >
                EXECUTE DATABASE_MOD <ShieldCheck className="w-7 h-7 group-hover:rotate-12 transition-transform" />
              </button>
           </div>
        </div>
      )}

      {activeTab === 'monitor' && (
        <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-500">
           <section className="glass-panel p-20 rounded-[4.5rem] border-white/5 relative overflow-hidden group shadow-2xl bg-slate-800/10">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-500/5 blur-[120px] -translate-y-32 translate-x-32" />
              <div className="relative z-10">
                 <h4 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-16 flex items-center gap-6">
                    <Globe className="w-10 h-10 text-cyan-400" /> DIRECT_LAB_OVERRIDE
                 </h4>
                 <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
                    {[
                      { icon: Code2, label: 'Plugin', color: 'text-cyan-400', tool: ToolType.CODE_GEN },
                      { icon: Box, label: 'Mod', color: 'text-violet-400', tool: ToolType.MOD_GEN },
                      { icon: Palette, label: 'Texture', color: 'text-emerald-400', tool: ToolType.RESOURCE_PACK },
                      { icon: ScrollText, label: 'Skript', color: 'text-amber-400', tool: ToolType.SKRIPT },
                      { icon: Bot, label: 'Bot', color: 'text-indigo-400', tool: ToolType.DISCORD_BOT }
                    ].map(item => (
                      <button 
                        key={item.label} 
                        onClick={() => onNavigateToTool(item.tool)}
                        className="flex flex-col items-center gap-6 p-10 rounded-[3rem] bg-slate-800/40 border border-white/5 hover:border-cyan-400/50 transition-all group/tool shadow-inner"
                      >
                         <div className={`p-6 rounded-2xl bg-white/5 ${item.color} group-hover/tool:scale-125 transition-transform duration-500`}>
                            <item.icon className="w-10 h-10" />
                         </div>
                         <span className="text-[11px] font-black uppercase text-slate-500 group-hover/tool:text-cyan-400 tracking-[0.3em] italic">Deploy::{item.label}</span>
                      </button>
                    ))}
                 </div>
              </div>
           </section>
        </div>
      )}
    </div>
  );
};

export default ModeratorPanel;
