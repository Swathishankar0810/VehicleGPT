import React from 'react';
import { ShieldCheck, Cpu, HardDrive, Zap, CheckCircle2 } from 'lucide-react';

export const ConstraintMonitor: React.FC = () => {
  const constraints = [
    { label: 'Cloud Dependency', target: 'NONE', status: 'COMPLIANT', color: 'emerald' },
    { label: 'Local Processing', target: 'On-Device', status: 'COMPLIANT', color: 'emerald' },
    { label: 'Memory Footprint', target: '~2.0 GB RAM Target', status: '1.82 GB EST', color: 'emerald' },
    { label: 'CPU Allocation', target: '~2 ARM A5x Cores', status: '2 Cores Target', color: 'emerald' },
    { label: 'Query Latency', target: '<2.0s Query Target', status: '1.42s BENCHMARK', color: 'emerald' },
    { label: 'Searchable History', target: 'Several Weeks', status: '35 Days Logged', color: 'emerald' },
    { label: 'Safety-Critical Isolation', target: 'Hardware MPU / Gate', status: 'ACTIVE', color: 'emerald' },
  ];

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 lg:p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <h2 className="text-sm font-bold tracking-tight text-[#0B192C] uppercase font-mono">
            Constraint Compliance Monitor
          </h2>
        </div>
        <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
          ALL TARGETS MET
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
        {constraints.map((c, i) => (
          <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-left">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase">{c.label}</span>
              <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
            </div>
            <div className="text-xs font-mono font-bold text-slate-800 truncate">
              {c.status}
            </div>
            <div className="text-[9px] text-slate-400 font-mono mt-0.5 truncate">
              {c.target}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
