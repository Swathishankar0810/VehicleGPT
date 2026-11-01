import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, X, Sparkles, CheckCircle2, ChevronRight, AlertTriangle } from 'lucide-react';
import { SimulationScenario } from '../types/vehicle';

interface DemoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerScenario: (scenario: SimulationScenario) => void;
  onTriggerQuery: (question: string) => void;
}

export const DemoTourModal: React.FC<DemoTourModalProps> = ({
  isOpen,
  onClose,
  onTriggerScenario,
  onTriggerQuery,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const demoSteps = [
    {
      step: 1,
      title: 'Vehicle Simulation Initialized',
      description: 'Vehicle telematics active on CAN-FD & Ethernet SOME/IP bus at 10Hz rate. Nominal speed, SoC, and temperatures updating continuously.',
      action: () => onTriggerScenario('NORMAL_DRIVE'),
      duration: 3500,
    },
    {
      step: 2,
      title: 'High Powertrain Load Injected',
      description: 'Vehicle initiates steep 7% highway uphill climb. Battery discharge current surges to 194.2A, initiating steep internal ohmic heating.',
      action: () => onTriggerScenario('BATTERY_THERMAL_EVENT'),
      duration: 4000,
    },
    {
      step: 3,
      title: 'Anomaly Detected & Warning Logged',
      description: 'Battery temperature crosses 42.0°C threshold (+3.4°C/min gradient). Event stream logs DTC: DTC_BATT_OVERHEAT_WARN_B402.',
      action: () => {},
      duration: 3500,
    },
    {
      step: 4,
      title: 'Natural-Language Question Posed',
      description: 'Driver / Engineer asks: "What happened before the battery overheating warning?" On-device VehicleGPT pipeline activates.',
      action: () => onTriggerQuery('What happened before the battery overheating warning?'),
      duration: 3500,
    },
    {
      step: 5,
      title: 'Hybrid Retrieval & Time-Series Slice',
      description: 'Zero-cloud edge engine retrieves 60-second synchronized telemetry buffer + diagnostic history without external network egress.',
      action: () => {},
      duration: 3500,
    },
    {
      step: 6,
      title: 'Deterministic Event Correlation',
      description: 'Analytics engine computes r = 0.94 causal correlation between 194A current spike and thermal climb, ruling out cooling pump failure.',
      action: () => {},
      duration: 3500,
    },
    {
      step: 7,
      title: 'On-Device SLM Synthesis & Grounded Evidence',
      description: 'Quantized SLM formats explainable root cause, contributing factors, and numeric evidence in under 1.5 seconds locally.',
      action: () => {},
      duration: 4500,
    }
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
      return;
    }

    demoSteps[0].action();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const currentStep = demoSteps[currentStepIndex];
    const timer = setTimeout(() => {
      if (currentStepIndex < demoSteps.length - 1) {
        const nextIdx = currentStepIndex + 1;
        setCurrentStepIndex(nextIdx);
        demoSteps[nextIdx].action();
      } else {
        setIsPlaying(false);
      }
    }, currentStep.duration);

    return () => clearTimeout(timer);
  }, [isOpen, isPlaying, currentStepIndex]);

  if (!isOpen) return null;

  const currentStep = demoSteps[currentStepIndex];
  const progressPercent = ((currentStepIndex + 1) / demoSteps.length) * 100;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-lg bg-white rounded-2xl border-2 border-[#795290] shadow-2xl p-4 animate-slideUp">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded bg-[#795290] text-white">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#0B192C] uppercase font-mono">
              Automated Judge Demonstration (Step {currentStepIndex + 1} of {demoSteps.length})
            </h4>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs"
            title={isPlaying ? "Pause Demo" : "Resume Demo"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-3">
        <div 
          className="bg-gradient-to-r from-[#795290] to-[#582C6D] h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Step Info */}
      <div className="mb-3">
        <div className="text-sm font-bold text-[#0B192C] flex items-center gap-1.5 mb-1">
          <span className="text-[#795290] font-mono">#{currentStep.step}</span>
          <span>{currentStep.title}</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          {currentStep.description}
        </p>
      </div>

      {/* Controller Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
        <span className="font-mono text-[10px] text-slate-400">
          Target: 25-Sec Complete Solution Proof
        </span>
        <div className="flex items-center space-x-2">
          {currentStepIndex < demoSteps.length - 1 ? (
            <button
              onClick={() => {
                const nextIdx = currentStepIndex + 1;
                setCurrentStepIndex(nextIdx);
                demoSteps[nextIdx].action();
              }}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center gap-1"
            >
              <span>Next Step</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1 shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Demo Completed</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
