
import React, { useState, useEffect } from 'react';
import { User, Sparkles, Loader2, Download, ImageIcon, Wand2, History, Trash2, ZapOff } from 'lucide-react';
import { generateImageImagen } from '../services/gemini';
import { UserProfile } from '../types';

interface SkinGenProps {
  user: UserProfile;
}

const SkinGen: React.FC<SkinGenProps> = ({ user }) => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [archivedSkins, setArchivedSkins] = useState<{id: string, url: string, prompt: string, timestamp: number}[]>([]);

  // Load archived skins on mount
  useEffect(() => {
    const storageKey = `radiant_skin_vault_${user.email}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setArchivedSkins(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse Skin Vault data", e);
      }
    }
  }, [user.email]);

  const saveToVault = (url: string, prompt: string) => {
    const storageKey = `radiant_skin_vault_${user.email}`;
    const newEntry = {
      id: crypto.randomUUID(),
      url,
      prompt,
      timestamp: Date.now()
    };
    const updated = [newEntry, ...archivedSkins].slice(0, 15);
    setArchivedSkins(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const deleteFromVault = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const storageKey = `radiant_skin_vault_${user.email}`;
    const updated = archivedSkins.filter(s => s.id !== id);
    setArchivedSkins(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const handleGenerate = async () => {
    if (!description.trim()) return;
    setLoading(true);
    try {
      const img = await generateImageImagen(`Full-body Minecraft skin reference sheet for a character that is: ${description}. Professional pixel art style, multiple angles, front and back view, high resolution.`, "1:1");
      if (img) {
        setImage(img);
        saveToVault(img, description);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to generate high-fidelity skin concept.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 pb-32 animate-in fade-in duration-700">
      <div className="glass-panel p-16 rounded-[4.5rem] border-white/5 space-y-10 bg-slate-900/30">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
           <div className="space-y-2">
             <h3 className="text-5xl font-black text-white italic uppercase tracking-tighter flex items-center gap-6 leading-none">
               <User className="text-[#00E5FF] w-12 h-12" />
               SKIN VISUALIZER
             </h3>
             <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] italic">Neural Image Synthesis Node</p>
           </div>
           <div className="px-6 py-3 bg-azure-500/10 border border-azure-400/20 rounded-full text-[10px] font-black text-[#00E5FF] uppercase tracking-widest italic">IMAGEN_3_POWERED</div>
        </div>

        <p className="text-slate-400 text-base font-bold italic max-w-2xl leading-relaxed">
          Describe your engineering masterpiece. Our system architect will synthesize a professional multi-angle reference sheet using high-fidelity vision intelligence.
        </p>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="relative flex-1 group">
             <Wand2 className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-700 group-focus-within:text-[#00E5FF] transition-colors" />
             <input
               type="text"
               value={description}
               onChange={(e) => setDescription(e.target.value)}
               placeholder="E.G. QUANTUM-TECH ROGUE WITH NEON EMISSIVE ARMOR..."
               className="w-full bg-slate-950 border border-white/10 rounded-[2.5rem] pl-20 pr-8 py-8 text-slate-200 focus:ring-1 focus:ring-azure-500/40 outline-none transition-all font-black text-sm uppercase tracking-widest italic"
             />
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading || !description}
            className="bg-white text-slate-950 hover:bg-[#00E5FF] disabled:bg-slate-800 disabled:text-slate-600 px-12 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.3em] transition-all flex items-center justify-center gap-5 shadow-2xl active:scale-95 italic"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
            {loading ? 'SYNTHESIZING...' : 'EXECUTE_VISUAL'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Active Result or Placeholder */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 px-4">
            <Sparkles className="text-[#00E5FF] w-5 h-5" />
            <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">Active Sequence</h4>
          </div>
          {image ? (
            <div className="glass-panel p-12 rounded-[4rem] border-white/5 flex flex-col items-center animate-in zoom-in-95 duration-1000 bg-slate-900/60 shadow-2xl">
              <div className="relative group w-full">
                <img src={image} alt="Skin Concept" className="rounded-[3rem] shadow-2xl w-full h-auto border-4 border-white/5 bg-slate-950" />
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[3rem] backdrop-blur-md">
                   <a 
                     href={image} 
                     download="radiant_skin_blueprint.png"
                     className="bg-white text-slate-950 hover:bg-[#00E5FF] p-6 rounded-full shadow-2xl transition-all hover:scale-110 flex items-center gap-4 font-black uppercase tracking-widest text-[9px]"
                   >
                     <Download className="w-6 h-6" /> DOWNLOAD_ASSET
                   </a>
                </div>
              </div>
              <p className="mt-8 text-slate-500 text-[9px] font-black uppercase tracking-[0.4em] italic text-center">Radiant Neural Blueprint Generated.</p>
            </div>
          ) : (
            <div className="h-[400px] glass-panel border-2 border-dashed border-white/5 rounded-[4rem] flex flex-col items-center justify-center text-slate-700 bg-slate-900/10">
               <ImageIcon className="w-16 h-16 mb-4 opacity-10 animate-pulse" />
               <p className="text-[9px] font-black uppercase tracking-[0.6em] italic text-center px-10 leading-loose">Awaiting Visualization Prompt<br/>or Select from Vault</p>
            </div>
          )}
        </div>

        {/* VAULT - Archived Skins */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 px-4">
            <History className="text-[#FFD700] w-5 h-5" />
            <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">Radiant Vault</h4>
          </div>
          <div className="glass-panel p-10 rounded-[4rem] border-white/5 bg-slate-950/40 h-[400px] overflow-y-auto sidebar-hide-scroll space-y-4">
            {archivedSkins.length > 0 ? archivedSkins.map((skin) => (
              <div 
                key={skin.id}
                onClick={() => setImage(skin.url)}
                className={`p-4 rounded-3xl border transition-all flex items-center gap-6 cursor-pointer group hover:bg-white/5 ${image === skin.url ? 'bg-azure-500/10 border-[#00E5FF]/40' : 'bg-slate-900 border-white/5'}`}
              >
                <img src={skin.url} className="w-16 h-16 rounded-xl border border-white/10 object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-white uppercase italic truncate">{skin.prompt}</p>
                  <p className="text-[8px] font-black text-slate-600 uppercase italic mt-1">{new Date(skin.timestamp).toLocaleDateString()}</p>
                </div>
                <button 
                  onClick={(e) => deleteFromVault(skin.id, e)}
                  className="p-3 text-slate-700 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-800 space-y-4">
                <ZapOff className="w-10 h-10 opacity-20" />
                <p className="text-[9px] font-black uppercase tracking-[0.4em] italic">Vault Empty</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkinGen;
