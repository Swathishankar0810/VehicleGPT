import React from 'react';
import { 
  Play, 
  Pause, 
  Cpu, 
  ShieldCheck, 
  Layers, 
  Maximize2, 
  Minimize2, 
  Zap, 
  Radio, 
  CloudOff,
  Sparkles
} from 'lucide-react';
import { SimulationScenario } from '../types/vehicle';

interface HeaderProps {
  isRunning: boolean;
  onTogglePause: () => void;
  activeScenario: SimulationScenario;
  onOpenArchitecture: () => void;
  onStartDemo: () => void;
  isPresentationMode: boolean;
  onTogglePresentationMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isRunning,
  onTogglePause,
  activeScenario,
  onOpenArchitecture,
  onStartDemo,
  isPresentationMode,
  onTogglePresentationMode,
}) => {
  return (
    <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-30 shadow-sm transition-all duration-200">
      <div className="max-w-[1920px] mx-auto px-4 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          
          {/* Logo & Product Identification */}
          <div className="flex items-center space-x-3.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#0B192C] to-[#1E3E62] flex items-center justify-center text-white shadow-md shadow-[#0B192C]/10 border border-[#1E3E62]/40">
              <span className="font-mono font-bold text-lg tracking-wider text-purple-200">V</span>
              <span className="font-mono text-xs font-semibold text-cyan-400">G</span>
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h1 className="text-xl font-bold tracking-tight text-[#0B192C]">
                  VehicleGPT
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-[#795290]/10 text-[#582C6D] border border-[#795290]/25">
                  Automotive R&amp;D Proof-of-Concept
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-100 text-slate-600 border border-slate-200">
                  SDV Architecture v2.4
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                On-Device Conversational Intelligence for Software-Defined Vehicles
              </p>
            </div>
          </div>

          {/* Operational Status Badges (Req 4) */}
          <div className="flex flex-wrap items-center gap-2 lg:gap-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 ${!isRunning && 'hidden'}`}></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Vehicle Simulation: {isRunning ? 'RUNNING' : 'PAUSED'}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-50 border border-purple-200/80 text-[#582C6D] text-xs font-semibold">
              <Cpu className="w-3.5 h-3.5 text-[#795290]" />
              <span>AI Engine: ON-DEVICE</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200/80 text-blue-800 text-xs font-semibold">
              <CloudOff className="w-3.5 h-3.5 text-blue-600" />
              <span>Cloud Dependency: NONE</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>Query Response: &lt;2s TARGET</span>
            </div>
          </div>

          {/* Action Toolbars */}
          <div className="flex items-center space-x-2 pt-1 lg:pt-0">
            {/* Run Demo Button (Req 19) */}
            <button
              onClick={onStartDemo}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#795290] to-[#582C6D] text-white text-xs font-semibold shadow hover:brightness-110 active:scale-95 transition-all duration-150"
              title="Run 25-Second Automated Interactive Judge Demonstration"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-200 animate-pulse" />
              <span>▶ RUN DEMO</span>
            </button>

            {/* Presentation Mode Toggle (Req 28) */}
            <button
              onClick={onTogglePresentationMode}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                isPresentationMode 
                  ? 'bg-[#0B192C] text-white border-[#0B192C] shadow' 
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title="Toggle Large-Format Presentation Mode for Projectors / Slides"
            >
              {isPresentationMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span>{isPresentationMode ? 'Exit Presentation' : 'Presentation Mode'}</span>
            </button>

            {/* Architecture Modal Button (Req 20) */}
            <button
              onClick={onOpenArchitecture}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all"
              title="Inspect End-to-End SDV Architecture & Stack"
            >
              <Layers className="w-3.5 h-3.5 text-slate-600" />
              <span>Architecture</span>
            </button>

            {/* Pause / Resume Simulation */}
            <button
              onClick={onTogglePause}
              className={`p-1.5 rounded-lg border text-xs font-semibold transition-all ${
                isRunning 
                  ? 'border-slate-200 text-slate-600 hover:bg-slate-100' 
                  : 'border-emerald-300 bg-emerald-50 text-emerald-700'
              }`}
              title={isRunning ? "Pause Live Simulation" : "Resume Live Simulation"}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-emerald-600" />}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
