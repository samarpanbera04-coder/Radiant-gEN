
import React, { useState } from 'react';
import { 
  Clapperboard, 
  Sparkles, 
  Loader2, 
  Download, 
  ImageIcon, 
  Video, 
  Type, 
  FileUp, 
  Zap, 
  Layout, 
  ArrowRight,
  Maximize2,
  Trash2,
  Lock,
  Monitor
} from 'lucide-react';
import { generateVideoVeo, generateImageImagen } from '../services/gemini';
import { UserProfile } from '../types';

const ASPECT_RATIOS = ['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9'];
const VIDEO_RATIOS = ['16:9', '9:16'];

const MediaStudio: React.FC<{ user: UserProfile; onUsed: () => void }> = ({ user, onUsed }) => {
  const [activeTab, setActiveTab] = useState<'video' | 'image'>('video');
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [ratio, setRatio] = useState(ASPECT_RATIOS[0]);
  const [videoRatio, setVideoRatio] = useState<'16:9' | '9:16'>('16:9');
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [uploadImage, setUploadImage] = useState<string | null>(null);

  const checkKeys = async () => {
    if (!(await window.aistudio.hasSelectedApiKey())) {
      await window.aistudio.openSelectKey();
      return true;
    }
    return true;
  };

  const handleGenerateVideo = async () => {
    if (!prompt.trim() && !uploadImage) return;
    setLoading(true);
    try {
      await checkKeys();
      const videoUrl = await generateVideoVeo(prompt, videoRatio, uploadImage || undefined);
      setGeneratedVideo(videoUrl);
      onUsed();
    } catch (e) {
      alert("Video generation failed. Ensure you have a paid API key selected.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      await checkKeys();
      const imageUrl = await generateImageImagen(prompt, ratio);
      setGeneratedImage(imageUrl);
      onUsed();
    } catch (e) {
      alert("Image generation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUploadImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-32">
      <div className="flex justify-between items-center flex-wrap gap-8">
        <div>
          <h3 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">
            MEDIA <span className="text-[#00E5FF]">STUDIO</span>
          </h3>
          <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] italic mt-2">Visual Asset Engine // VEO & IMAGEN</p>
        </div>
        <div className="flex gap-4 p-2 bg-slate-950 border border-white/5 rounded-3xl backdrop-blur-3xl shadow-inner">
          <button 
            onClick={() => setActiveTab('video')}
            className={`px-10 py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === 'video' ? 'bg-[#00E5FF] text-slate-950 shadow-lg shadow-azure-400/20' : 'text-slate-600 hover:text-white'}`}
          >
            <Video className="w-5 h-5" /> VEO_VIDEO
          </button>
          <button 
            onClick={() => setActiveTab('image')}
            className={`px-10 py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === 'image' ? 'bg-[#FFD700] text-slate-950 shadow-lg shadow-gold-400/20' : 'text-slate-600 hover:text-white'}`}
          >
            <ImageIcon className="w-5 h-5" /> IMAGEN_PRO
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="glass-panel p-16 rounded-[4.5rem] border-white/5 space-y-12 bg-slate-900/30">
          <div className="space-y-6">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-6 italic">Neural Prompt Blueprint</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={activeTab === 'video' ? "CINEMATIC MINECRAFT LANDSCAPE WITH FLOATING ISLANDS AND CASCADING WATERFALLS..." : "ULTRA-DETAILED MINECRAFT SKIN CHARACTER, PHOTOREALISTIC ARMOR, RAY-TRACED LIGHTING..."}
              className="w-full h-64 bg-slate-950 border border-white/10 rounded-[3rem] p-10 text-slate-100 outline-none transition-all resize-none text-base font-bold placeholder:text-slate-800 italic shadow-inner"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-6 italic">ASPECT_RATIO</label>
              <div className="grid grid-cols-3 gap-2">
                {(activeTab === 'video' ? VIDEO_RATIOS : ASPECT_RATIOS).map(r => (
                  <button 
                    key={r}
                    onClick={() => activeTab === 'video' ? setVideoRatio(r as any) : setRatio(r)}
                    className={`py-3 rounded-xl font-black text-[9px] uppercase tracking-widest border transition-all ${
                      (activeTab === 'video' ? videoRatio : ratio) === r 
                        ? 'bg-white text-black border-white' 
                        : 'bg-slate-950 border-white/5 text-slate-600 hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === 'video' && (
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-6 italic">IMAGE_TO_VIDEO</label>
                <div className="relative group">
                  {uploadImage ? (
                    <div className="relative rounded-2xl overflow-hidden border border-white/10">
                       <img src={uploadImage} className="w-full h-24 object-cover" />
                       <button onClick={() => setUploadImage(null)} className="absolute top-2 right-2 bg-red-500 p-2 rounded-full text-white hover:bg-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-24 bg-slate-950 border-2 border-dashed border-white/5 rounded-2xl cursor-pointer hover:border-[#00E5FF]/40 transition-all">
                      <FileUp className="w-6 h-6 text-slate-700" />
                      <span className="text-[9px] font-black text-slate-700 uppercase mt-2">UPLOAD ASSET</span>
                      <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                    </label>
                  )}
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={activeTab === 'video' ? handleGenerateVideo : handleGenerateImage}
            disabled={loading || (!prompt.trim() && !uploadImage)}
            className={`w-full font-black py-10 rounded-[3rem] transition-all flex items-center justify-center gap-10 shadow-2xl group active:scale-[0.97] uppercase text-base tracking-[0.6em] italic ${
              activeTab === 'video' ? 'bg-white text-slate-950 hover:bg-[#00E5FF]' : 'bg-white text-slate-950 hover:bg-[#FFD700]'
            }`}
          >
            {loading ? <Loader2 className="w-10 h-10 animate-spin" /> : <Zap className="w-10 h-10" />}
            {loading ? 'MODULATING...' : 'INITIALIZE_GEN'}
          </button>
        </div>

        <div className="glass-panel p-16 rounded-[4.5rem] border-white/5 bg-slate-900/60 backdrop-blur-3xl flex flex-col items-center justify-center min-h-[600px] relative overflow-hidden">
           {loading && (
             <div className="text-center space-y-8 animate-pulse">
                <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto">
                   <Monitor className="w-12 h-12 text-[#00E5FF]" />
                </div>
                <div className="space-y-4">
                  <p className="text-2xl font-black text-white italic uppercase tracking-tighter">Manifesting Media Artifact</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic leading-relaxed">Radiant Node is calculating thousands of neural tokens...<br/>Estimated Sync Time: 45-120 seconds.</p>
                </div>
             </div>
           )}

           {!loading && !generatedVideo && !generatedImage && (
             <div className="text-center space-y-6 opacity-30">
                <Maximize2 className="w-20 h-20 text-slate-700 mx-auto" />
                <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest italic">Awaiting Visualization Sequence</p>
             </div>
           )}

           {generatedVideo && !loading && (
             <div className="w-full h-full flex flex-col items-center animate-in zoom-in duration-1000">
                <video src={generatedVideo} controls className="w-full h-auto rounded-[2.5rem] shadow-2xl border-4 border-white/5 bg-black" />
                <div className="mt-8 flex gap-6">
                   <a href={generatedVideo} download="radiant_veo_artifact.mp4" className="flex items-center gap-4 bg-white text-slate-950 px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest italic hover:bg-[#00E5FF] transition-all">
                      <Download className="w-5 h-5" /> EXPORT_MP4
                   </a>
                   <button onClick={() => setGeneratedVideo(null)} className="text-slate-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest italic">PURGE_BUFFER</button>
                </div>
             </div>
           )}

           {generatedImage && !loading && (
             <div className="w-full h-full flex flex-col items-center animate-in zoom-in duration-1000">
                <img src={generatedImage} className="w-full h-auto rounded-[2.5rem] shadow-2xl border-4 border-white/5 bg-black" />
                <div className="mt-8 flex gap-6">
                   <a href={generatedImage} download="radiant_imagen_artifact.png" className="flex items-center gap-4 bg-white text-slate-950 px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest italic hover:bg-[#FFD700] transition-all">
                      <Download className="w-5 h-5" /> EXPORT_PNG
                   </a>
                   <button onClick={() => setGeneratedImage(null)} className="text-slate-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest italic">PURGE_BUFFER</button>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default MediaStudio;
