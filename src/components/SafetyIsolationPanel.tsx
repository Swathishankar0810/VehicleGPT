import React from 'react';
import { ShieldCheck, ShieldAlert, Check, X, Lock, Cpu, Radio } from 'lucide-react';

export const SafetyIsolationPanel: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 lg:p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center space-x-2">
          <Lock className="w-4 h-4 text-emerald-600" />
          <h2 className="text-sm font-bold tracking-tight text-[#0B192C] uppercase font-mono">
            Safety Isolation Architecture (ISO 26262 ASIL-D Boundary)
          </h2>
        </div>
        <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200 font-semibold">
          UNIDIRECTIONAL DATA DIODE ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
        
        {/* DOMAIN A: Vehicle Intelligence Layer */}
        <div className="p-3.5 rounded-lg bg-emerald-50/50 border border-emerald-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-emerald-900 uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Vehicle Intelligence Layer (VehicleGPT)
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                READ-ONLY PERMITTED
              </span>
            </div>
            <p className="text-xs text-emerald-800 mb-3">
              On-device SLM runs in isolated userspace memory partition with read-only access to CAN/SOME-IP telemetry.
            </p>
            <ul className="space-y-1.5 text-xs text-emerald-900">
              <li className="flex items-center space-x-2">
                <div className="h-4 w-4 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-800">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span><strong>Read</strong> Real-Time CAN &amp; SOME-IP Telemetry</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="h-4 w-4 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-800">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span><strong>Analyze</strong> Historical Sessions &amp; Energy Trends</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="h-4 w-4 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-800">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span><strong>Explain</strong> Diagnostics &amp; Range in Natural Language</span>
              </li>
            </ul>
          </div>
          <div className="mt-3 pt-2 border-t border-emerald-200/60 text-[10px] font-mono text-emerald-700">
            Boundary: Hardware Memory Protection Unit (MPU)
          </div>
        </div>

        {/* DOMAIN B: Safety-Critical Control Systems */}
        <div className="p-3.5 rounded-lg bg-red-50/50 border border-red-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-red-900 uppercase flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                Safety-Critical Vehicle Control Systems
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-100 text-red-800 font-bold">
                STRICTLY PROHIBITED
              </span>
            </div>
            <p className="text-xs text-red-800 mb-3">
              VehicleGPT CANNOT issue commands or actuate actuators on safety-critical physical systems.
            </p>
            <ul className="space-y-1.5 text-xs text-red-900">
              <li className="flex items-center space-x-2">
                <div className="h-4 w-4 rounded-full bg-red-200 flex items-center justify-center text-red-800">
                  <X className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span><strong>CANNOT</strong> Control Steering Actuation</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="h-4 w-4 rounded-full bg-red-200 flex items-center justify-center text-red-800">
                  <X className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span><strong>CANNOT</strong> Control Braking Systems</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="h-4 w-4 rounded-full bg-red-200 flex items-center justify-center text-red-800">
                  <X className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span><strong>CANNOT</strong> Control Throttle / Accelerator</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="h-4 w-4 rounded-full bg-red-200 flex items-center justify-center text-red-800">
                  <X className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span><strong>CANNOT</strong> Modify Airbags or ASIL-D Systems</span>
              </li>
            </ul>
          </div>
          <div className="mt-3 pt-2 border-t border-red-200/60 text-[10px] font-mono text-red-700">
            Physical Isolation: Gateway Microcontroller (TC399/RH850)
          </div>
        </div>

      </div>
    </div>
  );
};
