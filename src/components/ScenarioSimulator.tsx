import React from 'react';
import { SimulationScenario } from '../types/vehicle';
import { 
  Play, 
  Flame, 
  Compass, 
  TrendingDown, 
  Gauge, 
  Car, 
  Zap, 
  Activity 
} from 'lucide-react';

interface ScenarioSimulatorProps {
  currentScenario: SimulationScenario;
  onSelectScenario: (scenario: SimulationScenario) => void;
  isPresentationMode?: boolean;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({
  currentScenario,
  onSelectScenario,
  isPresentationMode,
}) => {
  const scenarios: {
    id: SimulationScenario;
    label: string;
    description: string;
    icon: React.ElementType;
    badge?: string;
    color: string;
  }[] = [
    {
      id: 'NORMAL_DRIVE',
      label: 'Normal Driving',
      description: 'Steady 64 km/h cruising, balanced energy (15.2 kWh/100km)',
      icon: Car,
      color: 'slate'
    },
    {
      id: 'HIGHWAY_DRIVE',
      label: 'Highway Drive',
      description: '118 km/h sustained cruising, aerodynamic drag, L2 ADAS',
      icon: Gauge,
      color: 'blue'
    },
    {
      id: 'CITY_DRIVE',
      label: 'City Drive',
      description: 'Frequent stop-and-go, heavy regen recovery, urban HVAC draw',
      icon: Compass,
      color: 'emerald'
    },
    {
      id: 'HIGH_LOAD',
      label: 'High Load',
      description: 'Steep grade hill climb, continuous 175A current draw',
      icon: Activity,
      color: 'amber'
    },
    {
      id: 'BATTERY_THERMAL_EVENT',
      label: 'Battery Thermal Event',
      description: 'Pack temp surges to 43.5°C → Triggers DTC warning',
      icon: Flame,
      badge: 'DEMO HIGHLIGHT',
      color: 'red'
    },
    {
      id: 'RANGE_DEGRADATION',
      label: 'Range Degradation',
      description: 'Simulates 12% range reduction from winter HVAC + city traffic',
      icon: TrendingDown,
      badge: 'PRIMARY SCENARIO',
      color: 'purple'
    }
  ];

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 lg:p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center space-x-2">
          <Play className="w-4 h-4 text-[#795290]" />
          <h2 className="text-sm font-bold tracking-tight text-[#0B192C] uppercase font-mono">
            Interactive Scenario Simulator
          </h2>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Inject Real-Time Operating Conditions
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {scenarios.map((sc) => {
          const Icon = sc.icon;
          const isSelected = currentScenario === sc.id;

          return (
            <button
              key={sc.id}
              onClick={() => onSelectScenario(sc.id)}
              className={`p-3 rounded-lg border text-left transition-all relative flex flex-col justify-between ${
                isSelected 
                  ? 'bg-purple-50/80 border-[#795290] ring-1 ring-[#795290] shadow-sm' 
                  : 'bg-slate-50/60 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {sc.badge && (
                <span className="absolute -top-2 right-2 text-[8px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#795290] text-white shadow-xs">
                  {sc.badge}
                </span>
              )}
              <div>
                <div className="flex items-center space-x-1.5 mb-1.5">
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#795290]' : 'text-slate-500'}`} />
                  <span className={`text-xs font-bold ${isSelected ? 'text-[#582C6D]' : 'text-slate-800'}`}>
                    {sc.label}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  {sc.description}
                </p>
              </div>

              <div className="mt-2 pt-1 border-t border-slate-200/50 flex items-center justify-between text-[9px] font-mono">
                <span className={isSelected ? 'text-[#795290] font-bold' : 'text-slate-400'}>
                  {isSelected ? 'ACTIVE SCENARIO' : 'Click to Inject'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
