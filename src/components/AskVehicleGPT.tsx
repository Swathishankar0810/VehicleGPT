import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Cpu, 
  Database, 
  Layers, 
  CheckCircle2, 
  Loader2, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  HelpCircle,
  FileText,
  Clock,
  ArrowRight
} from 'lucide-react';
import { VehicleGPTResponse, PipelineStage, HistoricalRecord, VehicleEvent } from '../types/vehicle';
import { QueryEngine } from '../engine/queryEngine';

interface AskVehicleGPTProps {
  historicalRecords: HistoricalRecord[];
  events: VehicleEvent[];
  externalTriggerQuery?: string;
  onSelectQuery?: (q: string) => void;
  isPresentationMode?: boolean;
}

export const AskVehicleGPT: React.FC<AskVehicleGPTProps> = ({
  historicalRecords,
  events,
  externalTriggerQuery,
  isPresentationMode,
}) => {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStages, setActiveStages] = useState<PipelineStage[]>([]);
  const [currentResponse, setCurrentResponse] = useState<VehicleGPTResponse | null>(null);

  const demoChips = [
    "Why did my driving range decrease?",
    "What happened before the battery overheating warning?",
    "When did energy consumption increase the most?",
    "Compare my city and highway efficiency.",
    "Show abnormal battery temperature events.",
    "What caused the range reduction?"
  ];

  // Auto-run if external query triggered (e.g. from demo tour or event modal)
  useEffect(() => {
    if (externalTriggerQuery && !isProcessing) {
      handleRunQuery(externalTriggerQuery);
    }
  }, [externalTriggerQuery]);

  // Initial load: show the first primary scenario ready to inspect
  useEffect(() => {
    if (!currentResponse && !isProcessing) {
      handleRunQuery("Why did my driving range decrease?", true);
    }
  }, []);

  const handleRunQuery = async (queryText: string, instant = false) => {
    if (isProcessing) return;
    setInputText(queryText);
    setIsProcessing(true);

    if (instant) {
      // Fast load for initial presentation without waiting full delay
      const resp = await QueryEngine.executeQuery(queryText, historicalRecords, events);
      setCurrentResponse(resp);
      setActiveStages(resp.stages);
      setIsProcessing(false);
      return;
    }

    try {
      const resp = await QueryEngine.executeQuery(
        queryText, 
        historicalRecords, 
        events, 
        (stages) => setActiveStages(stages)
      );
      setCurrentResponse(resp);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      handleRunQuery(inputText.trim());
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 lg:p-6 shadow-sm flex flex-col h-full">
      
      {/* Title & On-Device Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2 mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-[#795290] to-[#582C6D] flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4 h-4 text-purple-200" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold tracking-tight text-[#0B192C]">
                Ask VehicleGPT
              </h2>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-purple-50 text-[#582C6D] border border-purple-200">
                LOCAL SLM INFERENCE
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Natural-language queries grounded in time-series telemetry, events and diagnostics
            </p>
          </div>
        </div>

        {/* Local AI Execution Tags (Req 15) */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
          <span className="flex items-center gap-1 text-emerald-600 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Cloud Calls: 0
          </span>
          <span className="text-slate-300">|</span>
          <span>Lat: ~1.4s</span>
          <span className="text-slate-300">|</span>
          <span className="text-[#582C6D] font-medium">3B-INT4</span>
        </div>
      </div>

      {/* Demo Prompt Chips (Req 9) */}
      <div className="mb-4">
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 font-mono flex items-center gap-1">
          <span>Recommended Engineering Queries:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {demoChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleRunQuery(chip)}
              disabled={isProcessing}
              className="text-xs px-2.5 py-1 rounded-full bg-slate-100 hover:bg-purple-50 hover:text-[#582C6D] hover:border-purple-200 border border-slate-200 text-slate-700 font-medium transition-all text-left flex items-center gap-1 disabled:opacity-50"
            >
              <span>{chip}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Query Input Bar */}
      <form onSubmit={handleSubmit} className="relative mb-5">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask anything about your vehicle..."
          disabled={isProcessing}
          className="w-full pl-4 pr-24 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#795290]/40 focus:border-[#795290] text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/50 transition-all font-sans"
        />
        <button
          type="submit"
          disabled={isProcessing || !inputText.trim()}
          className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-md bg-[#0B192C] text-white hover:bg-[#1E3E62] disabled:opacity-40 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing</span>
            </>
          ) : (
            <>
              <span>Ask</span>
              <Send className="w-3 h-3" />
            </>
          )}
        </button>
      </form>

      {/* PIPELINE VISUALIZATION (Req 10 - Extremely Important) */}
      <div className="mb-5 p-3.5 rounded-xl bg-slate-50/80 border border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[11px] font-bold uppercase tracking-wider font-mono text-[#0B192C] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#795290]" />
            <span>On-Device VehicleGPT Processing Pipeline</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {isProcessing ? 'STAGE IN PROGRESS...' : 'STATUS: DETERMINISTIC VERIFIED'}
          </span>
        </div>

        {/* 5-Stage Stepper */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-1">
          {[
            { id: 1, label: '1. Understanding', sub: 'Intent & Entities', icon: HelpCircle },
            { id: 2, label: '2. Retrieval', sub: 'Telemetry + Logs', icon: Database },
            { id: 3, label: '3. Analytics', sub: 'Calculus & Trends', icon: TrendingUp },
            { id: 4, label: '4. Context', sub: 'Grounding Assembly', icon: Layers },
            { id: 5, label: '5. SLM Synthesis', sub: 'Explainable Insight', icon: Cpu }
          ].map((stg) => {
            const activeStage = activeStages.find(s => s.id === stg.id);
            const isCompleted = activeStage?.status === 'completed' || (!isProcessing && currentResponse);
            const isActive = activeStage?.status === 'active';

            return (
              <div 
                key={stg.id} 
                className={`p-2 rounded-lg border transition-all text-left ${
                  isActive 
                    ? 'bg-purple-100/70 border-[#795290] shadow-sm animate-pulse' 
                    : isCompleted 
                      ? 'bg-white border-emerald-200 shadow-sm' 
                      : 'bg-white/50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-700">
                    {stg.label}
                  </span>
                  {isActive ? (
                    <Loader2 className="w-3 h-3 text-[#795290] animate-spin" />
                  ) : isCompleted ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                  {stg.sub}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* VEHICLEGPT INSIGHT OUTPUT (Req 10, 11, 12) */}
      {currentResponse && (
        <div className="flex-1 bg-gradient-to-b from-purple-50/30 to-white rounded-xl border border-purple-200/60 p-4 lg:p-5 flex flex-col justify-between shadow-sm">
          <div>
            {/* Header of Insight */}
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-purple-100 gap-2 mb-3">
              <div className="flex items-center space-x-2">
                <span className="flex h-2 w-2 rounded-full bg-purple-600"></span>
                <span className="text-xs font-mono font-bold text-[#582C6D] uppercase">
                  VehicleGPT Explainable Response
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-semibold border border-amber-200">
                  SIMULATED VEHICLE DATA
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Intent: <strong className="text-slate-800">{currentResponse.intent}</strong>
              </span>
            </div>

            {/* Summary */}
            <div className={`font-semibold text-slate-900 mb-3.5 leading-relaxed ${isPresentationMode ? 'text-base' : 'text-sm'}`}>
              {currentResponse.summary}
            </div>

            {/* Contributing Factors */}
            <div className="mb-4">
              <div className="text-xs font-bold font-mono text-[#0B192C] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ArrowRight className="w-3.5 h-3.5 text-[#795290]" />
                <span>Contributing Factors</span>
              </div>
              <ul className="space-y-1.5 pl-1">
                {currentResponse.contributingFactors.map((factor, idx) => (
                  <li key={idx} className="text-xs text-slate-700 flex items-start space-x-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#795290] mt-1.5 flex-shrink-0"></span>
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Grounding Evidence Breakdown (Req 11, 12, 25) */}
            <div className="mb-4">
              <div className="text-xs font-bold font-mono text-[#0B192C] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Deterministic Evidence (Retrieved from Vehicle Data)</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {currentResponse.evidence.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs">
                    <div className="text-[10px] text-slate-500 font-medium truncate mb-1">
                      {item.metric}
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-mono font-bold text-slate-900">
                        {item.currentValue}
                      </span>
                      <span className={`text-[10px] font-mono font-semibold px-1 rounded ${
                        item.changePercent.includes('+') 
                          ? 'bg-amber-100 text-amber-800' 
                          : item.changePercent.includes('-') 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-slate-100 text-slate-700'
                      }`}>
                        {item.changePercent}
                      </span>
                    </div>
                    <div className="text-[9px] text-slate-400 font-mono mt-1">
                      Prev: {item.previousValue}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Conclusion */}
            <div className="p-3 rounded-lg bg-purple-50/70 border border-purple-200/80 text-xs text-[#582C6D] font-medium leading-relaxed">
              <span className="font-bold font-mono mr-1">CONCLUSION:</span>
              {currentResponse.conclusion}
            </div>
          </div>

          {/* Verification Footer */}
          <div className="mt-4 pt-3 border-t border-purple-100 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-500">
            <div className="flex items-center space-x-3">
              <span className="flex items-center gap-1 text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Evidence Grounded (Deterministic)
              </span>
              <span>Tokens: {currentResponse.tokenCount}</span>
            </div>
            <div>
              Model: <strong className="text-slate-800">{currentResponse.model}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
