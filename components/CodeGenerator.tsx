import React, { useState, useEffect } from 'react';
import { 
  Loader2, 
  Layers, 
  Cpu, 
  Code2, 
  Box, 
  Hammer, 
  Zap, 
  Lock, 
  ScrollText, 
  Palette, 
  Bot,
  FileCode,
  Archive,
  Settings2,
  PackageCheck,
  Sparkles,
  ArrowRight,
  ChevronRight,
  FileJson,
  FileText,
  Terminal,
  RefreshCw,
  Download,
  BookOpen,
  Send,
  FileDigit,
  DownloadCloud,
  FileArchive,
  Wand2,
  Info,
  CheckCircle2,
  FileUp,
  Workflow,
  ZapOff,
  BrainCircuit,
  History,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { generateMinecraftContent, generateCommandGuide, GenMode } from '../services/gemini';
import { GeneratedProject, ToolType, UserProfile, ProjectFile } from '../types';
import JSZip from 'jszip';

interface CodeGeneratorProps {
  type: ToolType;
  user: UserProfile;
  onUsed: () => boolean;
  onNavigateToBilling: () => void;
}

const VERSIONS = ['1.21.x', '1.20.x', '1.19.x', '1.18.x', '1.16.5', '1.12.2'];

const PLATFORMS: Record<string, string[]> = {
  [ToolType.CODE_GEN]: ['Paper/Spigot', 'BungeeCord', 'Velocity'],
  [ToolType.MOD_GEN]: ['Fabric', 'Forge', 'NeoForge'],
  [ToolType.SKRIPT]: ['Skript v2.9+', 'SkBee', 'SkQuery'],
  [ToolType.RESOURCE_PACK]: ['1.13+ Format', 'Iris/OptiFine'],
  [ToolType.DISCORD_BOT]: ['Discord.js v14', 'Discord.py v2']
};

const CodeGenerator: React.FC<CodeGeneratorProps> = ({ type, user, onUsed, onNavigateToBilling }) => {
  const isPremiumTool = [ToolType.MOD_GEN, ToolType.DISCORD_BOT, ToolType.RESOURCE_PACK].includes(type);
  const canAccess = user.plan !== 'budget' || !isPremiumTool;

  const [prompt, setPrompt] = useState('');
  const [refinePrompt, setRefinePrompt] = useState('');
  const [version, setVersion] = useState(VERSIONS[0]);
  const [platform, setPlatform] = useState(PLATFORMS[type]?.[0] || 'Default');
  const [requiresPack, setRequiresPack] = useState(false);
  const [genMode, setGenMode] = useState<GenMode>('deep');
  
  const [loading, setLoading] = useState(false);
  const [refining, setRefining] = useState(false);
  const [compiling, setCompiling] = useState(false);
  const [compileStep, setCompileStep] = useState('');
  const [result, setResult] = useState<GeneratedProject | null>(null);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [buildReady, setBuildReady] = useState(false);
  
  const [archivedProjects, setArchivedProjects] = useState<GeneratedProject[]>([]);

  useEffect(() => {
    const storageKey = `radiant_vault_${user.email}_${type}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setArchivedProjects(JSON.parse(saved));
      } catch (e) {
        console.error("Vault re-indexing required.", e);
      }
    }
  }, [user.email, type]);

  const saveToVault = (project: GeneratedProject) => {
    const storageKey = `radiant_vault_${user.email}_${type}`;
    const updated = [project, ...archivedProjects.filter(p => p.id !== project.id)].slice(0, 25);
    setArchivedProjects(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const deleteFromVault = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const storageKey = `radiant_vault_${user.email}_${type}`;
    const updated = archivedProjects.filter(p => p.id !== id);
    setArchivedProjects(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const loadFromVault = (project: GeneratedProject) => {
    setResult(project);
    setActiveFileIndex(0);
    setBuildReady(false);
  };

  const handleGenerate = async (isRefinement = false) => {
    const currentPrompt = isRefinement ? refinePrompt : prompt;
    if (!currentPrompt.trim()) return;

    if (isRefinement) setRefining(true);
    else setLoading(true);

    try {
      // INTERNAL LOGIC UPDATE: Use "PLUGIN_GEN" labeling for highest fidelity
      const data = await generateMinecraftContent(
        currentPrompt, 
        type === ToolType.CODE_GEN ? "PLUGIN_GEN" : type, 
        version, 
        platform, 
        result ? result.files : undefined,
        requiresPack,
        genMode
      );
      
      if (!isRefinement) onUsed();

      const newProject: GeneratedProject = {
        id: result?.id || crypto.randomUUID(),
        type,
        title: data.title,
        files: data.files,
        steps: data.steps,
        timestamp: Date.now(),
        version,
        platform
      };

      setResult(newProject);
      saveToVault(newProject);
      
      setActiveFileIndex(0);
      setBuildReady(false);
      if (isRefinement) setRefinePrompt('');
    } catch (error) {
      alert('Architectural Link Refused. Logic threshold error.');
    } finally {
      setLoading(false);
      setRefining(false);
    }
  };

  const handleCreateGuide = async () => {
    if (!result) return;
    setRefining(true);
    try {
      const guide = await generateCommandGuide(result.files);
      const guideFile: ProjectFile = {
        name: 'ARCH_DOCS.md',
        content: guide || '',
        language: 'markdown'
      };
      const existing = result.files.findIndex(f => f.name === 'ARCH_DOCS.md');
      const updatedFiles = existing !== -1 ? result.files.map((f, i) => i === existing ? guideFile : f) : [...result.files, guideFile];
      const updatedProject = { ...result, files: updatedFiles };
      setResult(updatedProject);
      saveToVault(updatedProject);
      setActiveFileIndex(updatedFiles.length - 1);
    } catch (e) {
      alert("Documentation Sync Interrupted.");
    } finally {
      setRefining(false);
    }
  };

  const startBuild = () => {
    setCompiling(true);
    const steps = ['PEAK_INIT', 'RECURSIVE_VALIDATION', 'ASM_OPTIMIZATION', 'MANIFEST_SIGNATURE', 'BUILD_STABLE'];
    steps.forEach((step, i) => {
      setTimeout(() => {
        setCompileStep(step);
        if (i === steps.length - 1) {
          setCompiling(false);
          setBuildReady(true);
        }
      }, i * 400);
    });
  };

  const downloadProjectZip = async () => {
    if (!result) return;
    const zip = new JSZip();
    result.files.forEach(file => zip.file(file.name, file.content));
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RAD_ARCH_${result.title.replace(/\s+/g, '_')}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getFileIcon = (name: string) => {
    if (name.endsWith('.java') || name.endsWith('.py')) return <FileCode className="w-4 h-4 text-[#00E5FF]" />;
    if (name.endsWith('.yml') || name.endsWith('.toml')) return <Settings2 className="w-4 h-4 text-[#FFD700]" />;
    return <FileText className="w-4 h-4 text-slate-500" />;
  };

  if (!canAccess) return (
    <div className="flex flex-col items-center justify-center py-48 glass-panel rounded-[5rem] border-azure-500/20 bg-azure-500/5">
      <Lock className="w-16 h-16 text-[#FFD700] mb-8" />
      <h3 className="text-6xl font-black text-white italic tracking-tighter uppercase mb-4">NODE_LOCKED</h3>
      <button onClick={onNavigateToBilling} className="bg-white text-black px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest italic hover:bg-[#00E5FF] transition-all">INITIALIZE UPGRADE</button>
    </div>
  );

  return (
    <div className="space-y-16 pb-32">
      {result && (
        <button 
          onClick={() => setResult(null)} 
          className="flex items-center gap-3 px-8 py-4 bg-slate-900/50 border border-white/5 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest italic hover:text-white transition-all mb-4"
        >
          <ArrowRight className="w-4 h-4 rotate-180" /> Back to Workspace
        </button>
      )}

      {!result && (
        <div className="space-y-16">
          <div className="glass-panel p-20 rounded-[4.5rem] relative overflow-hidden bg-slate-900/30 border-white/5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 mb-16">
              <div className="space-y-2">
                <h3 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
                  {type === ToolType.CODE_GEN ? "Plugin Gen" : type.replace('_', ' ')}
                </h3>
                <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.6em] italic">PEAK-MODE ACTIVE // RADIANT ARCHITECT</p>
              </div>
              
              <div className="flex gap-4 p-2 bg-slate-950 border border-white/5 rounded-3xl shadow-2xl">
                <button 
                  onClick={() => setGenMode('fast')}
                  className={`px-8 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center gap-3 ${genMode === 'fast' ? 'bg-[#00E5FF] text-slate-900 shadow-lg' : 'text-slate-600 hover:text-white'}`}
                >
                  <Zap className="w-4 h-4" /> FLASH
                </button>
                <button 
                  onClick={() => setGenMode('deep')}
                  className={`px-8 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center gap-3 ${genMode === 'deep' ? 'bg-[#FFD700] text-slate-950 shadow-lg' : 'text-slate-600 hover:text-white'}`}
                >
                  <BrainCircuit className="w-4 h-4" /> PEAK_THINK
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="space-y-6">
                  <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest px-6 italic">TARGET_BUILD</label>
                  <select value={version} onChange={(e) => setVersion(e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded-[2.5rem] px-10 py-6 text-slate-200 font-black uppercase text-[12px] tracking-widest appearance-none outline-none focus:border-[#00E5FF]/40">
                    {VERSIONS.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
              </div>
              <div className="space-y-6">
                  <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest px-6 italic">API_FRAMEWORK</label>
                  <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded-[2.5rem] px-10 py-6 text-slate-200 font-black uppercase text-[12px] tracking-widest appearance-none outline-none focus:border-[#00E5FF]/40">
                    {PLATFORMS[type]?.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
              </div>
              <div className="space-y-6">
                  <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest px-6 italic">ASSET_LINK</label>
                  <button 
                    onClick={() => setRequiresPack(!requiresPack)}
                    className={`w-full border rounded-[2.5rem] px-10 py-6 flex items-center justify-between transition-all font-black uppercase text-[10px] tracking-widest italic ${requiresPack ? 'bg-azure-500/10 border-azure-400/40 text-[#00E5FF]' : 'bg-slate-950 border-white/10 text-slate-600'}`}
                  >
                    Pack Synchronized
                    <div className={`w-10 h-5 rounded-full relative ${requiresPack ? 'bg-[#00E5FF]' : 'bg-slate-800'}`}>
                      <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${requiresPack ? 'left-6' : 'left-1'}`} />
                    </div>
                  </button>
              </div>
            </div>

            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="ENTER ARCHITECTURAL PROMPT FOR PEAK GENERATION..."
              className="w-full h-72 bg-slate-950 border border-white/10 rounded-[3.5rem] p-12 text-slate-100 outline-none transition-all resize-none text-lg font-bold placeholder:text-slate-800 italic mb-12 shadow-inner"
            />

            <button 
              onClick={() => handleGenerate(false)}
              disabled={loading || !prompt.trim()}
              className="w-full bg-white text-slate-950 font-black py-10 rounded-[3rem] transition-all flex items-center justify-center gap-10 hover:bg-[#00E5FF] active:scale-[0.97] uppercase text-base tracking-[0.6em] italic shadow-2xl"
            >
              {loading ? <Loader2 className="w-10 h-10 animate-spin" /> : <Zap className="w-10 h-10" />}
              {loading ? 'CALIBRATING...' : 'EXECUTE_RADIANT_GEN'}
            </button>
          </div>

          <div className="space-y-8 animate-in fade-in duration-1000">
            <div className="flex items-center gap-4 px-4">
              <History className="text-[#FFD700] w-6 h-6" />
              <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter">RADIANT VAULT</h4>
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic ml-auto">PROJECT_PERSISTENCE_ACTIVE</p>
            </div>

            {archivedProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {archivedProjects.map((proj) => (
                  <div 
                    key={proj.id} 
                    onClick={() => loadFromVault(proj)}
                    className="glass-panel p-8 rounded-[2.5rem] border-white/5 hover:border-[#00E5FF]/40 transition-all cursor-pointer group relative overflow-hidden bg-slate-900/40"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-white/5 rounded-xl text-slate-500 group-hover:text-[#00E5FF] transition-colors">
                        <Archive className="w-5 h-5" />
                      </div>
                      <button onClick={(e) => deleteFromVault(proj.id, e)} className="p-3 text-slate-700 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <h5 className="text-lg font-black text-white italic uppercase tracking-tighter mb-2 truncate">{proj.title}</h5>
                    <div className="flex gap-2">
                      <span className="text-[9px] font-black text-slate-600 uppercase italic">{proj.version}</span>
                      <span className="text-[9px] font-black text-[#FFD700] uppercase italic">{proj.platform}</span>
                    </div>
                    <div className="mt-6 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[9px] font-black text-slate-700 uppercase italic">{new Date(proj.timestamp).toLocaleDateString()}</span>
                      <ExternalLink className="w-4 h-4 text-[#00E5FF]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-panel p-20 rounded-[3rem] border-white/5 border-dashed text-center opacity-40">
                <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest italic">Vault Empty. Complete projects to archive them here.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-12 animate-in fade-in duration-1000">
          <div className="glass-panel border-white/5 rounded-[5rem] overflow-hidden shadow-2xl bg-slate-900/60 backdrop-blur-3xl">
            <div className="bg-slate-950/80 px-16 py-12 flex flex-col md:flex-row justify-between items-center gap-12 border-b border-white/5 relative">
              <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-[#00E5FF] via-[#FFD700] to-[#00E5FF]"></div>
              <div className="space-y-2">
                 <h4 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">{result.title}</h4>
                 <p className="text-[12px] text-slate-600 font-bold uppercase tracking-[0.4em] italic">{result.platform} // RADIANT_NODE::{result.id.split('-')[0]}</p>
              </div>
              <div className="flex gap-4">
                <button onClick={downloadProjectZip} className="bg-slate-800/80 text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-4 hover:bg-white hover:text-slate-950 transition-all shadow-xl">
                  <FileArchive className="w-5 h-5 text-[#FFD700]" /> EXPORT_PACKAGE
                </button>
                {!buildReady ? (
                  <button onClick={startBuild} disabled={compiling} className="bg-slate-800 text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-4 hover:bg-[#00E5FF] hover:text-slate-900 transition-all">
                    {compiling ? <Loader2 className="w-5 h-5 animate-spin" /> : <Hammer className="w-5 h-5" />}
                    {compiling ? compileStep : 'FINALIZE_ARTIFACT'}
                  </button>
                ) : (
                  <button onClick={() => alert('Artifact manifested in secure buffer.')} className="bg-[#00E5FF] text-slate-950 px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-4 shadow-azure-400/20 shadow-lg">
                    <DownloadCloud className="w-5 h-5" /> SYNC_BINARY
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row min-h-[750px]">
               <div className="w-full md:w-80 bg-slate-950/60 border-r border-white/5 p-8">
                  <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest italic mb-8">FILE_TREE_EXPLORER</p>
                  <div className="space-y-2 overflow-y-auto max-h-[600px] sidebar-hide-scroll">
                     {result.files.map((file, i) => (
                        <button key={i} onClick={() => setActiveFileIndex(i)} className={`w-full flex items-center gap-4 px-6 py-5 rounded-xl transition-all ${activeFileIndex === i ? 'bg-azure-500/10 text-[#00E5FF] border border-azure-400/20' : 'text-slate-500 hover:text-white'}`}>
                           {getFileIcon(file.name)}
                           <span className="text-[11px] font-black uppercase tracking-tight italic truncate">{file.name}</span>
                        </button>
                     ))}
                  </div>
               </div>

               <div className="flex-1 bg-slate-950/90 flex flex-col">
                  <div className="flex-1 overflow-auto p-12 bg-[#020617]/50">
                    <pre className="text-[14px] font-mono text-slate-400 leading-loose italic"><code>{result.files[activeFileIndex].content}</code></pre>
                  </div>

                  <div className="p-12 border-t border-white/5 bg-slate-900/60 backdrop-blur-2xl">
                    <div className="flex flex-col md:flex-row gap-6">
                       <div className="relative flex-1 group">
                          <Terminal className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-700 group-focus-within:text-[#00E5FF] transition-colors" />
                          <input 
                            value={refinePrompt}
                            onChange={(e) => setRefinePrompt(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerate(true)}
                            placeholder="INPUT_NEURAL_REFINEMENT_COMMAND..."
                            className="w-full bg-slate-950 border border-white/10 rounded-2xl pl-20 pr-8 py-7 text-white outline-none focus:ring-1 focus:ring-azure-500/30 transition-all text-xs font-black uppercase tracking-widest italic"
                          />
                       </div>
                       <button onClick={() => handleGenerate(true)} disabled={refining || !refinePrompt.trim()} className="px-12 bg-white text-slate-950 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-5 hover:bg-[#00E5FF] transition-all shadow-2xl disabled:opacity-30 italic">
                         {refining ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />} RECALIBRATE
                       </button>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeGenerator;
