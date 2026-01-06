import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import CodeGenerator from './components/CodeGenerator';
import CrashAnalyzer from './components/CrashAnalyzer';
import SkinGen from './components/SkinGen';
import MOTDGen from './components/MOTDGen';
import SupportTickets from './components/SupportTickets';
import Billing from './components/Billing';
import ModeratorPanel from './components/ModeratorPanel';
import { ToolType, UserProfile, SupportTicket, PaymentTransaction, UserPlan } from './types';
import { 
  Zap, 
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  Code2,
  Box,
  ScrollText,
  Palette,
  Bot,
  Stethoscope,
  Trophy,
  PartyPopper,
  X,
  Key,
  Copy,
  CheckCircle2,
  AlertTriangle,
  RefreshCcw,
  Info,
  Monitor,
  Video,
  Clapperboard,
  UserCircle,
  MessageSquare
} from 'lucide-react';

const ADMIN_EMAIL = "samarpanbera04@gmail.com";
const ADMIN_PASS = "1978S1983B";

const Toast: React.FC<{ message: string, type: 'success' | 'error' | 'info', onClose: () => void }> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    error: <AlertTriangle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-cyan-400" />
  };

  const colors = {
    success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-50',
    error: 'border-red-500/30 bg-red-500/10 text-red-50',
    info: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-50'
  };

  return (
    <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[5000] flex items-center gap-4 px-8 py-5 rounded-2xl border backdrop-blur-3xl shadow-2xl animate-in slide-in-from-bottom-10 duration-500 ${colors[type]}`}>
      {icons[type]}
      <span className="text-[11px] font-black uppercase tracking-widest italic">{message}</span>
      <button onClick={onClose} className="ml-4 hover:opacity-50 transition-opacity"><X className="w-4 h-4" /></button>
    </div>
  );
};

const AuthModal: React.FC<{ 
  onLoginSuccess: (user: UserProfile) => void;
  onClose: () => void;
  showFeedback: (msg: string, type: 'success' | 'error' | 'info') => void;
}> = ({ onLoginSuccess, onClose, showFeedback }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'recovery'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  const getStoredUsers = (): any[] => {
    const users = localStorage.getItem('ug_users_db');
    return users ? JSON.parse(users) : [];
  };

  const generateRecoveryKey = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      const users = getStoredUsers();

      if (mode === 'signup') {
        if (users.find((u: any) => u.email === email)) {
          showFeedback("SIGNATURE ALREADY REGISTERED.", "error");
          setLoading(false);
          return;
        }
        const newKey = generateRecoveryKey();
        const newUser = {
          email,
          password,
          name,
          recoveryCode: newKey,
          plan: email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'legend' : 'budget',
          isModerator: email.toLowerCase() === ADMIN_EMAIL.toLowerCase(),
          joinedAt: Date.now(),
          usageStats: {}
        };
        users.push(newUser);
        localStorage.setItem('ug_users_db', JSON.stringify(users));
        setGeneratedKey(newKey);
        showFeedback("NEURAL SIGNATURE CONSTRUCTED.", "success");
      } else if (mode === 'login') {
        const found = users.find((u: any) => u.email === email && u.password === password);
        
        if (!found && email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASS) {
          const adminUser: UserProfile = {
            name: "Samarpan Bera",
            email: ADMIN_EMAIL,
            photo: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${ADMIN_EMAIL}`,
            isPremium: true,
            plan: 'legend',
            isModerator: true,
            joinedAt: Date.now(),
            recoveryCode: "ADMIN_BYPASS",
            usageStats: {}
          };
          onLoginSuccess(adminUser);
          showFeedback("OVERLORD ACCESS GRANTED.", "success");
          return;
        }

        if (found) {
          const profile: UserProfile = {
            name: found.name,
            email: found.email,
            photo: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${email}`,
            isPremium: found.plan !== 'budget',
            plan: found.plan,
            isModerator: found.isModerator,
            joinedAt: found.joinedAt,
            recoveryCode: found.recoveryCode,
            usageStats: found.usageStats || {}
          };
          onLoginSuccess(profile);
          showFeedback("SESSION SYNCHRONIZED.", "success");
        } else {
          showFeedback("INVALID CREDENTIALS. NODE REJECTED.", "error");
        }
      } else if (mode === 'recovery') {
        const found = users.find((u: any) => u.email === email && u.recoveryCode === recoveryCode);
        if (found) {
          showFeedback(`KEY VERIFIED. YOUR PASSWORD IS: ${found.password}`, "info");
          setMode('login');
        } else {
          showFeedback("RECOVERY KEY INVALID.", "error");
        }
      }
      setLoading(false);
    }, 1000);
  };

  if (generatedKey) {
    return (
      <div className="fixed inset-0 z-[1000] bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-6">
        <div className="glass-panel w-full max-w-md p-16 rounded-[4rem] border-cyan-400/30 text-center space-y-10 animate-in zoom-in-95 duration-500 shadow-[0_0_150px_rgba(34,211,238,0.2)] relative">
           <button onClick={onClose} className="absolute top-10 right-10 text-slate-600 hover:text-red-400 transition-all">
              <X className="w-8 h-8" />
           </button>
           <div className="w-24 h-24 bg-cyan-400/10 rounded-[2.5rem] border border-cyan-400/30 flex items-center justify-center mx-auto shadow-inner">
              <Key className="w-12 h-12 text-cyan-400" />
           </div>
           <div className="space-y-4">
              <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">RECOVERY KEY</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] italic">Store this in a secure vault.</p>
           </div>
           <div className="p-8 bg-slate-950 rounded-3xl border border-white/5 font-mono text-4xl font-black text-cyan-400 tracking-[0.3em] flex items-center justify-center gap-6 group cursor-pointer" onClick={() => { navigator.clipboard.writeText(generatedKey); showFeedback("KEY COPIED TO CLIPBOARD.", "info"); }}>
              {generatedKey}
              <Copy className="w-6 h-6 text-slate-800 group-hover:text-cyan-400 transition-colors" />
           </div>
           <button onClick={() => setMode('login')} className="w-full bg-white text-slate-900 font-black py-6 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-4 uppercase text-[11px] tracking-[0.4em] hover:bg-cyan-400 transition-all italic">
              Key Authorized & Saved
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="glass-panel w-full max-w-[480px] p-16 rounded-[4rem] border-violet-500/30 flex flex-col min-h-[620px] relative shadow-[0_0_120px_rgba(139,92,246,0.15)] overflow-hidden bg-slate-900/40">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-cyan-400 to-violet-500"></div>
        
        <button onClick={onClose} className="absolute top-10 right-10 text-slate-600 hover:text-cyan-400 transition-all p-2 rounded-full hover:bg-white/5">
          <X className="w-8 h-8" />
        </button>

        <div className="flex flex-col items-center mb-12">
          <div className="w-20 h-20 bg-violet-600/10 rounded-[2rem] flex items-center justify-center mb-8 border border-violet-500/20 shadow-inner">
             <Zap className="text-cyan-400 w-10 h-10 fill-cyan-400/10" />
          </div>
          <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-2">
            {mode === 'login' ? 'INITIALIZE' : (mode === 'signup' ? 'CONSTRUCT' : 'RECOVERY')}
          </h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em] italic">
            {mode === 'login' ? 'Sync session node' : (mode === 'signup' ? 'Deploy neural signature' : 'Enter recovery signature')}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6 flex-1">
          {mode === 'signup' && (
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-6 italic">Architect Alias</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="NEURAL_IDENTITY"
                className="w-full px-8 py-5 bg-slate-950/60 border border-white/5 rounded-2xl focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all text-[11px] font-black uppercase tracking-widest text-slate-100 placeholder:text-slate-800 italic"
                required
              />
            </div>
          )}
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-6 italic">Secure Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="IDENTITY@NODE.SYSTEM"
              className="w-full px-8 py-5 bg-slate-950/60 border border-white/5 rounded-2xl focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all text-[11px] font-black uppercase tracking-widest text-slate-100 placeholder:text-slate-800 italic"
              required
            />
          </div>
          {mode === 'recovery' ? (
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-6 italic">Neural Recovery Key</label>
              <input 
                type="text" 
                value={recoveryCode}
                onChange={(e) => setRecoveryCode(e.target.value.toUpperCase())}
                placeholder="6-DIGIT KEY"
                maxLength={6}
                className="w-full px-8 py-5 bg-slate-950/60 border border-white/5 rounded-2xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all text-xl font-black uppercase tracking-[0.5em] text-cyan-400 placeholder:text-slate-800 text-center italic"
                required
              />
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-6 italic">Security Sequence</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="ENCRYPTED_PASS"
                  className="w-full px-8 py-5 bg-slate-950/60 border border-white/5 rounded-2xl focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all text-[11px] font-black uppercase tracking-widest text-slate-100 pr-16 placeholder:text-slate-800 italic"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 hover:text-cyan-400">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}

          <div className="pt-8 flex flex-col gap-5">
            <button disabled={loading} type="submit" className="w-full bg-white text-slate-900 font-black py-6 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-4 uppercase text-[11px] tracking-[0.4em] hover:bg-cyan-400 hover:text-slate-900 transform hover:-translate-y-1 active:scale-95 italic">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (mode === 'login' ? <LogIn className="w-5 h-5" /> : (mode === 'signup' ? <UserPlus className="w-5 h-5" /> : <RefreshCcw className="w-5 h-5" />))}
              {mode === 'login' ? 'Initialize Link' : (mode === 'signup' ? 'Construct Node' : 'Recover Signature')}
            </button>
            <div className="flex flex-col gap-2">
              <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-slate-500 font-black text-[9px] uppercase tracking-[0.3em] hover:text-cyan-400 transition-colors py-2 italic">
                {mode === 'login' ? 'No session signature? Construct Node' : 'Existing signature? Initialize Link'}
              </button>
              {mode === 'login' && (
                <button type="button" onClick={() => setMode('recovery')} className="text-slate-600 font-black text-[9px] uppercase tracking-[0.3em] hover:text-violet-400 transition-colors italic">
                  Lost security key? Attempt Recovery
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>(ToolType.DASHBOARD);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [rankUpAnim, setRankUpAnim] = useState<UserPlan | null>(null);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);

  const showFeedback = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('ug_active_session');
    const savedTickets = localStorage.getItem('ug_global_tickets');
    const savedTxns = localStorage.getItem('ug_global_txns');
    
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      const dbUsers = JSON.parse(localStorage.getItem('ug_users_db') || '[]');
      const dbUser = dbUsers.find((u: any) => u.email === parsed.email);
      if (dbUser) {
        if (parsed.plan === 'budget' && dbUser.plan !== 'budget') {
            setRankUpAnim(dbUser.plan);
        }
        setUser({ ...parsed, plan: dbUser.plan, isPremium: dbUser.plan !== 'budget', usageStats: dbUser.usageStats || {} });
      } else {
        setUser(parsed);
      }
    }
    if (savedTickets) setTickets(JSON.parse(savedTickets));
    if (savedTxns) setTransactions(JSON.parse(savedTxns));
  }, []);

  useEffect(() => {
    localStorage.setItem('ug_global_tickets', JSON.stringify(tickets));
    localStorage.setItem('ug_global_txns', JSON.stringify(transactions));
  }, [tickets, transactions]);

  const handleLoginSuccess = (profile: UserProfile) => {
    setUser(profile);
    localStorage.setItem('ug_active_session', JSON.stringify(profile));
    setShowAuthModal(false);
    if (profile.isModerator) setActiveTool(ToolType.MODERATOR);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('ug_active_session');
    setActiveTool(ToolType.DASHBOARD);
    showFeedback("SESSION DISCONNECTED.", "info");
  };

  const handleApproveTxn = (id: string) => {
    const txn = transactions.find(t => t.id === id);
    if (!txn) return;

    const txns = transactions.map(t => t.id === id ? {...t, status: 'Approved' as const} : t);
    setTransactions(txns);
    
    const dbUsers = JSON.parse(localStorage.getItem('ug_users_db') || '[]');
    const updatedUsers = dbUsers.map((u: any) => u.email === txn.userId ? {...u, plan: txn.planRequested} : u);
    localStorage.setItem('ug_users_db', JSON.stringify(updatedUsers));
    
    if (user && user.email === txn.userId) {
      const updated = { ...user, plan: txn.planRequested, isPremium: true };
      setUser(updated);
      localStorage.setItem('ug_active_session', JSON.stringify(updated));
      setRankUpAnim(txn.planRequested);
    }
    showFeedback("AUTHORIZED: RANK UPGRADED.", "success");
  };

  const handleManualUpgrade = (email: string, targetPlan: UserPlan) => {
    const dbUsers = JSON.parse(localStorage.getItem('ug_users_db') || '[]');
    const updatedUsers = dbUsers.map((u: any) => u.email === email ? {...u, plan: targetPlan} : u);
    localStorage.setItem('ug_users_db', JSON.stringify(updatedUsers));
    
    if (user && user.email === email) {
      const updated = { ...user, plan: targetPlan, isPremium: true };
      setUser(updated);
      localStorage.setItem('ug_active_session', JSON.stringify(updated));
      setRankUpAnim(targetPlan);
    }
    showFeedback(`RANK ${targetPlan.toUpperCase()} DEPLOYED TO ${email}`, "success");
  };

  const updateUsage = (tool: ToolType) => {
    if (!user) return true;
    if (user.plan === 'legend') return true;
    
    const stats = user.usageStats || {};
    const current = stats[tool] || 0;
    
    const limit = user.plan === 'pro' ? 20 : 5;
    if (current >= limit) {
      showFeedback(`${user.plan.toUpperCase()} LAB LIMIT REACHED.`, "error");
      return false;
    }

    const newStats = { ...stats, [tool]: current + 1 };
    const updatedUser = { ...user, usageStats: newStats };
    setUser(updatedUser);
    localStorage.setItem('ug_active_session', JSON.stringify(updatedUser));
    
    const dbUsers = JSON.parse(localStorage.getItem('ug_users_db') || '[]');
    const updatedDb = dbUsers.map((u: any) => u.email === user.email ? { ...u, usageStats: newStats } : u);
    localStorage.setItem('ug_users_db', JSON.stringify(updatedDb));
    
    return true;
  };

  const renderTool = () => {
    if (!user) return <div className="flex flex-col items-center justify-center min-h-[70vh] gap-12 text-center animate-in fade-in zoom-in duration-1000">
      <div className="w-32 h-32 bg-violet-600/10 rounded-[3rem] flex items-center justify-center border border-violet-500/30 shadow-[0_0_80px_rgba(139,92,246,0.2)]">
         <Zap className="text-cyan-400 w-16 h-16 fill-cyan-400/20" />
      </div>
      <div className="space-y-4">
        <h1 className="text-8xl font-black text-white italic uppercase tracking-tighter leading-none">RADIANT<br/><span className="text-[#00E5FF]">SYSTEM</span></h1>
        <p className="text-slate-600 font-black text-[11px] uppercase tracking-[1em] italic">The Premier Architecture Suite</p>
      </div>
      <button 
        onClick={() => setShowAuthModal(true)} 
        className="bg-white text-slate-900 px-20 py-7 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.5em] hover:bg-cyan-400 transition-all shadow-2xl active:scale-95 italic transform hover:-translate-y-2"
      >
        Initialize Session
      </button>
    </div>;

    switch (activeTool) {
      case ToolType.DASHBOARD:
        return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-40 animate-in fade-in slide-in-from-bottom-10 duration-700">
          {[
            { type: ToolType.CODE_GEN, label: 'Plugin Gen', icon: Code2, color: 'text-cyan-400' },
            { type: ToolType.MOD_GEN, label: 'Mod Fabricator', icon: Box, color: 'text-violet-400' },
            { type: ToolType.MOTD_GEN, label: 'MOTD Lab', icon: MessageSquare, color: 'text-[#FFD700]' },
            { type: ToolType.SKIN_GEN, label: 'Skin Visualizer', icon: UserCircle, color: 'text-emerald-400' },
            { type: ToolType.SKRIPT, label: 'Skript Studio', icon: ScrollText, color: 'text-amber-400' },
            { type: ToolType.RESOURCE_PACK, label: 'Texture Core', icon: Palette, color: 'text-azure-400' },
            { type: ToolType.DISCORD_BOT, label: 'Bot Construct', icon: Bot, color: 'text-indigo-400' },
            { type: ToolType.CRASH_DIAGNOSIS, label: 'AI Diagnosis', icon: Stethoscope, color: 'text-red-400' },
          ].map(tool => (
            <button key={tool.label} onClick={() => setActiveTool(tool.type)} className="glass-panel p-12 rounded-[3.5rem] transition-all group text-left relative overflow-hidden border-white/5 shadow-2xl hover:border-violet-500/40 hover:translate-y-[-4px]">
               <div className={`p-5 rounded-[1.5rem] bg-white/5 border border-white/10 ${tool.color} mb-8 inline-block group-hover:scale-110 transition-transform duration-500 shadow-xl`}>
                  <tool.icon className="w-10 h-10" />
               </div>
               <h4 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-3 leading-none">
                 {tool.label}
               </h4>
               <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] italic">RADIANT GEN Node</p>
               <div className="absolute -right-8 -bottom-8 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
                  <tool.icon className="w-32 h-32" />
               </div>
            </button>
          ))}
        </div>;
      case ToolType.CODE_GEN:
      case ToolType.MOD_GEN:
      case ToolType.SKRIPT:
      case ToolType.RESOURCE_PACK:
      case ToolType.DISCORD_BOT:
        return <CodeGenerator type={activeTool} user={user} onUsed={() => updateUsage(activeTool)} onNavigateToBilling={() => setActiveTool(ToolType.BILLING)} />;
      case ToolType.CRASH_DIAGNOSIS:
        return <CrashAnalyzer />;
      case ToolType.SKIN_GEN:
        return <SkinGen user={user} />;
      case ToolType.MOTD_GEN:
        return <MOTDGen user={user} />;
      case ToolType.SUPPORT:
        return <SupportTickets user={user} tickets={tickets} onAddTicket={(t) => { setTickets([t, ...tickets]); showFeedback("TICKET DEPLOYED.", "success"); }} />;
      case ToolType.BILLING:
        return <Billing user={user} onUpgrade={(txnId, plan) => {
          const newTxn: PaymentTransaction = {
            id: crypto.randomUUID(),
            userId: user.email,
            userName: user.name,
            txnId,
            amount: plan === 'pro' ? '199' : '299',
            planRequested: plan,
            status: 'Pending',
            timestamp: Date.now()
          };
          setTransactions([newTxn, ...transactions]);
          showFeedback("PAYMENT SYNCED. AWAITING VERIFICATION.", "info");
        }} />;
      case ToolType.MODERATOR:
        return user.isModerator ? (
          <ModeratorPanel 
            tickets={tickets} 
            transactions={transactions} 
            onApproveTxn={handleApproveTxn}
            onRejectTxn={(id) => { setTransactions(transactions.map(t => t.id === id ? {...t, status: 'Rejected'} : t)); showFeedback("TRANSACTION REJECTED.", "info"); }}
            onResolveTicket={(id) => { setTickets(tickets.map(t => t.id === id ? {...t, status: 'Resolved'} : t)); showFeedback("TICKET RESOLVED.", "success"); }}
            onNavigateToTool={setActiveTool}
            onManualUpgrade={handleManualUpgrade}
          />
        ) : <div className="flex items-center justify-center min-h-[70vh]"><Lock className="w-20 h-20 text-slate-800" /></div>;
      default:
        return null;
    }
  };

  return (
    <Layout 
      activeTool={activeTool} 
      setActiveTool={setActiveTool} 
      user={user} 
      onLogin={() => setShowAuthModal(true)} 
      onLogout={handleLogout}
      notificationsCount={user?.isModerator ? (tickets.filter(t => t.status === 'Open').length + transactions.filter(t => t.status === 'Pending').length) : 0}
    >
      <div className="w-full">
        {renderTool()}
      </div>

      {showAuthModal && <AuthModal onLoginSuccess={handleLoginSuccess} onClose={() => setShowAuthModal(false)} showFeedback={showFeedback} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {rankUpAnim && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-950/95 animate-in fade-in duration-700 backdrop-blur-3xl" onClick={() => setRankUpAnim(null)}>
           <div className="text-center space-y-10 animate-in zoom-in duration-500">
              <div className="w-40 h-40 bg-violet-600/20 rounded-[3rem] flex items-center justify-center mx-auto border-2 border-cyan-400 shadow-[0_0_150px_rgba(34,211,238,0.3)]">
                 <Trophy className="w-20 h-20 text-cyan-400" />
              </div>
              <div className="space-y-6">
                 <h2 className="text-8xl font-black text-white italic uppercase tracking-tighter flex items-center justify-center gap-10 leading-none">
                    RANK UP
                 </h2>
                 <p className="text-cyan-400 font-black text-3xl uppercase tracking-[0.4em] italic">NODE_STATUS: {rankUpAnim.toUpperCase()}_DEPLOYED</p>
                 <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-sm max-w-lg mx-auto leading-relaxed italic">Your neural signature has been elevated. High-tier labs are now authorized for operation.</p>
              </div>
              <button className="bg-white text-slate-900 px-16 py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.5em] hover:bg-cyan-400 transition-all shadow-2xl italic">Command Accepted</button>
           </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
