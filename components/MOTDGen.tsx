import React, { useState, useEffect } from 'react';
import { Palette, Copy, Check, Search, Loader2, Globe, History, Trash2, ZapOff } from 'lucide-react';
import { searchServerMOTD } from '../services/gemini';
import { UserProfile } from '../types';

const COLOR_CODES: Record<string, string> = {
  '&0': '#000000', '&1': '#0000AA', '&2': '#00AA00', '&3': '#00AAAA',
  '&4': '#AA0000', '&5': '#AA00AA', '&6': '#FFAA00', '&7': '#AAAAAA',
  '&8': '#555555', '&9': '#5555FF', '&a': '#55FF55', '&b': '#55FFFF',
  '&c': '#FF5555', '&d': '#FF55FF', '&e': '#FFFF55', '&f': '#FFFFFF',
};

const MOTDGen: React.FC<{ user: UserProfile }> = ({ user }) => {
  const [line1, setLine1] = useState('&aWelcome to &bRadiant &eSystem!');
  const [line2, setLine2] = useState('&7Engineering the future of &fMinecraft&7.');
  const [ipInput, setIpInput] = useState('');
  const [searching, setSearching] = useState(false);
  const [copied, setCopied] = useState(false);
  const [archivedMOTDs, setArchivedMOTDs] = useState<{id: string, l1: string, l2: string, timestamp: number}[]>([]);

  useEffect(() => {
    const storageKey = `radiant_motd_vault_${user.email}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setArchivedMOTDs(JSON.parse(saved));
      } catch (e) {
        console.error("Vault corruption.", e);
      }
    }
  }, [user.email]);

  const saveToVault = (l1: string, l2: string) => {
    const storageKey = `radiant_motd_vault_${user.email}`;
    const newEntry = { id: crypto.randomUUID(), l1, l2, timestamp: Date.now() };
    const updated = [newEntry, ...archivedMOTDs].slice(0, 15);
    setArchivedMOTDs(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const deleteFromVault = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const storageKey = `radiant_motd_vault_${user.email}`;
    const updated = archivedMOTDs.filter(m => m.id !== id);
    setArchivedMOTDs(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const parseMOTD = (text: string) => {
    const parts = text.split(/(&[0-9a-f])/g);
    let currentColor = '#FFFFFF';
    
    return parts.map((part, i) => {
      if (COLOR_CODES[part]) {
        currentColor = COLOR_CODES[part];
        return null;
      }
      return <span key={i} style={{ color: currentColor }}>{part}</span>;
    });
  };

  const handleExtract = async () => {
    if (!ipInput.trim()) return;
    setSearching(true);
    try {
      const data = await searchServerMOTD(ipInput);
      if (data.line1) setLine1(data.line1);
      if (data.line2) setLine2(data.line2);
      saveToVault(data.line1 || line1, data.line2 || line2);
    } catch (e) {
      alert("Search failed. Radiant node unable to resolve IP context.");
    } finally {
      setSearching(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${line1}\n${line2}`);
    setCopied(true);
    saveToVault(line1, line2);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12 pb-32">
      <div className="glass-panel p-16 rounded-[4.5rem] border-white/5 space-y-12 bg-slate-900/30">
        <div className="flex items-center justify-between gap-6 flex-wrap">
          <h3 className="text-5xl font-black text-white italic uppercase tracking-tighter flex items-center gap-6 leading-none">
            <Palette className="text-[#00E5FF] w-12 h-12" />
            MOTD GEND LAB
          </h3>
          <div className="flex gap-4 flex-1 max-w-lg">
            <div className="relative flex-1 group">
              <Globe className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700" />
              <input 
                value={ipInput}
                onChange={(e) => setIpInput(e.target.value)}
                placeholder="EXTRACT_FROM_IP..."
                className="w-full bg-slate-950 border border-white/10 rounded-2xl pl-16 pr-6 py-5 text-[10px] font-black uppercase tracking-widest text-white italic outline-none"
              />
            </div>
            <button 
              onClick={handleExtract}
              disabled={searching || !ipInput}
              className="bg-white text-slate-950 px-8 rounded-2xl font-black uppercase text-[9px] tracking-widest hover:bg-[#00E5FF] transition-all flex items-center gap-3 italic"
            >
              {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              EXTRACT
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <input
            value={line1}
            onChange={(e) => setLine1(e.target.value)}
            className="w-full bg-slate-950 border border-white/10 rounded-2xl px-8 py-6 font-mono text-zinc-300 outline-none text-sm italic"
          />
          <input
            value={line2}
            onChange={(e) => setLine2(e.target.value)}
            className="w-full bg-slate-950 border border-white/10 rounded-2xl px-8 py-6 font-mono text-zinc-300 outline-none text-sm italic"
          />
        </div>

        <div className="bg-[#1e1e1e] border-2 border-[#3f3f3f] p-10 rounded-[3rem] shadow-inner min-h-[160px] flex flex-col justify-center gap-4 font-mono text-2xl relative overflow-hidden italic">
           <div className="flex items-center gap-8">
              <div className="w-20 h-20 bg-slate-900 rounded-2xl border border-white/5 flex items-center justify-center text-slate-700 text-[10px] font-black">ICON</div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white text-xl font-black uppercase">Radiant Cluster Node</span>
                  <span className="text-[#55ff55] text-xl font-black tracking-widest">PEAK</span>
                </div>
                <div className="leading-tight text-2xl whitespace-pre">
                  {parseMOTD(line1)}
                  <br />
                  {parseMOTD(line2)}
                </div>
              </div>
           </div>
        </div>

        <button onClick={handleCopy} className="w-full bg-white text-slate-950 font-black py-8 rounded-[2.5rem] transition-all shadow-2xl hover:bg-[#FFD700] text-sm uppercase tracking-[0.4em] italic">
          {copied ? <Check className="w-6 h-6 text-emerald-500 mr-4 inline" /> : null}
          {copied ? 'VAULT_SYNC_COMPLETE' : 'COPY_TO_VAULT'}
        </button>
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-4 px-4">
          <History className="text-[#FFD700] w-5 h-5" />
          <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">RADIANT VAULT</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {archivedMOTDs.map((m) => (
            <div 
              key={m.id}
              onClick={() => { setLine1(m.l1); setLine2(m.l2); }}
              className="glass-panel p-8 rounded-[2.5rem] border-white/5 bg-slate-950/40 hover:border-[#00E5FF]/40 cursor-pointer transition-all group"
            >
              <div className="flex justify-between mb-4">
                <span className="text-[8px] font-black text-slate-600 uppercase italic">{new Date(m.timestamp).toLocaleDateString()}</span>
                <button onClick={(e) => deleteFromVault(m.id, e)} className="text-slate-700 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="space-y-1 opacity-60 group-hover:opacity-100 transition-opacity font-mono text-[10px] truncate">
                <div>{m.l1}</div>
                <div>{m.l2}</div>
              </div>
            </div>
          ))}
          {archivedMOTDs.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-800 uppercase text-[10px] font-black tracking-widest italic">
              Vault Clear.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MOTDGen;
