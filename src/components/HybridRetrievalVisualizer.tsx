import React from 'react';
import { Database, Binary, FileText, ArrowDown, Layers, Sparkles } from 'lucide-react';

export const HybridRetrievalVisualizer: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 lg:p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center space-x-2">
          <Database className="w-4 h-4 text-[#795290]" />
          <h2 className="text-sm font-bold tracking-tight text-[#0B192C] uppercase font-mono">
            Hybrid Retrieval Architecture
          </h2>
        </div>
        <span className="text-[10px] font-mono bg-purple-50 text-[#582C6D] px-2 py-0.5 rounded border border-purple-200 font-semibold">
          ZERO-CLOUD EDGE RETRIEVAL
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center">
        
        {/* Branch 1: Structured Search */}
        <div className="flex-1 w-full p-3 rounded-lg bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-center space-x-1.5 text-xs font-mono font-bold text-slate-800 uppercase mb-2">
            <Binary className="w-3.5 h-3.5 text-blue-600" />
            <span>Structured Search</span>
          </div>
          <div className="grid grid-cols-2 gap-1 text-[11px] font-mono text-slate-600">
            <div className="bg-white p-1 rounded border border-slate-200/60">Time-Series (10Hz)</div>
            <div className="bg-white p-1 rounded border border-slate-200/60">CAN Telemetry</div>
            <div className="bg-white p-1 rounded border border-slate-200/60">Discrete Events</div>
            <div className="bg-white p-1 rounded border border-slate-200/60">DTC Diagnostic Logs</div>
          </div>
        </div>

        <div className="text-slate-400 font-bold text-lg hidden md:block">+</div>

        {/* Branch 2: Semantic Search */}
        <div className="flex-1 w-full p-3 rounded-lg bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-center space-x-1.5 text-xs font-mono font-bold text-slate-800 uppercase mb-2">
            <FileText className="w-3.5 h-3.5 text-purple-600" />
            <span>Semantic Vector Search</span>
          </div>
          <div className="grid grid-cols-2 gap-1 text-[11px] font-mono text-slate-600">
            <div className="bg-white p-1 rounded border border-slate-200/60">Historical Summaries</div>
            <div className="bg-white p-1 rounded border border-slate-200/60">Vehicle Context Logs</div>
            <div className="bg-white p-1 rounded border border-slate-200/60">Event Descriptions</div>
            <div className="bg-white p-1 rounded border border-slate-200/60">Owner Manual DTCs</div>
          </div>
        </div>

        <div className="text-slate-400 font-bold text-lg hidden md:block">→</div>

        {/* Output: Unified Grounded Context */}
        <div className="flex-1 w-full p-3 rounded-lg bg-purple-50/80 border border-purple-200">
          <div className="flex items-center justify-center space-x-1.5 text-xs font-mono font-bold text-[#582C6D] uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#795290]" />
            <span>Unified Grounded Context</span>
          </div>
          <div className="text-[11px] text-purple-900 bg-white p-2 rounded border border-purple-200/60 text-left font-mono">
            <div>✓ Time Horizon Window Filtered</div>
            <div>✓ Numeric Bounds Verified</div>
            <div>✓ On-Device Context (1,140 Tokens)</div>
          </div>
        </div>

      </div>
    </div>
  );
};
