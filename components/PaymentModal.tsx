
import React, { useState } from 'react';
import { X, ShieldCheck, Check, Smartphone, Upload, ArrowRight, ChevronLeft } from 'lucide-react';
import { UserPlan } from '../types';

interface PaymentModalProps {
  onClose: () => void;
  onSuccess: (txnId: string) => void;
  type: 'artifact' | 'premium';
  planRequested?: UserPlan;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ onClose, onSuccess, type, planRequested = 'pro' }) => {
  const [verifying, setVerifying] = useState(false);
  const [txnId, setTxnId] = useState('');
  const [step, setStep] = useState<'scan' | 'verify'>('scan');

  const UPI_ID = "samarpanbera@fam";
  const amount = planRequested === 'legend' ? '299' : (planRequested === 'pro' ? '199' : '19');

  const handleVerify = () => {
    if (!txnId || txnId.length < 8) return;
    setVerifying(true);
    setTimeout(() => {
      onSuccess(txnId);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/98 backdrop-blur-3xl animate-in fade-in duration-300">
      <div className="glass-panel w-full max-w-xl rounded-[3rem] p-12 border-[#8A2BE2]/30 shadow-[0_0_150px_rgba(138,43,226,0.2)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#8A2BE2] via-[#CCFF00] to-[#8A2BE2]"></div>
        
        {/* Persistent Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-8 right-8 text-zinc-600 hover:text-[#CCFF00] transition-all p-2 rounded-full hover:bg-white/5"
          title="Cancel Payment"
        >
          <X className="w-8 h-8" />
        </button>

        <div className="text-center mb-10">
          <h3 className="text-4xl font-black text-white italic tracking-tighter mb-2 uppercase leading-none">
            {type === 'premium' ? `AUTHORIZE ${planRequested.toUpperCase()}` : 'SOURCE UNLOCK'}
          </h3>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.5em] italic">Network Authorization Sequence</p>
        </div>

        {step === 'scan' ? (
          <div className="space-y-10 animate-in slide-in-from-right-8 duration-500">
            <div className="bg-white p-10 rounded-[3rem] shadow-inner flex flex-col items-center gap-6 group">
              <div className="w-56 h-56 bg-zinc-50 rounded-2xl flex items-center justify-center overflow-hidden border-[8px] border-white group-hover:scale-105 transition-transform duration-500">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=upi://pay?pa=${UPI_ID}%26pn=UltimateGenerator%26am=${amount}%26cu=INR`} 
                  alt="UPI QR"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-center">
                 <p className="text-black font-black text-lg uppercase tracking-tight italic">ID: {UPI_ID}</p>
                 <p className="text-zinc-500 font-bold text-[9px] uppercase tracking-[0.3em]">SCAN VIA FAMAPP / ANY UPI</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="p-5 bg-white/5 rounded-2xl border border-white/5 text-center">
                  <p className="text-[9px] font-black text-[#8A2BE2] uppercase mb-1 tracking-widest italic">PAYLOAD</p>
                  <p className="text-3xl font-black text-white italic tracking-tighter">₹{amount}</p>
               </div>
               <div className="p-5 bg-white/5 rounded-2xl border border-white/5 text-center">
                  <p className="text-[9px] font-black text-[#CCFF00] uppercase mb-1 tracking-widest italic">TARGET</p>
                  <p className="text-3xl font-black text-white italic tracking-tighter uppercase">{planRequested}</p>
               </div>
            </div>

            <div className="flex gap-4">
               <button 
                 onClick={onClose}
                 className="px-8 py-6 rounded-2xl border border-white/10 text-zinc-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest italic"
               >
                 ABORT
               </button>
               <button 
                onClick={() => setStep('verify')}
                className="flex-1 bg-white text-black font-black py-6 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-4 hover:bg-[#CCFF00] uppercase text-[11px] tracking-[0.3em] italic"
              >
                PAYMENT SENT <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-10 animate-in slide-in-from-right-8 duration-500">
            <div className="space-y-6">
               <div className="space-y-4">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-4 italic">Ref No / Transaction Hash</label>
                  <input 
                    value={txnId}
                    onChange={(e) => setTxnId(e.target.value)}
                    placeholder="ENTER 12-DIGIT UPI REF..."
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-8 py-5 text-zinc-100 focus:ring-2 focus:ring-[#8A2BE2]/30 outline-none transition-all text-sm font-black uppercase tracking-[0.2em]"
                  />
               </div>
               <div className="space-y-4">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-4 italic">Verification Capture</label>
                  <div className="w-full h-32 bg-white/5 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-white/10 transition-all">
                     <Upload className="w-6 h-6 text-zinc-700" />
                     <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic">ATTACH SCREENSHOT</p>
                  </div>
               </div>
            </div>

            <div className="flex gap-4">
               <button 
                 onClick={() => setStep('scan')} 
                 className="px-8 py-6 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all flex items-center gap-2 italic"
               >
                 <ChevronLeft className="w-4 h-4" /> BACK
               </button>
               <button 
                 onClick={handleVerify}
                 disabled={verifying || txnId.length < 8}
                 className="flex-1 bg-[#8A2BE2] hover:bg-[#9d50bb] disabled:bg-zinc-800 text-white font-black py-6 rounded-2xl transition-all shadow-xl uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-4 italic"
               >
                 {verifying ? (
                   <>
                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                     SYNCING...
                   </>
                 ) : (
                   <>
                     <Check className="w-5 h-5" />
                     VERIFY TXN
                   </>
                 )}
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
