import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Code2, 
  Stethoscope, 
  UserCircle, 
  MessageSquare, 
  Bot,
  Box,
  Palette,
  LogOut,
  Zap,
  Globe,
  ScrollText,
  LifeBuoy,
  CreditCard,
  ShieldCheck,
  Lock,
  Cpu,
  Terminal,
  Activity,
  Send,
  Sparkles,
  ChevronUp,
  X,
  BrainCircuit,
  MinusCircle
} from 'lucide-react';
import { ToolType, UserProfile } from '../types';
import { askAssistant } from '../services/gemini';

interface LayoutProps {
  children: React.ReactNode;
  activeTool: ToolType;
  setActiveTool: (tool: ToolType) => void;
  user: UserProfile | null;
  onLogin: () => void;
  onLogout: () => void;
  notificationsCount?: number;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTool, setActiveTool, user, onLogin, onLogout, notificationsCount }) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', text: string }[]>([
    { role: 'assistant', text: 'Radiant Uplink established. I am your engineering architect. High-fidelity results initialized.' }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages, chatOpen]);

  const handleSendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await askAssistant(userMsg, messages);
      setMessages(prev => [...prev, { role: 'assistant', text: response || 'Neural sync deviation detected.' }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Radiant Link Severed. Re-initializing...' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const primaryLabs = [
    { id: ToolType.DASHBOARD, label: 'Control Center', icon: LayoutDashboard },
    { id: ToolType.CODE_GEN, label: 'Plugin Forge', icon: Code2 },
    { id: ToolType.SKRIPT, label: 'Skript Studio', icon: ScrollText },
    { id: ToolType.MOD_GEN, label: 'Mod Fabricator', icon: Box },
    { id: ToolType.MOTD_GEN, label: 'MOTD GEND LAB', icon: MessageSquare },
    { id: ToolType.SKIN_GEN, label: 'Skin Visualizer', icon: UserCircle },
    { id: ToolType.RESOURCE_PACK, label: 'Texture Core', icon: Palette },
    { id: ToolType.DISCORD_BOT, label: 'Bot Construct', icon: Bot },
  ];

  const maintenanceTools = [
    { id: ToolType.CRASH_DIAGNOSIS, label: 'System Recovery', icon: Stethoscope },
  ];

  const adminOperations = user?.isModerator ? [
    { id: ToolType.MODERATOR, label: 'Overlord Panel', icon: ShieldCheck },
  ] : [];

  const renderSection = (items: {id: ToolType, label: string, icon: any}[], title: string, accentColor: string = "#00E5FF") => (
    <div className="space-y-1.5 animate-in fade-in slide-in-from-left-4 duration-500">
      <p className="px-6 text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
         <div className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: accentColor, color: accentColor }} /> {title}
      </p>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTool(item.id)}
          className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
            activeTool === item.id 
              ? 'bg-azure-500/10 text-[#00E5FF] border border-azure-500/20' 
              : 'text-slate-500 hover:bg-white/5 hover:text-white'
          }`}
        >
          <item.icon className={`w-5 h-5 transition-colors ${activeTool === item.id ? 'text-[#00E5FF]' : 'group-hover:text-[#FFD700]'}`} />
          <span className="font-bold text-[11px] uppercase tracking-[0.2em] italic transition-all group-hover:translate-x-1">{item.label}</span>
          {activeTool === item.id && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#00E5FF] rounded-r-full shadow-[0_0_15px_#00E5FF]"></div>
          )}
        </button>
      ))}
    </div>
  );

  return (
    <div className="flex h-screen bg-transparent overflow-hidden">
      <aside className="w-72 bg-slate-950/80 backdrop-blur-3xl border-r border-white/5 flex flex-col z-30 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#00E5FF] via-[#FFD700] to-[#00E5FF]"></div>
        
        <div className="p-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-azure-500/10 border border-azure-400/20 flex items-center justify-center shadow-[0_0_40px_rgba(0,229,255,0.1)] group cursor-pointer" onClick={() => user && setActiveTool(ToolType.DASHBOARD)}>
            <Sparkles className="text-[#FFD700] w-7 h-7 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <h1 className="font-black text-2xl tracking-tighter text-white leading-none italic">RADIANT</h1>
            <p className="text-[9px] font-black tracking-[0.4em] text-[#00E5FF] uppercase mt-1.5">SOLAR SYSTEM</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-10 overflow-y-auto sidebar-hide-scroll">
          {user ? (
            <>
              {user.isModerator && renderSection(adminOperations, 'SYSTEM_AUTHORITY', '#FFD700')}
              {renderSection(primaryLabs, 'LABS_AND_STUDIOS')}
              {renderSection(maintenanceTools, 'MAINTENANCE')}
              {renderSection([
                { id: ToolType.BILLING, label: 'Access Tiers', icon: CreditCard },
                { id: ToolType.SUPPORT, label: 'Human Relay', icon: LifeBuoy }
              ], 'AUTHORIZATION')}
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 space-y-6 text-center">
               <div className="w-20 h-20 rounded-full bg-slate-900 border border-dashed border-slate-800 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-slate-700" />
               </div>
               <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Node Locked.</p>
            </div>
          )}
        </nav>

        <div className="p-6 border-t border-white/5 bg-slate-950/60">
          {user ? (
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900 border border-white/5">
              <img src={user.photo} className="w-10 h-10 rounded-xl border border-[#00E5FF]/40 shadow-lg" alt="Avatar" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-white truncate uppercase italic">{user.name}</p>
                <p className="text-[8px] font-black uppercase text-[#FFD700]">{user.plan.toUpperCase()}</p>
              </div>
              <button onClick={onLogout} className="p-2 text-slate-600 hover:text-red-400"><LogOut className="w-5 h-5" /></button>
            </div>
          ) : (
            <button onClick={onLogin} className="w-full flex items-center justify-center gap-4 bg-white text-black font-black py-5 rounded-2xl hover:bg-[#00E5FF] transition-all text-[11px] uppercase tracking-[0.3em] italic">
              Sync Session
            </button>
          )}
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative bg-transparent">
        <header className="sticky top-0 z-20 bg-slate-950/60 backdrop-blur-3xl border-b border-white/5 px-12 py-7 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_10px_#00E5FF] animate-pulse"></div>
            <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] italic">
              NODE::{activeTool.replace('_', ' ')}
            </h2>
          </div>
          <div className="flex items-center gap-6">
             <button onClick={() => setChatOpen(!chatOpen)} className="flex items-center gap-3 px-6 py-2.5 bg-azure-500/10 border border-azure-400/20 rounded-2xl text-[10px] font-black text-[#00E5FF] uppercase tracking-widest italic hover:bg-white/5 transition-all">
                <Bot className="w-5 h-5" /> RADIANT_ASSISTANT
             </button>
             <div className="px-5 py-2.5 bg-slate-900 rounded-2xl border border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-3 italic">
              <Activity className="w-4 h-4 text-[#FFD700]" /> OPTIMAL
            </div>
          </div>
        </header>

        <div className="p-16 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {chatOpen && (
        <div className="fixed bottom-10 right-10 w-[450px] h-[680px] glass-panel rounded-[3.5rem] border-[#00E5FF]/20 flex flex-col z-[1000] animate-in slide-in-from-bottom-12 duration-500 bg-slate-950">
           <div className="p-10 border-b border-white/5 flex items-center justify-between bg-slate-900/40 rounded-t-[3.5rem]">
              <div className="flex items-center gap-5">
                 <div className="w-14 h-14 bg-azure-500/10 border border-azure-400/20 rounded-[1.5rem] flex items-center justify-center shadow-inner">
                    <BrainCircuit className="w-7 h-7 text-[#FFD700]" />
                 </div>
                 <div>
                    <h4 className="text-[16px] font-black text-white italic uppercase tracking-tighter leading-none">NEURAL LINK</h4>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic mt-1.5">Radiant System Architect</p>
                 </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="p-3 text-slate-600 hover:text-white transition-all bg-white/5 rounded-2xl hover:bg-red-500/10"><X className="w-7 h-7" /></button>
           </div>

           <div className="flex-1 overflow-y-auto p-10 space-y-8 sidebar-hide-scroll bg-[#030712]/50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[85%] p-7 rounded-[2.5rem] text-[13px] font-bold italic leading-relaxed ${msg.role === 'user' ? 'bg-azure-500/10 border border-azure-400/20 text-azure-100 rounded-tr-none' : 'bg-slate-900 border border-white/5 text-slate-400 rounded-tl-none shadow-xl'}`}>
                      {msg.text}
                   </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                   <div className="bg-slate-900 border border-white/5 p-7 rounded-[2.5rem] rounded-tl-none flex gap-2">
                      <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                   </div>
                </div>
              )}
              <div ref={chatEndRef} />
           </div>

           <div className="p-10 border-t border-white/5 bg-slate-900/80 rounded-b-[3.5rem] space-y-4">
              <div className="relative">
                 <input 
                   value={chatInput}
                   onChange={(e) => setChatInput(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                   placeholder="PEAK_QUERY_INPUT..."
                   className="w-full bg-slate-950 border border-white/10 rounded-2xl pl-8 pr-16 py-6 text-white outline-none focus:ring-1 focus:ring-[#00E5FF]/40 font-bold text-xs uppercase italic"
                 />
                 <button onClick={handleSendChat} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white text-slate-950 rounded-xl flex items-center justify-center hover:bg-[#00E5FF] transition-all"><Send className="w-6 h-6" /></button>
              </div>
              <button onClick={() => setChatOpen(false)} className="w-full py-4 text-slate-600 hover:text-red-400 font-black text-[9px] uppercase tracking-[0.3em] italic">DISCONNECT_NEURAL_LINK</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
