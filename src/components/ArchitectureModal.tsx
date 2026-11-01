import React from 'react';
import { X, Layers, Cpu, Database, ShieldCheck, Radio, Server, ArrowDown } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const pipelineLayers = [
    {
      title: '1. Vehicle Data Sources',
      items: ['CAN / CAN-FD Buses', 'Ethernet SOME/IP', 'Android Vehicle HAL (VHAL)', 'QNX Services & Logs', 'ADAS Domain Controller', 'Diagnostic Trouble Codes (DTCs)'],
      color: 'bg-slate-100 border-slate-300 text-slate-800'
    },
    {
      title: '2. Hardware Safety Isolation Barrier',
      items: ['ASIL-D Microcontroller (Infineon AURIX / Renesas RH850)', 'Unidirectional Read-Only CAN Tap', 'Memory Protection Unit (MPU) & TrustZone'],
      color: 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
    },
    {
      title: '3. Data Ingestion & Stream Processing',
      items: ['Embedded Zero-Copy Ring Buffers', '10Hz Time-Series Decimator', 'Event & Anomaly Detection Filters', 'Outlier Pre-Screening'],
      color: 'bg-blue-50 border-blue-200 text-blue-900'
    },
    {
      title: '4. Real-Time & Historical Storage',
      items: ['Local SQLite / Parquet Time-Series Store (35-Day Circular Buffer)', 'HNSW Embedded Vector Index', 'Zero Cloud Egress / Strictly On-Flash'],
      color: 'bg-indigo-50 border-indigo-200 text-indigo-900'
    },
    {
      title: '5. Query Understanding & Hybrid Retrieval',
      items: ['Intent Classification & Entity Parsing', 'Structured Telemetry Slicing + Semantic Log Retrieval', 'Context Filtering & Token Optimization'],
      color: 'bg-purple-50 border-purple-200 text-purple-900'
    },
    {
      title: '6. Deterministic Vehicle Analytics Engine',
      items: ['Calculated Metric Calculus (% shifts, averages, deviations)', 'Sensor-to-DTC Event Correlation Chains', 'Root Cause Analysis (RCA) Logic'],
      color: 'bg-amber-50 border-amber-200 text-amber-900'
    },
    {
      title: '7. On-Device SLM/LLM Inference',
      items: ['Quantized 3B Parameter Small Language Model (INT4)', 'NPU / ARM Cortex Acceleration', 'Grounded Prompt Synthesis (<2s Target)'],
      color: 'bg-purple-100 border-purple-300 text-[#582C6D]'
    },
    {
      title: '8. Explainable Vehicle Insight Presentation',
      items: ['Natural-Language Driver Explanation', 'Evidence-Backed Verification Cards', 'Interactive OEM R&D Engineering Dashboard'],
      color: 'bg-emerald-100 border-emerald-300 text-emerald-950 font-bold'
    }
  ];

  const techStack = [
    { category: 'SIMULATION', tech: 'Deterministic Vehicle State Engine / CARLA Synthetic Stream' },
    { category: 'DATA', tech: 'CAN-FD / SOME-IP / Android Vehicle HAL / AUTOSAR Classic & Adaptive' },
    { category: 'PROCESSING', tech: 'Zero-Copy Stream Ingestion / Rolling Ring Buffers' },
    { category: 'STORAGE', tech: 'Local Embedded Time-Series DB (DuckDB / SQLite) + Vector Search' },
    { category: 'AI ENGINE', tech: 'On-Device Quantized SLM (3B-INT4) / Deterministic Analytics' },
    { category: 'INTERFACE', tech: 'Automotive Digital Cockpit / Voice Assistant / Web Dashboard' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B192C]/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-[#0B192C] text-white">
              <Layers className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0B192C]">
                VehicleGPT End-to-End System Architecture
              </h3>
              <p className="text-xs text-slate-500">
                Software-Defined Vehicle (SDV) On-Device Intelligence Specification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Architectural Pipeline Flow */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-1.5">
              <span>Data Flow Pipeline (Vehicle Ingestion → On-Device Explanation)</span>
            </h4>
            <div className="space-y-2">
              {pipelineLayers.map((layer, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className={`w-full p-3 rounded-lg border text-left shadow-xs ${layer.color}`}>
                    <div className="text-xs font-mono font-bold mb-1">{layer.title}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {layer.items.map((item, itemIdx) => (
                        <span key={itemIdx} className="text-[11px] bg-white/80 px-2 py-0.5 rounded border border-black/10">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  {idx < pipelineLayers.length - 1 && (
                    <ArrowDown className="w-3.5 h-3.5 text-slate-400 my-0.5" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Technology Representation (Req 21) */}
          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 mb-3">
              Production Technology Stack Representation
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {techStack.map((tech, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                  <span className="font-mono font-bold text-slate-700 block text-[10px] uppercase mb-0.5">
                    {tech.category}
                  </span>
                  <span className="text-slate-900 font-medium">{tech.tech}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Deployment Target: Cockpit Domain Controller (SA8295P / Orin)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#0B192C] text-white hover:bg-[#1E3E62] font-semibold text-xs transition-colors"
          >
            Close Architecture View
          </button>
        </div>

      </div>
    </div>
  );
};
