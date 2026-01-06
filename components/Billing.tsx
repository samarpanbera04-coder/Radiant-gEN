
import React, { useState } from 'react';
import { 
  Zap, 
  Check, 
  Star, 
  ShieldCheck, 
  TrendingUp,
  Clock,
  ChevronRight,
  Trophy,
  Crown,
  User,
  Activity
} from 'lucide-react';
import PaymentModal from './PaymentModal';
import { UserProfile, UserPlan } from '../types';

const Billing: React.FC<{ user: UserProfile; onUpgrade: (txnId: string, plan: UserPlan) => void }> = ({ user, onUpgrade }) => {
  const [showPayment, setShowPayment] = useState<{show: boolean, plan: UserPlan}>({show: false, plan: 'pro'});

  const plans = [
    {
      id: 'budget',
      name: 'Budget Node',
      price: '₹0',
      period: 'Permanent',
      description: 'CORE LABS FOR CASUAL ARCHITECTS',
      features: [
        '3 Artifacts / Day (Shared)',
        'Basic Neural Generation',
        'Standard Support Node',
        'Community Templates'
      ],
      premium: false,
      color: 'zinc'
    },
    {
      id: 'pro',
      name: 'Pro Architect',
      price: '₹199',
      period: 'Monthly',
      description: 'ADVANCED ENGINEERING CAPABILITIES',
      features: [
        '20 Generates Per Lab / Month',
        'Access to Mod Fabricator',
        'Access to Bot Construct',
        'Cloud Build Artifacts',
        'Priority Technical Node'
      ],
      premium: true,
      icon: Star,
      color: 'purple'
    },
    {
      id: 'legend',
      name: 'Legend Core',
      price: '₹299',
      period: 'Monthly',
      description: 'UNLIMITED NEURAL FLOW',
      features: [
        'UNLIMITED USES (Zero Throttle)',
        'Full Multi-File Source Access',
        'Advanced Asset Synthesis',
        'Prime Support Override',
        'Custom Obfuscation Layers',
        'Exclusive Beta Labs'
      ],
      premium: true,
      icon: Crown,
      color: 'lime'
    }
  ];

  return (
    <div className="space-y-24 pb-48 animate-in fade-in duration-1000">
      {showPayment.show && (
        <PaymentModal 
          type="premium" 
          onClose={() => setShowPayment({show: false, plan: 'pro'})} 
          onSuccess={(tid) => onUpgrade(tid, showPayment.plan)} 
          planRequested={showPayment.plan}
        />
      )}

      <div className="text-center max-w-4xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-4 bg-[#8A2BE2]/10 border border-[#8A2BE2]/20 px-6 py-2 rounded-full">
           <Activity className="w-4 h-4 text-[#CCFF00]" />
           <span className="text-[9px] font-black text-[#8A2BE2] uppercase tracking-[0.4em] italic">Network Authorization Protocol</span>
        </div>
        <h3 className="text-7xl font-black text-white italic tracking-tighter uppercase leading-none">
          ELEVATE YOUR <span className="text-[#CCFF00]">RANK</span>
        </h3>
        <p className="text-zinc-500 text-lg font-bold italic leading-relaxed uppercase tracking-tight max-w-2xl mx-auto">
          CHOOSE A NODE LEVEL TO MATCH YOUR ENGINEERING AMBITION. UNLOCK THE POWER OF THE VOID CORE.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`glass-panel p-10 rounded-[3.5rem] border transition-all duration-500 relative flex flex-col ${
              user.plan === plan.id ? 'border-[#CCFF00]/50 shadow-[0_0_40px_rgba(204,255,0,0.1)]' : 'border-white/5'
            } ${
              plan.id === 'legend' ? 'bg-gradient-to-br from-[#CCFF00]/5 to-transparent' : 
              plan.id === 'pro' ? 'bg-gradient-to-br from-[#8A2BE2]/5 to-transparent' : 'opacity-80'
            }`}
          >
            {user.plan === plan.id && (
               <div className="absolute top-8 right-8 bg-[#CCFF00]/10 px-4 py-1.5 rounded-full border border-[#CCFF00]/20 flex items-center gap-2">
                  <span className="text-[8px] font-black uppercase text-[#CCFF00] tracking-widest italic">Authorized</span>
               </div>
            )}
            
            <div className="mb-10">
               {plan.icon && <plan.icon className={`w-10 h-10 mb-5 ${plan.id === 'legend' ? 'text-[#CCFF00]' : 'text-[#8A2BE2]'}`} />}
               <h4 className={`text-3xl font-black italic tracking-tighter uppercase mb-2 ${plan.id === 'legend' ? 'text-[#CCFF00]' : (plan.id === 'pro' ? 'text-[#8A2BE2]' : 'text-zinc-400')}`}>{plan.name}</h4>
               <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] italic leading-relaxed">{plan.description}</p>
            </div>

            <div className="flex items-baseline gap-3 mb-10">
               <span className="text-6xl font-black text-white italic tracking-tighter">{plan.price}</span>
               <span className="text-zinc-600 text-lg font-black uppercase tracking-widest italic">/ {plan.period}</span>
            </div>

            <div className="space-y-4 flex-1 mb-10">
               {plan.features.map((feature, i) => (
                 <div key={i} className="flex items-center gap-4">
                    <Check className={`w-4 h-4 ${plan.id === 'legend' ? 'text-[#CCFF00]' : 'text-[#8A2BE2]'}`} />
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest italic">{feature}</span>
                 </div>
               ))}
            </div>

            <button 
              disabled={user.plan === plan.id || plan.id === 'budget'}
              onClick={() => setShowPayment({show: true, plan: plan.id as UserPlan})}
              className={`w-full py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] transition-all italic ${
                user.plan === plan.id ? 'bg-zinc-800 text-zinc-600 cursor-default' : 
                'bg-white text-black hover:bg-[#CCFF00] transform active:scale-95'
              }`}
            >
              {user.plan === plan.id ? 'ACTIVE_NODE' : 'INITIALIZE_AUTH'}
            </button>
          </div>
        ))}
      </div>

      <section className="max-w-5xl mx-auto glass-panel p-16 rounded-[4rem] border-[#8A2BE2]/10 relative overflow-hidden group shadow-2xl">
         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#CCFF00]/5 blur-[120px] rounded-full translate-x-32 -translate-y-32"></div>
         <div className="flex flex-col md:flex-row items-center gap-16 relative z-10">
            <div className="w-64 h-64 bg-white p-6 rounded-[3rem] shadow-2xl border-[10px] border-white group-hover:rotate-2 transition-transform">
               <img 
                 src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=samarpanbera@fam%26pn=UltimateGenerator%26cu=INR" 
                 alt="Payment QR" 
                 className="w-full h-full object-contain"
               />
            </div>
            <div className="flex-1 space-y-8 text-center md:text-left">
               <div className="space-y-4">
                 <h5 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">MANUAL ACTIVATION</h5>
                 <p className="text-zinc-500 font-bold text-base italic uppercase tracking-tight leading-relaxed">FAMAPP PROTOCOL ENABLED. SCAN THE QR TO DEPLOY PAYMENT. SUBMIT TXN REF NO IN PAYMENT MODAL.</p>
               </div>
               <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/5 italic">
                     <ShieldCheck className="w-5 h-5 text-[#8A2BE2]" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">SECURE_SYNC</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/5 italic">
                     <Clock className="w-5 h-5 text-[#CCFF00]" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">5_MIN_VALIDATION</span>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Billing;
