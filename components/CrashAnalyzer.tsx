
import React, { useState } from 'react';
import { AlertCircle, Search, Loader2, ClipboardCheck, Info } from 'lucide-react';
import { diagnoseCrash } from '../services/gemini';
import { DiagnosisResult } from '../types';

const CrashAnalyzer: React.FC = () => {
  const [log, setLog] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  const handleAnalyze = async () => {
    if (!log.trim()) return;
    setLoading(true);
    try {
      const data = await diagnoseCrash(log);
      setResult(data);
    } catch (error) {
      console.error(error);
      alert('Failed to analyze log.');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'critical': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default: return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="text-red-500 w-6 h-6" />
          <h3 className="text-xl font-bold">Log Diagnoser</h3>
        </div>
        <p className="text-zinc-400 mb-4 text-sm">
          Paste your latest.log, crash-report.txt, or specific console error below for AI analysis.
        </p>
        <textarea
          value={log}
          onChange={(e) => setLog(e.target.value)}
          placeholder="[12:34:56] [Server thread/ERROR]: Encountered an unexpected exception..."
          className="w-full h-64 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs font-mono text-zinc-400 focus:ring-2 focus:ring-red-500/50 focus:border-red-500 outline-none transition-all resize-none"
        />
        <button
          onClick={handleAnalyze}
          disabled={loading || !log}
          className="mt-4 w-full bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
          {loading ? 'Scanning Bytecode...' : 'Analyze Crash Log'}
        </button>
      </div>

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4">
            <div className={`self-start px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${getSeverityColor(result.severity)}`}>
              {result.severity} Priority
            </div>
            <div>
              <h4 className="text-zinc-400 text-xs font-bold uppercase mb-2 flex items-center gap-2">
                <Info className="w-3 h-3" /> Detected Issue
              </h4>
              <p className="text-zinc-200 font-semibold">{result.error}</p>
            </div>
            <div>
              <h4 className="text-zinc-400 text-xs font-bold uppercase mb-2">Root Cause</h4>
              <p className="text-zinc-400 text-sm italic">{result.cause}</p>
            </div>
          </div>

          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6">
            <h4 className="text-emerald-500 text-xs font-bold uppercase mb-4 flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4" /> Recommended Solution
            </h4>
            <div className="text-emerald-50/80 prose prose-invert text-sm leading-relaxed whitespace-pre-wrap">
              {result.solution}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrashAnalyzer;
